import { useApiMode } from "@/hooks/useApiMode";

export function ApiModeBanner() {
  const mode = useApiMode();
  if (mode === "live") return null;

  return (
    <div className="api-banner" role="status">
      Modo demonstração (MSW) — dados simulados. Configure a API em{" "}
      <code>VITE_API_URL</code>.
    </div>
  );
}
