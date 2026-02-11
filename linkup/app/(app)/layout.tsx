"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { hydrateAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

import { getConversations } from "@/lib/api";
import { useConversationStore } from "@/store/conversation.store";
import { ConversationList } from "@/components/sidebar/ConversationList";

import { getSocket } from "@/lib/socket";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isAuthLoading, token } = useAuthStore();

  const { setConversations, setLoading } = useConversationStore();

  useEffect(() => {
    hydrateAuth();
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);
        const data = await getConversations();
        console.log("conversations data: ", data);
        setConversations(data);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = getSocket();

    if (!socket.connected) {
      socket.auth = { token };
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, token]);

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
        <ConversationList />
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
