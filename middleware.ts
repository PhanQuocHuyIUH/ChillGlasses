import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;
  const role = req.cookies.get("role")?.value || null;
  const path = req.nextUrl.pathname;

  console.log("➡ MIDDLEWARE RUNNING:", path, "token:", token);

  const protectedRoutes = [
    "/cart",
    "/checkout",
    "/orders",
    "/profile",
    "/reviews",
  ];

  if (protectedRoutes.some((r) => path.startsWith(r))) {
    if (!token) {
      console.log("❌ NO TOKEN → redirect /login");
      return NextResponse.redirect(new URL("login", req.url));
    }
  }
  if (path.startsWith("/admin")) {
    if (!token || role !== "ADMIN") {
      console.log("❌ NOT ADMIN → redirect /");
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/cart/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/reviews/:path*",
    "/admin/:path*",
  ]
};

