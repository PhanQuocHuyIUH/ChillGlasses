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

⚠️ **QUAN TRỌNG**: Không commit trực tiếp lên `main` hoặc `develop`

### Quy trình làm việc cho mỗi task:

1. **Cập nhật nhánh develop**

   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Tạo nhánh mới cho task**

   ```bash
   git checkout -b dev/task-xxx
   ```

   Ví dụ: `dev/task-01`, `dev/task-02`, `dev/task-login`, v.v.

3. **Làm việc và commit**

   ```bash
   # Sau khi code xong
   git add .
   git commit -m "feat: mô tả task"
   ```

4. **Push nhánh lên remote**

   ```bash
   git push origin dev/task-xxx
   ```

5. **Tạo Pull Request**

   - Tạo PR từ `dev/task-xxx` → `develop`

### Ví dụ minh họa:

```bash
# Task 1: Public Layout
git checkout develop
git pull origin develop
git checkout -b dev/task-01-public-layout
# ... code xong ...
git add .
git commit -m "feat: implement public layout with header and footer"
git push origin dev/task-01-public-layout
# Tạo PR: dev/task-01-public-layout → develop trên github
```

---

## 📋 Task List

### A. UI – Khách hàng

#### **Task 1 – Public Layout (Header, Footer, Layout chung)**

> 👤 **Người phụ trách**: Trâm Anh

Tạo layout dùng chung cho các trang public.

- **Header**: logo, menu (Trang chủ, Sản phẩm, Khuyến mãi, Liên hệ/Giới thiệu), ô search, icon giỏ hàng, login/register
- **Footer**: thông tin liên hệ, social, bản quyền
- **Responsive** cơ bản

---

#### **Task 2 – Trang Home**

> 👤 **Người phụ trách**: Trâm Anh

- Banner
- Section sản phẩm nổi bật / bán chạy
- Section danh mục sản phẩm (Gọng kính, Tròng kính, …)
- Section khuyến mãi

---

#### **Task 3 – Trang danh sách sản phẩm (Product Listing Page)**

> 👤 **Người phụ trách**: Trâm Anh

- Trang `/products`: hiển thị grid sản phẩm (ảnh, tên, giá, rating)
- Phân trang hoặc nút "Load more"
- Responsive

---

#### **Task 4 – Bộ lọc & tìm kiếm sản phẩm (UI Only)**

> 👤 **Người phụ trách**: Trâm Anh

- **UI filter**: theo giá, thương hiệu, kiểu dáng, chất liệu
- **UI sort**: giá tăng/giảm, mới nhất
- Kết nối filter/sort với state tạm thời

---

#### **Task 5 – Trang chi tiết sản phẩm (Product Detail Page)**

> 👤 **Người phụ trách**: Trâm Anh

- Hiển thị ảnh (carousel UI nếu cần), tên, giá, mô tả, thông số kỹ thuật, tồn kho
- Chọn số lượng
- Nút "Thêm vào giỏ hàng", "Mua ngay"
- Khu vực review: list đánh giá + nút "Viết đánh giá"

---

#### **Task 6 – Trang giỏ hàng (Cart Page)**

> 👤 **Người phụ trách**: Minh Duy

- Bảng danh sách sản phẩm trong giỏ: ảnh, tên, giá, số lượng, thành tiền
- Nút +/− số lượng, nút xóa sản phẩm
- Hiển thị tổng tiền

---

#### **Task 7 – Trang Checkout (UI)**

> 👤 **Người phụ trách**: Minh Duy

- Form thông tin giao hàng: họ tên, số điện thoại, địa chỉ, email
- Chọn phương thức giao hàng
- Chọn phương thức thanh toán (COD, Chuyển khoản, Ví)
- Review đơn hàng + tổng tiền + phí ship
- Nút "Xác nhận đặt hàng"

---

#### **Task 8 – Trang lịch sử đơn hàng (Order History – UI)**

