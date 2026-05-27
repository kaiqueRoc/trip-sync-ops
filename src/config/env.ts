const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const defaultApiUrl = import.meta.env.PROD
  ? "https://trip-sync-api.vercel.app"
  : "http://localhost:3333";

/** Base URL for TripSync API (no trailing slash). */
export const API_URL = (rawApiUrl || defaultApiUrl).replace(/\/$/, "");

export const USE_MSW = import.meta.env.VITE_USE_MSW === "true";

/** When true, start MSW if the API health check fails at boot. */
export const MSW_FALLBACK =
  import.meta.env.VITE_MSW_FALLBACK !== "false" && import.meta.env.DEV;

export const IS_DEV = import.meta.env.DEV;
