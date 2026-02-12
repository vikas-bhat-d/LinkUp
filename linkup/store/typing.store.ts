import { create } from "zustand";

interface TypingState {
  typingByConversation: Record<string, boolean>;
  setTyping: (conversationId: string, value: boolean) => void;
}

export const useTypingStore = create<TypingState>((set) => ({
  typingByConversation: {},

  setTyping: (conversationId, value) =>
    set((state) => ({
      typingByConversation: {
        ...state.typingByConversation,
        [conversationId]: value,
      },
    })),
}));