> 👤 **Người phụ trách**: Minh Duy

- Trang danh sách đơn hàng
- Filter theo trạng thái: Chờ xác nhận, Đang giao, Đã giao, Đã hủy
- Click vào 1 đơn → mở trang chi tiết đơn

---

#### **Task 9 – Trang chi tiết đơn hàng (Order Detail – UI)**

- Hiển thị thông tin người nhận, địa chỉ, phương thức thanh toán
- Danh sách sản phẩm trong đơn
- Tổng tiền, trạng thái đơn
- Nút "Yêu cầu hủy đơn"

---

#### **Task 10 – UI đánh giá sản phẩm (Rating/Review Form)**

- Form: chọn số sao, nhập nội dung đánh giá
- Hiển thị trạng thái "chờ duyệt bởi admin"
- Hiển thị danh sách review dưới sản phẩm

---

#### **Task 11 – Trang Profile người dùng (User Profile)**

- Form chỉnh sửa: họ tên, số điện thoại, địa chỉ
- Email dạng read-only
- Form đổi mật khẩu
- Toggle bật/tắt 2FA

---

### B. UI – Authentication (Login/Register/Reset)

#### **Task 12 – Trang Đăng ký (Register Page)**

> 👤 **Người phụ trách**: Tuấn Huy

- Form: Họ tên, Email, SĐT, Địa chỉ, Mật khẩu, Xác nhận mật khẩu
- Validate cơ bản (required, confirm password, format email)
- Chỗ hiển thị lỗi email bị trùng

---

#### **Task 13 – Trang Đăng nhập (Login Page)**

> 👤 **Người phụ trách**: Tuấn Huy

- Form: Email + Mật khẩu
- Link "Quên mật khẩu"
- Field nhập mã OTP (2FA) – hiển thị khi cần thiết

---

#### **Task 14 – Flow Quên mật khẩu / Reset password (UI Flow)**

> 👤 **Người phụ trách**: Tuấn Huy

- Trang nhập email để yêu cầu reset
- Trang nhập OTP hoặc token + mật khẩu mới
- Hiển thị message "Kiểm tra email của bạn…"

---

### C. UI – Admin Dashboard

#### **Task 15 – Layout Dashboard Admin**

- Layout riêng `/admin`: sidebar + header
- **Sidebar**: Dashboard, Sản phẩm, Danh mục, Đơn hàng, Khách hàng, Đánh giá
- **Header**: tên admin, avatar, nút Logout

---

#### **Task 16 – Trang quản lý sản phẩm (Admin – UI)**

- Bảng sản phẩm: tên, danh mục, giá, tồn kho, trạng thái hiển thị
- Nút "Thêm sản phẩm mới" → modal/page form
- Các nút "Sửa" / "Xóa"

---

#### **Task 17 – Trang quản lý danh mục (Admin – UI)**

- Bảng danh mục: tên, mô tả
- Form thêm / sửa / xóa danh mục

---

#### **Task 18 – Trang quản lý đơn hàng (Admin – UI)**

- Bảng đơn hàng: mã đơn, khách hàng, ngày đặt, tổng tiền, trạng thái
- Click vào 1 dòng → trang chi tiết đơn hàng (có thể dùng lại UI Task 9 + thêm action admin)
- Dropdown thay đổi trạng thái đơn

---

#### **Task 19 – Trang quản lý người dùng (Admin – UI)**

- Bảng user: tên, email, role (CUSTOMER/ADMIN), trạng thái (active/locked)
- Nút "Khóa/Mở khóa"
- Nút "Chỉnh vai trò"

---

#### **Task 20 – Trang quản lý đánh giá (Admin – UI)**

- Bảng đánh giá: sản phẩm, user, nội dung, số sao, trạng thái (đã duyệt/chờ duyệt)
- Nút "Duyệt", "Ẩn", "Xóa"

---

