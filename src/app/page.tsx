import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-amber-50">
      <h1 className={cn("text-3xl", "text-red-500")}>Home page here</h1>
    </div>
  );
}
