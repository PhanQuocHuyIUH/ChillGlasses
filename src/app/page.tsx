import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-amber-50">
      <h1 className={cn("text-3xl", "text-red-500")}>Home page here</h1>
      <Link href="/login">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Đi đến đăng nhập
        </button>
      </Link>
    </div>
  );
}
