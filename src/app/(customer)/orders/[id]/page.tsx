"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
    getOrderDetail,
    type OrderDetail,
    type OrderStatus,
    requestCancelOrder,
} from "@/lib/api/orders";

const formatPrice = (value: number) => {
    return value.toLocaleString("vi-VN");
};

const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("vi-VN");
};

const statusLabel: Record<OrderStatus, string> = {
    PENDING: "Chờ xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPED: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
};

const statusBadgeClass: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
};

const CANCEL_REASONS = [
    "Mua nhầm số lượng",
    "Quên áp mã giảm giá",
    "Sai thông tin người nhận / địa chỉ / số điện thoại",
];

const LOCAL_CANCEL_NOTES_KEY = "cancelNotes";

const OrderDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string | undefined;

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReasons, setCancelReasons] = useState<string[]>([]);
    const [otherReason, setOtherReason] = useState("");
    const [submittingCancel, setSubmittingCancel] = useState(false);

    // 🧠 Helper: đọc lý do hủy từ localStorage (nếu có)
    const getLocalCancelNote = (id: number): string | undefined => {
        if (typeof window === "undefined") return undefined;
        try {
            const raw = localStorage.getItem(LOCAL_CANCEL_NOTES_KEY);
            if (!raw) return undefined;

            const parsed = JSON.parse(raw) as Record<string, string>;
            const found = parsed[String(id)];
            return typeof found === "string" ? found : undefined;
        } catch (e) {
            console.warn("Không đọc được cancelNotes từ localStorage:", e);
            return undefined;
        }
    };

    // 🧠 Helper: lưu lý do hủy vào localStorage
    const saveLocalCancelNote = (id: number, note: string) => {
        if (typeof window === "undefined") return;
        try {
            const raw = localStorage.getItem(LOCAL_CANCEL_NOTES_KEY);
            const parsed = raw ? (JSON.parse(raw) as Record<string, string>) : {};
            parsed[String(id)] = note;
            localStorage.setItem(LOCAL_CANCEL_NOTES_KEY, JSON.stringify(parsed));
        } catch (e) {
            console.warn("Không lưu được cancelNotes vào localStorage:", e);
        }
    };

    useEffect(() => {
        if (!orderId) {
            setError("Thiếu mã đơn hàng trên URL.");
            setLoading(false);
            return;
        }

        const numericId = Number(orderId);
        if (Number.isNaN(numericId)) {
            setError("Mã đơn hàng không hợp lệ.");
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getOrderDetail(numericId);

                if (!isMounted) return;

                // Nếu đơn đã hủy mà notes từ BE trống → thử lấy từ localStorage
                if (data.status === "CANCELLED" && !data.notes) {
                    const localNote = getLocalCancelNote(data.id);
                    setOrder(
                        localNote
                            ? {
                                ...data,
                                notes: localNote,
                            }
                            : data
                    );
                } else {
                    setOrder(data);
                }
            } catch (err) {
                console.error("Lỗi load chi tiết đơn:", err);
                if (!isMounted) return;
                setError("Không thể tải chi tiết đơn hàng. Vui lòng thử lại.");
                setOrder(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDetail();

        return () => {
            isMounted = false;
        };
    }, [orderId]);

    const subtotal = order
        ? order.items.reduce(
            (sum, item) => sum + item.productPrice * item.quantity,
            0
        )
        : 0;

    const shippingFee = order?.shippingFee ?? 0;
    const total = order?.totalAmount ?? subtotal + shippingFee;

    const toggleReason = (reason: string) => {
        setCancelReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason]
        );
    };

    const handleOpenCancelModal = () => {
        setShowCancelModal(true);
    };

    const handleCloseCancelModal = () => {
        setShowCancelModal(false);
        setSubmittingCancel(false);
        // Nếu muốn reset khi đóng popup:
        // setCancelReasons([]);
        // setOtherReason("");
    };

    const handleConfirmCancel = async () => {
        if (!order) return;

        if (cancelReasons.length === 0 && otherReason.trim() === "") {
            alert("Vui lòng chọn ít nhất một lý do hoặc nhập lý do khác.");
            return;
        }

        // 🧠 Gộp lý do lại thành 1 chuỗi rõ ràng để gán vào notes
        const parts: string[] = [];

        if (cancelReasons.length > 0) {
            parts.push("Lý do đã chọn: " + cancelReasons.join(" | "));
        }

        if (otherReason.trim() !== "") {
            parts.push("Lý do khác: " + otherReason.trim());
        }

        const cancelNote = "Lý do hủy đơn: " + parts.join(" || ");

        try {
            setSubmittingCancel(true);

            await requestCancelOrder(order.id, {
                notes: cancelNote,
                reasons: cancelReasons,
                otherReason: otherReason.trim() || undefined,
            });

            // Lưu vào localStorage để lần sau mở lại vẫn thấy
            saveLocalCancelNote(order.id, cancelNote);

            // Cập nhật UI
            setOrder((prev) =>
                prev
                    ? {
                        ...prev,
                        status: "CANCELLED" as OrderStatus,
                        notes: cancelNote,
                    }
                    : prev
            );

            alert(
                "Đơn hàng đã được hủy. Cảm ơn bạn đã cho chúng tôi biết lý do."
            );

            setShowCancelModal(false);
        } catch (err) {
            console.error("Lỗi khi gửi yêu cầu hủy đơn:", err);
            alert("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
        } finally {
            setSubmittingCancel(false);
        }
    };

    // Chỉ cho hủy khi đơn đang PENDING
    const canRequestCancel = order && order.status === "PENDING";

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-32 px-4">
                <div className="max-w-4xl mx-auto text-center text-gray-500">
                    Đang tải chi tiết đơn hàng...
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-32 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-red-500 mb-4">
                        {error || "Không tìm thấy đơn hàng."}
                    </p>
                    <button
                        onClick={() => router.push("/orders")}
                        className="inline-block px-4 py-2 text-sm bg-black text-white rounded-lg"
                    >
                        Quay lại lịch sử đơn hàng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pt-24 pb-32 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header + trạng thái + quay lại */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            Chi tiết đơn hàng {order.orderCode}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Ngày đặt: {formatDateTime(order.orderDate)}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass[order.status]}`}
                        >
                            {statusLabel[order.status]}
                        </span>
                        <button
                            type="button"
                            onClick={() => router.push("/orders")}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            ⟵ Quay lại lịch sử đơn hàng
                        </button>
                    </div>
                </div>

                {/* Nếu là đơn đã hủy và có lý do hủy → show block nổi bật */}
                {order.status === "CANCELLED" && order.notes && (
                    <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-lg">
                        <p className="font-semibold mb-1">
                            Lý do hủy đơn hàng:
                        </p>
                        <p>{order.notes}</p>
                    </div>
                )}

                {/* Thông tin đơn hàng */}
                <div className="bg-white shadow p-6 rounded-lg space-y-2">
                    <h2 className="text-lg font-semibold mb-2">
                        Thông tin đơn hàng
                    </h2>
                    <p>
                        <strong>Khách hàng:</strong> {order.userFullName}
                    </p>
                    <p>
                        <strong>Email:</strong> {order.userEmail}
                    </p>
                    <p>
                        <strong>Địa chỉ giao hàng:</strong>{" "}
                        {order.shippingAddress}
                    </p>
                    <p>
                        <strong>Phương thức giao hàng:</strong>{" "}
                        {order.shippingMethod}
                    </p>
                    <p>
                        <strong>Thanh toán:</strong> {order.paymentMethod} (
                        {order.paymentStatus === "PAID"
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"}
                        )
                    </p>
                    {/* Giữ lại ghi chú gốc nếu có (ví dụ từ checkout) */}
                    {order.notes &&
                        order.status !== "CANCELLED" && (
                            <p>
                                <strong>Ghi chú:</strong> {order.notes}
                            </p>
                        )}
                </div>

                {/* Sản phẩm */}
                <div className="bg-white shadow p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>

                    <div className="space-y-4">
                        {order.items.map((item) => {
                            const safeImageSrc =
                                item.productImage &&
                                typeof item.productImage === "string" &&
                                item.productImage.trim() !== ""
                                    ? item.productImage
                                    : "/images/product1.jpg";

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                                >
                                    <div className="w-20 h-20 relative bg-gray-100 rounded overflow-hidden">
                                        <Image
                                            src={safeImageSrc}
                                            alt={item.productName || "Sản phẩm"}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold">
                                            {item.productName}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            Mã sản phẩm: {item.productSlug}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {item.formattedPrice} x{" "}
                                            {item.quantity}
                                        </p>
                                    </div>

                                    <p className="font-semibold text-sm">
                                        {item.formattedSubtotal}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tổng tiền */}
                <div className="bg-white shadow p-6 rounded-lg space-y-2">
                    <h2 className="text-lg font-semibold">Tổng tiền</h2>
                    <div className="flex justify-between text-sm">
                        <span>Tạm tính:</span>
                        <span>{formatPrice(subtotal)} đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Phí giao hàng:</span>
                        <span>{formatPrice(shippingFee)} đ</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                        <span>Tổng cộng:</span>
                        <span>{formatPrice(total)} đ</span>
                    </div>
                </div>

                {/* Hủy đơn hoặc hỗ trợ */}
                {canRequestCancel ? (
                    <button
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg text-sm"
                        type="button"
                        onClick={handleOpenCancelModal}
                    >
                        Yêu cầu hủy đơn
                    </button>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-lg">
                        <p className="font-semibold mb-1">
                            Quý khách hàng xin lưu ý:
                        </p>
                        <p>
                            Cần hỗ trợ, vui lòng liên hệ: Điện thoại:{" "}
                            <span className="font-semibold">
                                0123 456 789
                            </span>{" "}
                            hoặc Email:{" "}
                            <span className="font-semibold">
                                support@chillglasses.com
                            </span>{" "}
                            (hỗ trợ 24/24).
                        </p>
                    </div>
                )}
            </div>

            {/* Popup hủy đơn */}
            {showCancelModal && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                    <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
                        <button
                            type="button"
                            onClick={handleCloseCancelModal}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm"
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-semibold mb-2">
                            Yêu cầu hủy đơn {order.orderCode}
                        </h2>
                        <p className="text-xs text-gray-500 mb-4">
                            Vui lòng chọn lý do hủy đơn. Thông tin này giúp
                            chúng tôi cải thiện dịch vụ tốt hơn.
                        </p>

                        <div className="space-y-2 mb-3 text-sm">
                            {CANCEL_REASONS.map((reason) => (
                                <label
                                    key={reason}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={cancelReasons.includes(reason)}
                                        onChange={() => toggleReason(reason)}
                                    />
                                    <span>{reason}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Lý do khác (tuỳ chọn)
                            </label>
                            <textarea
                                value={otherReason}
                                onChange={(e) =>
                                    setOtherReason(e.target.value)
                                }
                                className="w-full border rounded px-3 py-2 text-sm min-h-[70px]"
                                placeholder="Nhập thêm thông tin nếu bạn muốn..."
                            />
                        </div>

                        <div className="flex gap-2 justify-end text-sm">
                            <button
                                type="button"
                                onClick={handleCloseCancelModal}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                                disabled={submittingCancel}
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmCancel}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-60"
                                disabled={submittingCancel}
                            >
                                {submittingCancel
                                    ? "Đang gửi..."
                                    : "Xác nhận hủy đơn"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetailPage;
