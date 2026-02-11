import { create } from "zustand";
import { Conversation } from "@/types/conversation";

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;

  setConversations: (convos: Conversation[]) => void;
  setActiveConversation: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  activeConversationId: null,
  isLoading: false,

  setConversations: (convos) => set({ conversations: convos }),
  setActiveConversation: (id) =>
    set({ activeConversationId: id }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
