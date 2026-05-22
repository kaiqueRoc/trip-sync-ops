import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import type {
  CreateBookingInput,
  CreateProviderInput,
  CreateSyncJobInput,
  UpdateBookingStatusInput,
} from "@trip-sync/contracts";

type BookingListParams = {
  page?: number;
  pageSize?: number;
  status?: string;
  destination?: string;
  providerId?: string;
};

type SyncJobListParams = {
  status?: string;
  bookingId?: string;
  page?: number;
  pageSize?: number;
};

export const queryKeys = {
  health: ["health"] as const,
  bookings: (params?: BookingListParams) => ["bookings", params] as const,
  booking: (id: string) => ["bookings", id] as const,
  providers: ["providers"] as const,
  provider: (id: string) => ["providers", id] as const,
  syncJobs: (params?: SyncJobListParams) => ["sync-jobs", params] as const,
};

export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => api.health(),
    refetchInterval: 60_000,
  });
}

export function useBookings(params?: BookingListParams) {
  return useQuery({
    queryKey: queryKeys.bookings(params),
    queryFn: () => api.listBookings(params as Record<string, string | number>),
  });
}

export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.booking(id ?? ""),
    queryFn: () => api.getBooking(id!),
    enabled: Boolean(id),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBookingInput) => api.createBooking(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useUpdateBookingStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBookingStatusInput) =>
      api.updateBookingStatus(id, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["bookings"] });
      void qc.invalidateQueries({ queryKey: queryKeys.booking(id) });
    },
  });
}

export function useProviders() {
  return useQuery({
    queryKey: queryKeys.providers,
    queryFn: () => api.listProviders(),
  });
}

export function useProvider(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.provider(id ?? ""),
    queryFn: () => api.getProvider(id!),
    enabled: Boolean(id),
  });
}

export function useCreateProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProviderInput) => api.createProvider(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.providers });
    },
  });
}

export function useSyncJobs(params?: SyncJobListParams) {
  return useQuery({
    queryKey: queryKeys.syncJobs(params),
    queryFn: () => api.listSyncJobs(params as Record<string, string | number>),
  });
}

export function useCreateSyncJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSyncJobInput) => api.createSyncJob(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["sync-jobs"] });
    },
  });
}
