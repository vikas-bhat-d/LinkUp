import { api } from "./axios";
import { handleApiError } from "./error";
import { Message } from "@/types/message";

interface GetMessagesParams {
  token: string;
  conversationId: string;
  limit?: number;
  cursor?: string;
}

export async function getMessages({
  token,
  conversationId,
  limit = 20,
  cursor,
}: GetMessagesParams) {
  try {
    const res = await api.get<Message[]>(
      `/api/conversations/${conversationId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit,
          ...(cursor ? { cursor } : {}),
        },
      }
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}
