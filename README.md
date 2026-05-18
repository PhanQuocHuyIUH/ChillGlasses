# Chill Glasses - E-commerce Project

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

---

## 🔀 Git Workflow

### Quy tắc làm việc với Git

# Chill Glasses

Chill Glasses là một ứng dụng thương mại điện tử (e‑commerce) xây dựng để bán kính mắt. Dự án là một full‑stack demo/learning project kết hợp frontend Next.js + TailwindCSS với backend Spring Boot.

Mục tiêu: cung cấp trải nghiệm mua sắm trực tuyến cơ bản gồm danh mục sản phẩm, giỏ hàng, quy trình thanh toán, quản lý hồ sơ người dùng và bảng điều khiển admin.

## Tính năng chính

- Danh mục & danh sách sản phẩm
- Trang chi tiết sản phẩm (ảnh, mô tả, giá)
- Giỏ hàng, Checkout và tạo đơn hàng
- Xác thực người dùng (đăng ký/đăng nhập), profile và upload avatar
- Quản trị (Admin): quản lý sản phẩm, đơn hàng và người dùng
- Đánh giá sản phẩm & quản lý đánh giá
- Thông báo & gửi email (backend)
- Chat/Customer support integration (component frontend + backend support)

## Công nghệ

- Frontend: Next.js, React, Tailwind CSS, Axios
- Backend: Spring Boot, Spring Data JPA, Maven
- Database: MySQL / MariaDB (hoặc H2 cho môi trường dev)
- Authentication: JWT

## Cài đặt & chạy nhanh

Yêu cầu: `node` (v16+), `npm` hoặc `pnpm`, `java` (17+), `mvn`/`./mvnw`.

Frontend

```bash
cd chill-glasses
npm install
npm run dev
```

Backend

```bash
cd ChillGlassesBackend
./mvnw spring-boot:run    # hoặc 'mvn spring-boot:run'
```

Thiết lập biến môi trường: sao chép file `.env.example` hoặc `application.properties` mẫu và cấu hình kết nối DB, SMTP, JWT secret.

## Phát triển & góp ý

- Branching: tạo branch `dev/task-xxx` từ `develop` cho mỗi task.
- PR: tạo Pull Request từ branch của bạn vào `develop`, yêu cầu review trước khi merge.
- Code style: tuân theo quy ước dự án, giữ commits nhỏ và có message rõ ràng.

## Cần hỗ trợ?

Nếu bạn gặp lỗi khi chạy, gửi issue kèm log lỗi và bước tái hiện trên GitHub repository, hoặc liên hệ trực tiếp với nhóm phát triển.

License: MIT