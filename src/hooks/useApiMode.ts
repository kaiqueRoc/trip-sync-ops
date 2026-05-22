import { createContext, useContext } from "react";

export type ApiMode = "live" | "msw";

export const ApiModeContext = createContext<ApiMode>("live");

export function useApiMode(): ApiMode {
  return useContext(ApiModeContext);
}
