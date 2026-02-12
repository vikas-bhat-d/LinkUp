import { create } from "zustand";
import { Message } from "@/types/message";

interface MessageState {
  messagesByConversation: Record<string, Message[]>;
  hasMoreByConversation: Record<string, boolean>;
  isLoading: boolean;

  setMessages: (conversationId: string, messages: Message[]) => void;
  prependMessages: (conversationId: string, messages: Message[]) => void;
  setHasMore: (conversationId: string, value: boolean) => void;
  setLoading: (loading: boolean) => void;
  markDelivered: (conversationId: string, messageId: string) => void;
  markSeen: (conversationId: string, messageId: string) => void;

}

export const useMessageStore = create<MessageState>((set) => ({
  messagesByConversation: {},
  hasMoreByConversation: {},
  isLoading: false,

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: messages,
      },
    })),

  prependMessages: (conversationId, olderMessages) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: [
          ...olderMessages,
          ...(state.messagesByConversation[conversationId] || []),
        ],
      },
    })),

  setHasMore: (conversationId, value) =>
    set((state) => ({
      hasMoreByConversation: {
        ...state.hasMoreByConversation,
        [conversationId]: value,
      },
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  markDelivered: (conversationId, messageId) =>
  set((state) => ({
    messagesByConversation: {
      ...state.messagesByConversation,
      [conversationId]:
        state.messagesByConversation[conversationId]?.map(
          (m) =>
            m.id === messageId && m.status !== "SEEN"
              ? { ...m, status: "DELIVERED" }
              : m
        ) || [],
    },
  })),

markSeen: (conversationId, messageId) =>
  set((state) => ({
    messagesByConversation: {
      ...state.messagesByConversation,
      [conversationId]:
        state.messagesByConversation[conversationId]?.map(
          (m) =>
            m.id === messageId
              ? { ...m, status: "SEEN" }
              : m
        ) || [],
    },
  })),

}));
