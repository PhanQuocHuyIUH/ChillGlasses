
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Image from "next/image"; // Import Image từ next/image
import product1 from "../../public/images/product1.jpg";
import product2 from "../../public/images/product2.jpg";
import product3 from "../../public/images/product3.jpg";
import product4 from "../../public/images/product4.jpg";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-amber-50">
      <Header />

      {/* Banner */}
      <section className="w-full bg-linear-to-r from-blue-500 to-indigo-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Chào mừng đến với Chill Glasses</h1>
        <p className="mt-4 text-lg">Khám phá các sản phẩm kính thời trang và chất lượng cao</p>
      </section>

      {/* Sản phẩm nổi bật / bán chạy */}
      <section className="container mx-auto py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[product1, product2, product3, product4].map((product, index) => (
            <div key={index} className="border rounded-lg p-4 shadow hover:shadow-lg">
              <Image
                src={product}
                alt={`Sản phẩm ${index + 1}`}
                className="w-full h-40 object-cover rounded"
                width={150}
                height={150}
              />
              <h3 className="text-lg font-bold mt-4">Sản phẩm {index + 1}</h3>
              <p className="text-gray-600 mt-2">Giá: 500.000đ</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Mua ngay
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Khuyến mãi */}
      <section className="w-full bg-linear-to-r from-red-500 to-yellow-500 text-white py-16 text-center">
        <h2 className="text-3xl font-bold">Khuyến mãi hấp dẫn</h2>
        <p className="mt-4 text-lg">Giảm giá lên đến 50% cho các sản phẩm kính thời trang</p>
        <p className="mt-2 italic">Chất lượng hàng đầu - Giá cả phải chăng</p>
        <div className="container mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[product1, product2, product3, product4].map((product, index) => (
            <div key={index} className="border rounded-lg p-4 shadow hover:shadow-lg bg-white text-black">
              <Image
                src={product}
                alt={`Khuyến mãi ${index + 1}`}
                className="w-full h-40 object-cover rounded"
                width={150}
                height={150}
              />
              <h3 className="text-lg font-bold mt-4">Sản phẩm khuyến mãi {index + 1}</h3>
              <p className="text-gray-600 mt-2 line-through">Giá gốc: 1.000.000đ</p>
              <p className="text-red-500 font-bold">Giá khuyến mãi: 500.000đ</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Mua ngay
              </button>
            </div>
          ))}
        </div>
        <button className="mt-6 bg-white text-red-500 px-6 py-3 rounded font-bold hover:bg-gray-200">
          Xem tất cả khuyến mãi
        </button>
      </section>

      <Footer />
    </div>
  );
}