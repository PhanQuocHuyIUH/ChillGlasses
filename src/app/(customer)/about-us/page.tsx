const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 text-gray-800">
      {/* Container chính */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl text-center">
        {/* Tiêu đề */}
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Giới thiệu dự án Chill Glasses</h1>

        {/* Nội dung giới thiệu */}
        <div>
          <p className="text-lg mb-4 text-gray-700">
            <strong>Chill Glasses</strong> là một dự án thương mại điện tử chuyên cung cấp các sản phẩm kính thời trang và chất lượng cao. 
            Với sứ mệnh mang đến sự tự tin và phong cách cho khách hàng, chúng tôi luôn đặt chất lượng và trải nghiệm người dùng lên hàng đầu.
          </p>
          <p className="text-lg mb-4 text-gray-700">
            Dự án được xây dựng với công nghệ hiện đại, bao gồm <strong>Next.js</strong>, <strong>React</strong>, và <strong>Tailwind CSS</strong>, 
            nhằm mang lại hiệu suất cao và giao diện thân thiện với người dùng.
          </p>
        </div>

        {/* Danh sách thành viên */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Thành viên dự án</h2>
          <ul className="list-disc list-inside text-lg text-gray-700">
            <li>Phan Quốc Huy - Trưởng nhóm</li>
            <li>Nguyễn Lê Trâm Anh - Thiết kế giao diện</li>
            <li>Nguyễn Minh Duy - Phát triển Frontend</li>
            <li>Lương Minh Duy - Phát triển Backend</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default page;