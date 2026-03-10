const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:5000/api";

const AUTH_TOKEN_KEY = "millet-pro-token";

export type ApiUser = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  isAdmin: boolean;
  createdAt?: string;
};

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function apiFetch<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.auth) {
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data as T;
}

export function resolveApiUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const base = API_BASE_URL.endsWith("/api") ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export { API_BASE_URL, AUTH_TOKEN_KEY };
