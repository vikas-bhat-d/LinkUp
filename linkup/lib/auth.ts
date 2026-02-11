import { getMe } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

export async function hydrateAuth() {
  const { setAuth, clearAuth, setAuthLoading } =
    useAuthStore.getState();

  const token = localStorage.getItem("linkup_token");

  if (!token) {
    setAuthLoading(false);
    return;
  }

  try {
    const user = await getMe();
    setAuth(user, token);
  } catch {
    clearAuth();
  }
}
