import type {
  BookingResponse,
  HealthResponse,
  ProviderResponse,
  SyncJobResponse,
} from "@/api/types";

const now = new Date();
const iso = (offsetHours: number) =>
  new Date(now.getTime() + offsetHours * 3_600_000).toISOString();

export const mockHealth: HealthResponse = {
  status: "ok",
  version: "1.0.0-mock",
  uptimeSeconds: 86400,
  checks: { database: "up", redis: "skipped" },
};

export const mockProviders: ProviderResponse[] = [
  {
    id: "clprov00000000000000001",
    name: "HotelBeds REST",
    slug: "hotelbeds",
    integrationType: "REST",
    baseUrl: "https://api.hotelbeds.example",
    active: true,
    lastHealthAt: iso(-2),
    lastHealthStatus: "UP",
    createdAt: iso(-720),
  },
  {
    id: "clprov00000000000000002",
    name: "Amadeus SOAP",
    slug: "amadeus-soap",
    integrationType: "SOAP",
    baseUrl: null,
    active: true,
    lastHealthAt: iso(-24),
    lastHealthStatus: "DOWN",
    createdAt: iso(-1440),
  },
];

export const mockBookings: BookingResponse[] = [
  {
    id: "clbook00000000000000001",
    reference: "BK-A1B2C3D4",
    travelerName: "Maria Silva",
    destination: "Rio de Janeiro",
    checkIn: iso(48),
    checkOut: iso(120),
    amountCents: 125000,
    currency: "BRL",
    status: "CONFIRMED",
    providerId: mockProviders[0].id,
    createdAt: iso(-48),
    updatedAt: iso(-12),
  },
  {
    id: "clbook00000000000000002",
    reference: "BK-E5F6G7H8",
    travelerName: "João Santos",
    destination: "São Paulo",
    checkIn: iso(72),
    checkOut: iso(96),
    amountCents: 89000,
    currency: "BRL",
    status: "PENDING",
    providerId: null,
    createdAt: iso(-24),
    updatedAt: iso(-24),
  },
  {
    id: "clbook00000000000000003",
    reference: "BK-I9J0K1L2",
    travelerName: "Ana Costa",
    destination: "Florianópolis",
    checkIn: iso(-168),
    checkOut: iso(-120),
    amountCents: 210000,
    currency: "BRL",
    status: "CANCELLED",
    providerId: mockProviders[1].id,
    createdAt: iso(-336),
    updatedAt: iso(-72),
  },
];

export const mockSyncJobs: SyncJobResponse[] = [
  {
    id: "clsync00000000000000001",
    bookingId: mockBookings[0].id,
    providerId: mockProviders[0].id,
    status: "COMPLETED",
    attempts: 1,
    lastError: null,
    createdAt: iso(-36),
    completedAt: iso(-35),
  },
  {
    id: "clsync00000000000000002",
    bookingId: mockBookings[1].id,
    providerId: mockProviders[0].id,
    status: "QUEUED",
    attempts: 0,
    lastError: null,
    createdAt: iso(-1),
    completedAt: null,
  },
  {
    id: "clsync00000000000000003",
    bookingId: mockBookings[2].id,
    providerId: mockProviders[1].id,
    status: "FAILED",
    attempts: 3,
    lastError: "Provider timeout after 30s",
    createdAt: iso(-48),
    completedAt: iso(-47),
  },
];
