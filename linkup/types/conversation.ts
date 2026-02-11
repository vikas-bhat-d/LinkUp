import { Message } from "./message";

export interface ConversationParticipant {
  userId: string;
  joinedAt: string;
  lastReadAt: string | null;
  user: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
}

export interface Conversation {
  id: string;
  type: "DIRECT";
  createdAt: string;
  lastMessageAt: string;
  participants: ConversationParticipant[];
  messages: Message[];
  unreadCount: number;
}