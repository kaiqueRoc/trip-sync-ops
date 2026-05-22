import type { BadgeVariant } from "@/components/ui/badge-variants";
import type {
  BookingStatus,
  SyncJobStatus,
} from "@/api/types";

export function bookingStatusVariant(status: BookingStatus): BadgeVariant {
  switch (status) {
    case "CONFIRMED":
      return "success";
    case "PENDING":
      return "warning";
    case "CANCELLED":
      return "danger";
    default:
      return "default";
  }
}

export function syncJobStatusVariant(status: SyncJobStatus): BadgeVariant {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "RUNNING":
      return "default";
    case "QUEUED":
      return "warning";
    case "FAILED":
      return "danger";
    default:
      return "muted";
  }
}

export function healthStatusVariant(
  status: "ok" | "degraded",
): BadgeVariant {
  return status === "ok" ? "success" : "warning";
}
