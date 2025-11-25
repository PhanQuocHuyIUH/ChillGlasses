import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const layout = ({
  children
}: {
  children: React.ReactNode;
  params: { lang: string };
}) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
};

export default layout;