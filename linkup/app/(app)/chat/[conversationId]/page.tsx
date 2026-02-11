"use client";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { MobileSidebar } from "@/components/sidebar/MobileSidebar";
import { Separator } from "@/components/ui/separator";
import { getMessages } from "@/lib/api";
import { useConversationStore } from "@/store/conversation.store";
import { useMessageStore } from "@/store/message.store";

import { useAuthStore } from "@/store/auth.store";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params?.conversationId as string;
  const { user } = useAuthStore();
  const setActiveConversation =
    useConversationStore((s) => s.setActiveConversation);

  const {
    messagesByConversation,
    setMessages,
    prependMessages,
    setHasMore,
    hasMoreByConversation,
    setLoading,
  } = useMessageStore();

  const messages = messagesByConversation[conversationId] || [];
  const hasMore = hasMoreByConversation[conversationId];

  const scrollRef = useRef<HTMLDivElement>(null);
  const loadingOlderRef = useRef(false);


  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
    }
  }, [conversationId, setActiveConversation]);


  useEffect(() => {
    async function loadInitial() {
      try {
        setLoading(true);

        const data = await getMessages({
          conversationId,
          limit: 20,
        });

        setMessages(conversationId, data);
        setHasMore(conversationId, data.length === 20);

        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop =
              scrollRef.current.scrollHeight;
          }
        });
      } finally {
        setLoading(false);
      }
    }

    if (conversationId) {
      loadInitial();
    }
  }, [conversationId, setMessages, setHasMore, setLoading]);


  async function loadOlder() {
    if (loadingOlderRef.current) return;
    if (!hasMore || !messages.length) return;

    loadingOlderRef.current = true;

    try {
      const oldest = messages[0];
      const container = scrollRef.current;
      if (!container) return;

      const previousHeight = container.scrollHeight;

      const older = await getMessages({
        conversationId,
        limit: 20,
        cursor: oldest.id,
      });

      if (older.length === 0) {
        setHasMore(conversationId, false);
        return;
      }

      const existingIds = new Set(messages.map(m => m.id));
      const filtered = older.filter(m => !existingIds.has(m.id));

      prependMessages(conversationId, filtered);

      requestAnimationFrame(() => {
        const newHeight = container.scrollHeight;
        container.scrollTop += newHeight - previousHeight;
      });

    } finally {
      loadingOlderRef.current = false;
    }
  }

  function handleScroll() {
    const container = scrollRef.current;
    if (!container) return;

    if (container.scrollTop < 50) {
      loadOlder();
    }
  }

  return (
    <div className="flex h-full flex-col">
      <header className="h-14 border-b flex items-center gap-2 px-4">
        <div className="md:hidden">
          <MobileSidebar />
        </div>
        <span className="font-medium">
          Chat
        </span>
      </header>

      <Separator />
      
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[75%] lg:max-w-[60%] rounded-2xl px-4 py-2 text-sm break-words
                  ${
                    isMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }
                `}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      <footer className="border-t p-4">
        Message input
      </footer>
    </div>
  );
}
