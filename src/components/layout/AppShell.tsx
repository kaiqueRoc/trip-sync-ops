import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { ApiModeBanner } from "@/components/layout/ApiModeBanner";

export function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <ApiModeBanner />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
