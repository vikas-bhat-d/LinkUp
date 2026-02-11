import { User } from "./user";
import { Conversation } from "./conversation";
import { Message } from "./message";

export interface AuthResponse {
  token: string;
  user: User;
}

export type SearchUserResponse = User[];

export type ConversationsResponse = Conversation[];

export type MessagesResponse = Message[];
