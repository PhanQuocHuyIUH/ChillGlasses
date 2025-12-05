const Footer = () => {
  return (
    <footer className="bg-gray-600 text-white w-full">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-4">
        {/* Thông tin cửa hàng */}
        <div>
          <h3 className="text-lg font-bold mb-4">Thông tin cửa hàng</h3>
          <p>Chill Glasses</p>
          <p>Địa chỉ: 12 Nguyễn Văn Bảo, Phường Hạnh Thông, TP.HCM</p>
          <p>Điện thoại: 0123 456 789</p>
          <p>Email: support@chillglasses.com</p>
        </div>

        {/* Thời gian mở cửa */}
        <div>
          <h3 className="text-lg font-bold mb-4">Thời gian mở cửa</h3>
          <p>Thứ 2 - Thứ 6: 8:00 - 20:00</p>
          <p>Thứ 7: 9:00 - 18:00</p>
          <p>Chủ Nhật: Nghỉ</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-bold mb-4">Kết nối với chúng tôi</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-400">
              Facebook
            </a>
            <a href="#" className="hover:text-gray-400">
              Instagram
            </a>
            <a href="#" className="hover:text-gray-400">
              Twitter
            </a>
          </div>
        </div>

        {/* Bản quyền */}
        <div>
          <h3 className="text-lg font-bold mb-4">Bản quyền</h3>
          <p>&copy; 2025 Chill Glasses. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;