"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { MobileSidebar } from "@/components/sidebar/MobileSidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getMessages } from "@/lib/api";
import { getSocket } from "@/lib/socket";

import { useAuthStore } from "@/store/auth.store";
import { useConversationStore } from "@/store/conversation.store";
import { useMessageStore } from "@/store/message.store";
import { useTypingStore } from "@/store/typing.store";
import { Message, MessageStatus } from "@/types/message";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params?.conversationId as string;

  const { user } = useAuthStore();
  const setActiveConversation = useConversationStore(
    (s) => s.setActiveConversation,
  );

  const {
    messagesByConversation,
    setMessages,
    prependMessages,
    setHasMore,
    hasMoreByConversation,
    setLoading,
  } = useMessageStore();

  const { setTyping } = useTypingStore();
  const typing = useTypingStore((s) => s.typingByConversation[conversationId]);

  const messages = messagesByConversation[conversationId] || [];
  const hasMore = hasMoreByConversation[conversationId];

  const [content, setContent] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const loadingOlderRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);
  const lastReadRef = useRef<string | null>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const conversations = useConversationStore((s) => s.conversations);

  const conversation = conversations.find((c) => c.id === conversationId);

  const otherParticipant = conversation?.participants.find(
    (p) => p.userId !== user?.id,
  );

  function handleScroll() {
    const container = scrollRef.current;
    if (!container) return;

    const threshold = 80;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold;

    shouldAutoScrollRef.current = isNearBottom;

    if (container.scrollTop <= 150) {
      loadOlder();
    }
  }

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;

    const container = scrollRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages.length, typing]);

  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
    }
  }, [conversationId, setActiveConversation]);

  useEffect(() => {
    if (!conversationId) return;

    const socket = getSocket();
    socket.emit("conversation:join", conversationId);

    return () => {
      socket.emit("conversation:leave", conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    async function loadInitial() {
      try {
        setLoading(true);

        const data = await getMessages({
          conversationId,
          limit: 20,
        });

        const lastReadTime = otherParticipant?.lastReadAt
          ? new Date(otherParticipant.lastReadAt).getTime()
          : 0;

        const enriched: Message[] = data.map((msg) => {
          if (msg.senderId !== user?.id) return msg;

          const messageTime = new Date(msg.createdAt).getTime();

          const status: MessageStatus =
            lastReadTime && messageTime <= lastReadTime ? "SEEN" : "DELIVERED";

          return {
            ...msg,
            status,
          };
        });

        setMessages(conversationId, enriched);
        setHasMore(conversationId, data.length === 20);

        requestAnimationFrame(() => {
          const container = scrollRef.current;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      } finally {
        setLoading(false);
      }
    }

    if (conversationId) {
      loadInitial();
    }
  }, [conversationId, otherParticipant?.lastReadAt]);

  // async function loadOlder() {
  //   if (loadingOlderRef.current) return;
  //   if (!hasMore || !messages.length) return;

  //   loadingOlderRef.current = true;

  //   try {
  //     const oldest = messages[0];
  //     const container = scrollRef.current;
  //     if (!container) return;

  //     const previousHeight = container.scrollHeight;

  //     const older = await getMessages({
  //       conversationId,
  //       limit: 20,
  //       cursor: oldest.id,
  //     });

  //     if (!older.length) {
  //       setHasMore(conversationId, false);
  //       return;
  //     }

  //     const existingIds = new Set(messages.map((m) => m.id));
  //     const filtered = older.filter((m) => !existingIds.has(m.id));

  //     const lastReadTime = otherParticipant?.lastReadAt
  //       ? new Date(otherParticipant.lastReadAt).getTime()
  //       : 0;

  //     const enriched:Message[] = filtered.map((msg) => {
  //       if (msg.senderId !== user?.id) {
  //         return msg;
  //       }

  //       const messageTime = new Date(msg.createdAt).getTime();

  //       const status =
  //         lastReadTime && messageTime <= lastReadTime ? "SEEN" : "DELIVERED";

  //       return {
  //         ...msg,
  //         status,
  //       };
  //     });

  //     prependMessages(conversationId, enriched);

  //     requestAnimationFrame(() => {
  //       const newHeight = container.scrollHeight;
  //       container.scrollTop += newHeight - previousHeight;
  //     });
  //   } finally {
  //     loadingOlderRef.current = false;
  //   }
  // }

  async function loadOlder() {
  if (loadingOlderRef.current) return;
  if (!hasMore || !messages.length) return;

  loadingOlderRef.current = true;

  try {
    const container = scrollRef.current;
    if (!container) return;

    const firstVisibleMessage = container.firstElementChild as HTMLElement | null;
    const firstMessageId = firstVisibleMessage?.getAttribute("data-id");
    const prevTop = firstVisibleMessage?.offsetTop ?? 0;

    const oldest = messages[0];

    const older = await getMessages({
      conversationId,
      limit: 20,
      cursor: oldest.id,
    });

    if (!older.length) {
      setHasMore(conversationId, false);
      return;
    }

    const existingIds = new Set(messages.map((m) => m.id));
    const filtered = older.filter((m) => !existingIds.has(m.id));

    const lastReadTime = otherParticipant?.lastReadAt
      ? new Date(otherParticipant.lastReadAt).getTime()
      : 0;

    const enriched: Message[] = filtered.map((msg) => {
      if (msg.senderId !== user?.id) return msg;

      const messageTime = new Date(msg.createdAt).getTime();

      return {
        ...msg,
        status:
          lastReadTime && messageTime <= lastReadTime
            ? "SEEN"
            : "DELIVERED",
      };
    });

    prependMessages(conversationId, enriched);

    requestAnimationFrame(() => {
      const newFirst = container.querySelector(
        `[data-id="${firstMessageId}"]`
      ) as HTMLElement | null;

      if (newFirst) {
        const newTop = newFirst.offsetTop;
        container.scrollTop += newTop - prevTop;
      }
    });

  } finally {
    loadingOlderRef.current = false;
  }
}

  useEffect(() => {
    const socket = getSocket();

    function handleReceive(message: any) {
      useMessageStore.setState((state) => {
        const current =
          state.messagesByConversation[message.conversationId] || [];

        if (current.some((m) => m.id === message.id)) return state;

        return {
          messagesByConversation: {
            ...state.messagesByConversation,
            [message.conversationId]: [...current, message],
          },
        };
      });
    }

    function handleDelivered(payload: any) {
      if (payload.conversationId !== conversationId) return;

      useMessageStore
        .getState()
        .markDelivered(payload.conversationId, payload.messageId);
    }

    function handleSeen(payload: any) {
      if (payload.conversationId !== conversationId) return;

      useMessageStore
        .getState()
        .markSeen(payload.conversationId, payload.messageId);
    }

    function handleTypingStarted(payload: any) {
      if (payload.conversationId !== conversationId) return;

      setTyping(conversationId, true);
    }

    function handleTypingStopped(payload: any) {
      if (payload.conversationId !== conversationId) return;

      setTyping(conversationId, false);
    }

    socket.on("message:receive", handleReceive);
    socket.on("message:delivered", handleDelivered);
    socket.on("message:seen", handleSeen);
    socket.on("typing:started", handleTypingStarted);
    socket.on("typing:stopped", handleTypingStopped);

    return () => {
      socket.off("message:receive", handleReceive);
      socket.off("message:delivered", handleDelivered);
      socket.off("message:seen", handleSeen);
      socket.off("typing:started", handleTypingStarted);
      socket.off("typing:stopped", handleTypingStopped);
    };
  }, [conversationId]);

  useEffect(() => {
    const socket = getSocket();

    if (!messages.length) return;
    if (!shouldAutoScrollRef.current) return;

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage) return;
    if (lastMessage.senderId === user?.id) return;

    if (lastReadRef.current === lastMessage.id) return;

    lastReadRef.current = lastMessage.id;

    socket.emit("message:read", {
      conversationId,
      messageId: lastMessage.id,
    });
  }, [messages.length]);

  function handleTyping() {
    const socket = getSocket();

    if (!isTypingRef.current) {
      socket.emit("typing:start", { conversationId });
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", { conversationId });
      isTypingRef.current = false;
    }, 1500);
  }

  function sendMessage() {
    if (!content.trim()) return;

    const socket = getSocket();

    socket.emit("message:send", {
      conversationId,
      content,
      type: "TEXT",
    });

    if (isTypingRef.current) {
      socket.emit("typing:stop", { conversationId });
      isTypingRef.current = false;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    shouldAutoScrollRef.current = true;
    setContent("");
  }

  return (
    <div className="flex h-full flex-col">
      <header className="h-14 border-b flex items-center gap-2 px-4">
        <div className="md:hidden">
          <MobileSidebar />
        </div>
        <span className="font-medium">Chat</span>
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
                className={`max-w-[75%] lg:max-w-[60%] rounded-2xl px-4 py-2 text-sm wrap-break-words ${
                  isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="flex items-end gap-2">
                  <span>{msg.content}</span>

                  {isMe && (
                    <span className="text-[10px] opacity-70">
                      {msg.status === "SEEN" ? (
                        <span className="text-blue-400">✓✓</span>
                      ) : msg.status === "DELIVERED" ? (
                        "✓✓"
                      ) : (
                        "✓"
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {typing && (
          <div className="flex justify-start">
            <div className="max-w-[75%] lg:max-w-[60%] rounded-2xl px-4 py-2 text-sm bg-muted italic">
              Typing...
            </div>
          </div>
        )}
      </div>

      <footer className="border-t p-4 flex gap-2">
        <Input
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <Button onClick={sendMessage}>Send</Button>
      </footer>
    </div>
  );
}
