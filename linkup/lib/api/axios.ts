import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token =
    useAuthStore.getState().token ||
    localStorage.getItem("linkup_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
