import { cn } from "@/lib/utils";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-amber-50">
      <Header/>
      <h1 className={cn("text-3xl", "text-red-500")}>Home page here</h1>
      <Footer/>
    </div>
  );
}
