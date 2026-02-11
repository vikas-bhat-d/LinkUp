import { api } from "./axios";
import { handleApiError } from "./error";
import { Conversation } from "@/types/conversation";

export async function getConversations(token: string) {
  try {
    const res = await api.get<Conversation[]>(
      "/api/conversations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}

export async function createDirectConversation(
  token: string,
  userId: string
) {
  try {
    const res = await api.post<Conversation>(
      "/api/conversations/direct",
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}
