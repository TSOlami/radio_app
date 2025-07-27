"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthRootRedirect from "@/components/AuthRootRedirect";

export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  
  return <AuthRootRedirect />;
}
