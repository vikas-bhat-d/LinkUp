import { Message } from "./message";
import { User } from "./user";

export interface SocketMessageSend {
  conversationId: string;
  content: string;
  type: "TEXT";
}

export interface SocketMessageReceive extends Message {}

export interface TypingPayload {
  conversationId: string;
}

export interface MessageDeliveredPayload {
  conversationId: string;
  messageId: string;
  userId: string;
}

export interface MessageSeenPayload {
  conversationId: string;
  messageId: string;
  userId: string;
}

export interface MessageNotifyPayload {
  conversationId: string;
  preview: string;
  from: Pick<User, "id" | "name" | "avatarUrl">;
}

export interface PresencePayload {
  userId: string;
}
