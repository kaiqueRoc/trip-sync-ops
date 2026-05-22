import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { bootstrapMocks } from "@/mocks/bootstrap";
import { ApiModeContext, type ApiMode } from "@/hooks/useApiMode";
import { queryClient } from "@/lib/query-client";
import App from "@/App";
import "@/index.css";

async function main() {
  const mode: ApiMode = (await bootstrapMocks()) === "msw" ? "msw" : "live";

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ApiModeContext.Provider value={mode}>
          <App />
        </ApiModeContext.Provider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

void main();
