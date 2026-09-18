import axios from "axios";
import { getAuthToken } from "@/lib/auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080";

/**
 * Server-side rendering runs inside the frontend's own container/process,
 * where "localhost" refers to that container, not the backend one. In
 * Docker Compose, INTERNAL_API_URL points at the backend service name
 * (e.g. http://backend:8080) so Server Components can reach it; outside
 * Docker (plain `next dev`/`next start` on one machine) it correctly falls
 * back to the same public URL the browser uses.
 */
const SERVER_API_BASE_URL = process.env.INTERNAL_API_URL ?? API_BASE_URL;

/**
 * Used for public, unauthenticated reads. Safe to call from Server or
 * Client Components - resolves to the right base URL for each context.
 */
export const publicApi = axios.create({
  baseURL: `${typeof window === "undefined" ? SERVER_API_BASE_URL : API_BASE_URL}/api/public`,
});

/**
 * Used for authenticated admin calls from Client Components. Attaches the
 * JWT stored client-side; real authorization is enforced by the backend.
 */
export const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`,
});

adminApi.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
});

authApi.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
