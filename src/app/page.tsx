"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { LandingPage } from "@/components/landing/landing-page";

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect authenticated users to their appropriate dashboard
      switch (user.role) {
        case "superadmin":
          router.push("/superadmin");
          break;
        case "admin":
        case "manager":
          router.push("/admin");
          break;
        case "user":
          router.push("/user");
          break;
        default:
          router.push("/login");
          break;
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Show loading while redirecting authenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" />
    </div>
  );
}