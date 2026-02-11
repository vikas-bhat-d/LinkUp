import { User } from "./user";
import { Message } from "./message";

export interface Conversation {
  id: string;

  participants: User[];

  lastMessage?: Message | null;

  unreadCount?: number;

  updatedAt?: string;
}
