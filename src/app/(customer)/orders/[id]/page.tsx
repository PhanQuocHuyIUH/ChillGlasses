"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

// Mẫu dữ liệu đơn hàng
const sampleOrders = [
    {
        id: "DH001",
        status: "Đang giao",
        shippingFee: 30000,
        recipient: {
            name: "Nguyễn Văn A",
            phone: "0123456789",
            address: "123 đường ABC, Quận 1, TPHCM",
            payment: "COD",
        },
        items: [
            {
                id: 1,
                name: "Gọng Kính Đen Basic",
                price: 350000,
                quantity: 1,
                image: "/images/product1.jpg",
            },
            {
                id: 2,
                name: "Kính Râm Thời Trang",
                price: 550000,
                quantity: 2,
                image: "/images/product2.jpg",
            },
        ],
    },
];

const formatPrice = (value: number) => {
    return value.toLocaleString("vi-VN");
};

const OrderDetailPage = () => {
    const params = useParams();
    const orderId = params?.id as string;

    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        const found = sampleOrders.find((order) => order.id === orderId);
        setOrder(found || null);
    }, [orderId]);

    if (!order) {
        return (
            <div className="pt-24 pb-16 text-center text-gray-500">
                <h1 className="text-2xl font-bold">Không tìm thấy đơn hàng</h1>
            </div>
        );
    }

    const subtotal = order.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
    );

    const total = subtotal + order.shippingFee;

    return (
        <div className="min-h-screen bg-gray-100 pt-24 pb-32 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold">Chi tiết đơn hàng {order.id}</h1>

                <div className="bg-white shadow p-6 rounded-lg">
                    <p className="font-semibold">
                        Trạng thái: <span className="text-blue-600">{order.status}</span>
                    </p>
                </div>

                <div className="bg-white shadow p-6 rounded-lg space-y-4">
                    <h2 className="text-xl font-semibold">Thông tin giao hàng</h2>
                    <p><strong>Họ tên:</strong> {order.recipient.name}</p>
                    <p><strong>Số điện thoại:</strong> {order.recipient.phone}</p>
                    <p><strong>Địa chỉ:</strong> {order.recipient.address}</p>
                    <p><strong>Thanh toán:</strong> {order.recipient.payment}</p>
                </div>

                <div className="bg-white shadow p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>

                    <div className="space-y-4">
                        {order.items.map((item: any) => (
                            <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-gray-600">
                                        {formatPrice(item.price)} x {item.quantity}
                                    </p>
                                </div>
                                <p className="font-bold">
                                    {formatPrice(item.price * item.quantity)} đ
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white shadow p-6 rounded-lg space-y-2">
                    <h2 className="text-xl font-semibold">Tổng tiền</h2>
                    <div className="flex justify-between">
                        <span>Tạm tính:</span>
                        <span>{formatPrice(subtotal)} đ</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Phí giao hàng:</span>
                        <span>{formatPrice(order.shippingFee)} đ</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Tổng cộng:</span>
                        <span>{formatPrice(total)} đ</span>
                    </div>
                </div>

                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg">
                    Yêu cầu hủy đơn
                </button>
            </div>
        </div>
    );
};

export default OrderDetailPage;
