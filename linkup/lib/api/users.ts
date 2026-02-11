import { api } from "./axios";
import { handleApiError } from "./error";
import { User } from "@/types/user";

export async function getMe(token: string) {
  try {
    const res = await api.get<User>("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}

export async function searchUsers(
  token: string,
  query: string
) {
  try {
    const res = await api.get<User[]>(
      `/api/users/search?q=${encodeURIComponent(query)}`,
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
