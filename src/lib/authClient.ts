// src/lib/authClient.ts

// Hàm check xem đã login chưa (dựa trên token trong localStorage)
export function isLoggedIn(): boolean {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("token");
    return !!token;
}

/**
 * Dùng trong onClick/handler ở client:
 *  - Nếu chưa login:
 *      + Hiện alert (hoặc sau này đổi thành toast)
 *      + Redirect sang /login?redirect=<đường về>
 *      + return true = đã chặn
 *  - Nếu đã login:
 *      + return false = cho phép xử lý tiếp
 */
export function requireLogin(options: {
    router: { push: (url: string) => void };
    redirectTo?: string;
    message?: string;
}): boolean {
    const { router, redirectTo = "/", message } = options;

    if (!isLoggedIn()) {
        alert(
            message ||
            "Vui lòng đăng nhập để tiếp tục sử dụng chức năng này."
        );

        const encoded = encodeURIComponent(redirectTo);
        router.push(`/login?redirect=${encoded}`);
        return true;
    }

    return false;
}
