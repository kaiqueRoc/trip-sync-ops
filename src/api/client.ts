import { API_URL } from "@/config/env";
import type { ApiError } from "@/api/types";

export class ApiRequestError extends Error {
  readonly status: number;
  readonly body: ApiError | undefined;

  constructor(status: number, message: string, body?: ApiError) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.body = body;
  }
}

type QueryValue = string | number | boolean | undefined | null;

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const base = API_URL.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${normalized}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function parseError(res: Response): Promise<ApiError | undefined> {
  try {
    return (await res.json()) as ApiError;
  } catch {
    return undefined;
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit & { query?: Record<string, QueryValue> },
): Promise<T> {
  const { query, headers, ...rest } = init ?? {};
  const url = buildUrl(path, query);
  const res = await fetch(url, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    const body = await parseError(res);
    throw new ApiRequestError(
      res.status,
      body?.message ?? res.statusText,
      body,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const api = {
  health: () => apiRequest<import("@/api/types").HealthResponse>("/health"),

  listBookings: (query?: Record<string, QueryValue>) =>
    apiRequest<import("@/api/types").BookingListResponse>("/bookings", {
      query,
    }),

  getBooking: (id: string) =>
    apiRequest<import("@/api/types").BookingResponse>(`/bookings/${id}`),

  createBooking: (body: import("@/api/types").CreateBookingInput) =>
    apiRequest<import("@/api/types").BookingResponse>("/bookings", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateBookingStatus: (
    id: string,
    body: import("@/api/types").UpdateBookingStatusInput,
  ) =>
    apiRequest<import("@/api/types").BookingResponse>(
      `/bookings/${id}/status`,
      { method: "PATCH", body: JSON.stringify(body) },
    ),

  listProviders: () =>
    apiRequest<import("@/api/types").ProviderListResponse>("/providers"),

  getProvider: (id: string) =>
    apiRequest<import("@/api/types").ProviderResponse>(`/providers/${id}`),

  createProvider: (body: import("@/api/types").CreateProviderInput) =>
    apiRequest<import("@/api/types").ProviderResponse>("/providers", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  listSyncJobs: (query?: Record<string, QueryValue>) =>
    apiRequest<import("@/api/types").SyncJobResponse[]>("/sync-jobs", {
      query,
    }),

  createSyncJob: (body: import("@/api/types").CreateSyncJobInput) =>
    apiRequest<import("@/api/types").SyncJobResponse>("/sync-jobs", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
