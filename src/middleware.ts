import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/admin",
  "/superadmin",
  "/admin/(.*)",
  "/superadmin/(.*)"
];

function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Only run on protected routes
  if (protectedRoutes.some(route => new RegExp(`^${route}$`).test(pathname))) {
    const authCookieName = process.env.AUTH_COOKIE_NAME || "authToken";
    const token = request.cookies.get(authCookieName)?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Extract role from JWT token
    const decoded = decodeJwt(token);
    const role = decoded?.role;

    if (!role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check role for route access
    if (pathname.startsWith("/admin") && !["admin", "manager"].includes(role)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/superadmin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/superadmin/:path*"]
};
