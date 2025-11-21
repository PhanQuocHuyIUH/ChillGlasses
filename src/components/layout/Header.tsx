import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa"; // Import thêm icon FaUser
import Image from "next/image"; // Import Image from next/image
import logo from "../../../public/images/logo_chill_glasses.jpg"; // Import logo (ensure the path is correct)

const Header = () => {
  return (
    <header className="bg-white text-black w-full fixed top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        {/* <a href="/" className="flex items-center"> */}
          <Image
            src={logo}
            alt="Logo Chill Glasses"
            width={120} // Chiều rộng mặc định
            height={60} // Chiều cao mặc định
            priority // Tải hình ảnh ưu tiên
            className="h-auto w-auto md:h-16" // Responsive với Tailwind
          />
        {/* </a> */}
        <nav>
          <ul className="hidden md:flex space-x-6">
            <li>
              <button className="hover:text-gray-500 font-bold px-4 py-2">
                GỌNG KÍNH CẬN
              </button>
            </li>
            <li>
              <button className="hover:text-gray-500 font-bold px-4 py-2">
                TRÒNG ĐỔI MÀU
              </button>
            </li>
            <li>
              <button className="hover:text-gray-500 font-bold px-4 py-2">
                KÍNH RÂM
              </button>
            </li>
            <li>
              <button className="hover:text-gray-500 font-bold px-4 py-2">
                KHUYẾN MÃI
              </button>
            </li>
            <li>
              <button className="hover:text-gray-500 font-bold px-4 py-2">
                GIỚI THIỆU
              </button>
            </li>
          </ul>
        </nav>
        {/* Search bar, cart, and login icons */}
        <div className="flex items-center space-x-4">
          {/* Search bar */}
          <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="outline-none px-2 text-sm"
            />
          </div>
          {/* Shopping cart icon */}
          <button className="text-gray-500 hover:text-black">
            <FaShoppingCart size={20} />
          </button>
          {/* Login icon */}
          <button className="text-gray-500 hover:text-black flex items-center">
            <FaUser size={20} className="mr-2" />
            <span className="hidden md:inline">Đăng nhập</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;