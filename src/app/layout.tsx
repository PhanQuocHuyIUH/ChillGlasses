import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/layout/Header"; // Import Header
import Footer from "../components/layout/Footer"; // Import Footer

export const metadata: Metadata = {
  title: "Chill Glasses",
  description: "Created by Chill Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex w-full flex-col items-center">
        <Header /> {/* Thêm Header */}
        <div className="relative flex w-full flex-col items-center">
          <main className="w-full overflow-hidden pt-16 pb-16">{children}</main>
        </div>
        <Footer /> {/* Thêm Footer */}
      </body>
    </html>
  );
}