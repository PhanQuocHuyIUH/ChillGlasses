import Link from "next/link"; // Import Link from next/link

const SideBar = () => {
  const sections = [
    { name: "Dashboard", path: "/admin_dashboard" },
    { name: "Sản phẩm", path: "/admin_products" },
    { name: "Danh mục", path: "/admin_categories" },
    { name: "Đơn hàng", path: "/admin_orders" },
    { name: "Khách hàng", path: "/admin_customers" },
    { name: "Đánh giá", path: "/admin_ratings" },
    { name: "Tài khoản", path: "/admin_accounts" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-gray-200 h-[calc(100vh-5rem)] p-4 fixed left-0 top-20 shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-center">Quản Trị Viên</h2>
      <ul className="space-y-4">
        {sections.map((section) => (
          <li key={section.path}>
            <Link
              href={section.path}
              className="block bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              {section.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;