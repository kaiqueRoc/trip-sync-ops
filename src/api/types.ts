import type { components } from "@/api/generated/schema";

export type HealthResponse = components["schemas"]["HealthResponse"];
export type BookingResponse = components["schemas"]["BookingResponse"];
export type BookingListResponse = components["schemas"]["BookingListResponse"];
export type BookingStatus = components["schemas"]["BookingStatus"];
export type CreateBookingInput = components["schemas"]["CreateBookingInput"];
export type UpdateBookingStatusInput =
  components["schemas"]["UpdateBookingStatusInput"];
export type ProviderResponse = components["schemas"]["ProviderResponse"];
export type ProviderListResponse = components["schemas"]["ProviderListResponse"];
export type CreateProviderInput = components["schemas"]["CreateProviderInput"];
export type SyncJobResponse = components["schemas"]["SyncJobResponse"];
export type CreateSyncJobInput = components["schemas"]["CreateSyncJobInput"];
export type SyncJobStatus = components["schemas"]["SyncJobStatus"];
export type ApiError = components["schemas"]["ApiError"];
