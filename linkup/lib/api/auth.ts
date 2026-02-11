import { api } from "./axios";
import { handleApiError } from "./error";
import { AuthResponse } from "@/types/api";

export async function login(email: string, password: string) {
  try {
    const res = await api.post<AuthResponse>(
      "/api/auth/login",
      { email, password }
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}

export async function register(
  name: string,
  email: string,
  password: string
) {
  try {
    const res = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}
