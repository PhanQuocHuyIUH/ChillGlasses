import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const layout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header lang={params.lang} />
        {children}
        <Footer lang={params.lang} />
      </div>
    </>
  );
};

export default layout;