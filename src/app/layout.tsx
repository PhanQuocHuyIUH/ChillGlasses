import type { Metadata } from "next";
import "./globals.css";

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
        <div className="relative flex w-full flex-col items-center">
          <main className="w-full overflow-hidden">{children}</main>
        </div>
      </body>
    </html>
  );
}
