import { api } from "./axios";
import { handleApiError } from "./error";
import { Message } from "@/types/message";

interface GetMessagesParams {
  conversationId: string;
  limit?: number;
  cursor?: string;
}

export async function getMessages({
  conversationId,
  limit = 20,
  cursor,
}: GetMessagesParams) {
  try {
    const res = await api.get<Message[]>(
      `/api/conversations/${conversationId}/messages`,
      {
        params: {
          limit,
          ...(cursor ? { cursor } : {}),
        },
      }
    );
    console.log(res.data)
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}
