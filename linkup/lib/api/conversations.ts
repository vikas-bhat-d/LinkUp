import { api } from "./axios";
import { handleApiError } from "./error";
import { Conversation } from "@/types/conversation";

export async function getConversations() {
  try {
    const res = await api.get<Conversation[]>(
      "/api/conversations"
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}

export async function createDirectConversation(
  userId: string
) {
  try {
    const res = await api.post<Conversation>(
      "/api/conversations/direct",
      { userId }
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}
