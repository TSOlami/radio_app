import { NextRequest, NextResponse } from "next/server";

// Define role-based route protection
const protectedRoutes = {
  user: ["/user", "/user/(.*)"],
  admin: ["/admin", "/admin/(.*)"],
  superadmin: ["/superadmin", "/superadmin/(.*)"],
};

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/new-password",
  "/api/auth/(.*)",
];

// Routes that should redirect authenticated users
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get authentication data from cookies
  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  
  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    new RegExp(`^${route}$`).test(pathname)
  );
  
  // Check if route is auth route (login/register)
  const isAuthRoute = authRoutes.some(route => 
    new RegExp(`^${route}$`).test(pathname)
  );
  
  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (token && role && isAuthRoute) {
    const dashboardUrl = getDashboardUrl(role);
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }
  
  // If route is public, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Check authentication for protected routes
  if (!token || !role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // Check role-based access
  for (const [requiredRole, routes] of Object.entries(protectedRoutes)) {
    const matchesRoute = routes.some(route => 
      new RegExp(`^${route}$`).test(pathname)
    );
    
    if (matchesRoute) {
      if (!hasRoleAccess(role, requiredRole)) {
        // Redirect to appropriate dashboard or unauthorized page
        const dashboardUrl = getDashboardUrl(role);
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }
    }
  }
  
  return NextResponse.next();
}

// Helper function to determine role access
function hasRoleAccess(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    superadmin: ["superadmin", "admin", "manager", "user"],
    admin: ["admin", "manager", "user"],
    manager: ["manager", "user"],
    user: ["user"],
  };
  
  return roleHierarchy[userRole as keyof typeof roleHierarchy]?.includes(requiredRole) || false;
}

// Helper function to get dashboard URL based on role
function getDashboardUrl(role: string): string {
  switch (role) {
    case "superadmin":
      return "/superadmin";
    case "admin":
    case "manager":
      return "/admin";
    case "user":
      return "/user";
    default:
      return "/login";
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};