#### **Task 21 – Trang Dashboard thống kê (Admin – UI)**

- Card hiển thị: tổng đơn hôm nay, doanh thu, số user mới
- Biểu đồ: doanh thu theo ngày/tháng
- Danh sách sản phẩm bán chạy

---

### D. Tích hợp API (Frontend ↔ Backend Spring Boot)

#### **Task 22 – Thiết lập HTTP client chung (Frontend Only)**

- Tạo `lib/apiClient.ts` dùng fetch hoặc axios
- Đọc `BASE_API_URL` từ `.env`
- Interceptor/header tự động gắn Authorization (nếu có token)
- Xử lý lỗi chung (toast / console)
- Dùng chung cho tất cả task API bên dưới

---

#### **Task 23 – Kết nối API Auth** (liên kết UI Task 11, 12, 14)

- Gọi API đăng ký, đăng nhập, logout, lấy thông tin user hiện tại
- Lưu token (cookie/localStorage) + cập nhật state auth
- Sau khi login: redirect theo role (CUSTOMER → trang user, ADMIN → `/admin`)
- Hiển thị lỗi từ backend lên form login/register

---

#### **Task 24 – Kết nối API Profile & đổi mật khẩu** (liên kết UI Task 11)

- Gọi API lấy thông tin profile user
- Gọi API cập nhật thông tin profile
- Gọi API đổi mật khẩu
- Gắn với form ở Task 11

---

#### **Task 25 – Kết nối API Sản phẩm & Danh mục** (liên kết UI Task 2, 3, 4, 5, 16, 17)

- Gọi API list sản phẩm cho trang Home & Product Listing
- Gọi API chi tiết sản phẩm cho trang Product Detail
- Truyền điều kiện filter/sort/search xuống API từ UI Task 4
- Admin: gọi API CRUD sản phẩm và danh mục từ UI Task 16, 17

---

#### **Task 26 – Kết nối API Giỏ hàng & Checkout** (liên kết UI Task 6, 7, 8, 9, 18)

- Gọi API giỏ hàng (nếu backend quản lý giỏ theo user)
- Gọi API tạo đơn hàng từ dữ liệu checkout
- Gọi API lấy danh sách đơn lịch sử & chi tiết đơn (Order History & Order Detail)
- Admin: gọi API update trạng thái đơn trong trang quản lý đơn (Task 18)

---

#### **Task 27 – Kết nối API Đánh giá & Thống kê** (liên kết UI Task 10, 20, 21)

- Gọi API tạo đánh giá từ form rating (Task 10)
- Gọi API list đánh giá cho mỗi sản phẩm
- Admin: gọi API duyệt/ẩn/xóa đánh giá (Task 20)
- Gọi API thống kê doanh thu, top sản phẩm, số đơn… cho Dashboard (Task 21)

---

### E. Security, UX, Performance, Testing (Frontend)

#### **Task 28 – Bảo vệ route & phân quyền (FE Only)**

- Guard route `/admin/**` chỉ cho user role ADMIN (dựa trên state auth từ Task 23)
- Bắt buộc login cho các trang: giỏ hàng, checkout, lịch sử đơn, profile, đánh giá

---

#### **Task 29 – Loading, Error & Toast**

- Component loading chung cho các trang gọi API
- Xử lý error hiển thị thân thiện (message + nút retry)
- Toast: đăng nhập thành công, đặt hàng thành công, lỗi hệ thống, v.v.

---

#### **Task 30 – Test các flow chính**

- Đăng nhập / đăng ký
- Thêm vào giỏ hàng & checkout
- Admin đổi trạng thái đơn
- Manual test lại các luồng chính end-to-end trên FE

---

## 📝 Notes

- UI tasks sử dụng data mẫu trước khi tích hợp API
- Tích hợp API sau khi hoàn thành các UI components
- Testing được thực hiện sau khi các tính năng chính hoàn thành
