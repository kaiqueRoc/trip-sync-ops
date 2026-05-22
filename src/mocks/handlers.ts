import { http, HttpResponse } from "msw";
import { API_URL } from "@/config/env";
import {
  mockBookings,
  mockHealth,
  mockProviders,
  mockSyncJobs,
} from "@/mocks/data";
import type {
  BookingListResponse,
  BookingResponse,
  CreateBookingInput,
  CreateProviderInput,
  CreateSyncJobInput,
  ProviderResponse,
  SyncJobResponse,
  UpdateBookingStatusInput,
} from "@/api/types";

const base = API_URL.replace(/\/$/, "");

let bookings = [...mockBookings];
let providers = [...mockProviders];
let syncJobs = [...mockSyncJobs];

function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): { data: T[]; meta: BookingListResponse["meta"] } {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    meta: {
      page: safePage,
      pageSize,
      totalItems,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1,
    },
  };
}

export const handlers = [
  http.get(`${base}/health`, () => HttpResponse.json(mockHealth)),

  http.get(`${base}/bookings`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(url.searchParams.get("pageSize") ?? 20);
    const status = url.searchParams.get("status");
    const destination = url.searchParams.get("destination")?.toLowerCase();
    const providerId = url.searchParams.get("providerId");

    let filtered = bookings;
    if (status) {
      filtered = filtered.filter((b) => b.status === status);
    }
    if (destination) {
      filtered = filtered.filter((b) =>
        b.destination.toLowerCase().includes(destination),
      );
    }
    if (providerId) {
      filtered = filtered.filter((b) => b.providerId === providerId);
    }

    return HttpResponse.json(paginate(filtered, page, pageSize));
  }),

  http.get(`${base}/bookings/:id`, ({ params }) => {
    const booking = bookings.find((b) => b.id === params.id);
    if (!booking) {
      return HttpResponse.json(
        { code: "NOT_FOUND", message: "Booking not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(booking);
  }),

  http.post(`${base}/bookings`, async ({ request }) => {
    const body = (await request.json()) as CreateBookingInput;
    const booking: BookingResponse = {
      id: `clbook${Date.now()}`,
      reference: `BK-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      travelerName: body.travelerName,
      destination: body.destination,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      amountCents: body.amountCents,
      currency: body.currency ?? "BRL",
      status: "PENDING",
      providerId: body.providerId ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    bookings = [booking, ...bookings];
    return HttpResponse.json(booking, { status: 201 });
  }),

  http.patch(`${base}/bookings/:id/status`, async ({ params, request }) => {
    const body = (await request.json()) as UpdateBookingStatusInput;
    const idx = bookings.findIndex((b) => b.id === params.id);
    if (idx < 0) {
      return HttpResponse.json(
        { code: "NOT_FOUND", message: "Booking not found" },
        { status: 404 },
      );
    }
    const updated: BookingResponse = {
      ...bookings[idx],
      status: body.status,
      updatedAt: new Date().toISOString(),
    };
    bookings = bookings.map((b, i) => (i === idx ? updated : b));
    return HttpResponse.json(updated);
  }),

  http.get(`${base}/providers`, () =>
    HttpResponse.json({ data: providers }),
  ),

  http.get(`${base}/providers/:id`, ({ params }) => {
    const provider = providers.find((p) => p.id === params.id);
    if (!provider) {
      return HttpResponse.json(
        { code: "NOT_FOUND", message: "Provider not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(provider);
  }),

  http.post(`${base}/providers`, async ({ request }) => {
    const body = (await request.json()) as CreateProviderInput;
    const provider: ProviderResponse = {
      id: `clprov${Date.now()}`,
      name: body.name,
      slug: body.slug,
      integrationType: body.integrationType,
      baseUrl: body.baseUrl ?? null,
      active: body.active ?? true,
      lastHealthAt: null,
      lastHealthStatus: null,
      createdAt: new Date().toISOString(),
    };
    providers = [provider, ...providers];
    return HttpResponse.json(provider, { status: 201 });
  }),

  http.get(`${base}/sync-jobs`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const bookingId = url.searchParams.get("bookingId");
    let filtered = syncJobs;
    if (status) {
      filtered = filtered.filter((j) => j.status === status);
    }
    if (bookingId) {
      filtered = filtered.filter((j) => j.bookingId === bookingId);
    }
    return HttpResponse.json(filtered);
  }),

  http.post(`${base}/sync-jobs`, async ({ request }) => {
    const body = (await request.json()) as CreateSyncJobInput;
    const job: SyncJobResponse = {
      id: `clsync${Date.now()}`,
      bookingId: body.bookingId,
      providerId: body.providerId,
      status: "QUEUED",
      attempts: 0,
      lastError: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    syncJobs = [job, ...syncJobs];
    return HttpResponse.json(job, { status: 202 });
  }),
];
