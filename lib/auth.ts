// Admin authentication against Better Auth (/api/auth/*).
// Captures the bearer token from the `set-auth-token` header at sign-in and
// enforces that only ADMIN-role users may use the console.

import { API_URL, ApiError, clearToken, getToken, setToken } from "./api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "CLIENT" | "VENDOR" | "ADMIN";
  image?: string | null;
}

interface SessionResponse {
  user?: AdminUser;
  session?: unknown;
}

/** Sign in with email + password; verifies ADMIN role. Throws on failure. */
export async function login(email: string, password: string): Promise<AdminUser> {
  const res = await fetch(`${API_URL}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, data?.message ?? "Invalid email or password", data);
  }

  // Bearer plugin returns the token in the `set-auth-token` header (CORS-exposed).
  const token = res.headers.get("set-auth-token") ?? data?.token;
  if (token) setToken(token);

  const user = await getSession();
  if (!user) {
    clearToken();
    throw new ApiError(401, "Could not establish a session");
  }
  if (user.role !== "ADMIN") {
    clearToken();
    throw new ApiError(403, "This account does not have admin access");
  }
  return user;
}

/** Returns the current user if a valid session exists, else null. */
export async function getSession(): Promise<AdminUser | null> {
  const token = getToken();
  try {
    const res = await fetch(`${API_URL}/api/auth/get-session`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as SessionResponse | null;
    return data?.user ?? null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  const token = getToken();
  try {
    await fetch(`${API_URL}/api/auth/sign-out`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    });
  } catch {
    // ignore network errors on sign-out
  }
  clearToken();
}
