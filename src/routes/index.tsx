import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { BookingsListPage } from "@/features/bookings/BookingsListPage";
import { BookingDetailPage } from "@/features/bookings/BookingDetailPage";
import { ProvidersPage } from "@/features/providers/ProvidersPage";
import { ProviderDetailPage } from "@/features/providers/ProviderDetailPage";
import { SyncJobsPage } from "@/features/sync-jobs/SyncJobsPage";
import { ReportsPage } from "@/features/reports/ReportsPage";
import { AlertsPage } from "@/features/alerts/AlertsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "bookings", element: <BookingsListPage /> },
      { path: "bookings/:id", element: <BookingDetailPage /> },
      { path: "providers", element: <ProvidersPage /> },
      { path: "providers/:id", element: <ProviderDetailPage /> },
      { path: "sync-jobs", element: <SyncJobsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "alerts", element: <AlertsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
