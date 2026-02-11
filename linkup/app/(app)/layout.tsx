"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { hydrateAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useAuthStore();

  useEffect(() => {
    hydrateAuth();
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <aside className="hidden md:flex w-80 border-r">
        Sidebar
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
