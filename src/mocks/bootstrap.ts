import { API_URL, MSW_FALLBACK, USE_MSW } from "@/config/env";

async function unregisterMockWorker() {
  if (!("serviceWorker" in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations
      .filter((registration) =>
        registration.active?.scriptURL.includes("mockServiceWorker.js"),
      )
      .map((registration) => registration.unregister()),
  );
}

async function apiReachable(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, {
      signal: AbortSignal.timeout(2500),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function bootstrapMocks(): Promise<"live" | "msw" | "none"> {
  if (USE_MSW) {
    const { worker } = await import("@/mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass", quiet: true });
    return "msw";
  }

  if (import.meta.env.PROD) {
    await unregisterMockWorker();
  }

  if (MSW_FALLBACK) {
    const reachable = await apiReachable();
    if (!reachable) {
      const { worker } = await import("@/mocks/browser");
      await worker.start({ onUnhandledRequest: "bypass", quiet: true });
      console.info(
        "[trip-sync-ops] API indisponível — MSW fallback ativo para",
        API_URL,
      );
      return "msw";
    }
  }

  return "live";
}
