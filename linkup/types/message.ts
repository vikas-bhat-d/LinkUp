export type MessageType = "TEXT";

export type MessageStatus =
  | "SENT"
  | "DELIVERED"
  | "SEEN";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;

  status?: MessageStatus;

  createdAt: string;
}
