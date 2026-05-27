import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SyncJobStatusSchema } from "@trip-sync/contracts";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useSyncJobs } from "@/api/queries";
import { formatDateTime } from "@/lib/format";
import { syncJobStatusVariant } from "@/lib/status";
import type { SyncJobStatus } from "@/api/types";

export function SyncJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") as SyncJobStatus | null;
  const bookingId = searchParams.get("bookingId") ?? "";

  const query = useMemo(
    () => ({
      ...(status ? { status } : {}),
      ...(bookingId ? { bookingId } : {}),
    }),
    [status, bookingId],
  );

  const { data, isLoading, isError, refetch } = useSyncJobs(query);
  const queued = data?.filter((job) => job.status === "QUEUED").length ?? 0;
  const running = data?.filter((job) => job.status === "RUNNING").length ?? 0;
  const completed = data?.filter((job) => job.status === "COMPLETED").length ?? 0;
  const failed = data?.filter((job) => job.status === "FAILED").length ?? 0;

  return (
    <div className="page">
      <PageHeader
        title="Sync jobs"
        description="Fila de sincronização com provedores externos."
      />

      <div className="grid grid--stats">
        <Card>
          <p className="stat__label">Queued</p>
          <p className="stat__value stat__value--lg">{queued}</p>
          <p className="stat__hint">aguardando worker</p>
        </Card>
        <Card>
          <p className="stat__label">Running</p>
          <p className="stat__value stat__value--lg">{running}</p>
          <p className="stat__hint">em processamento</p>
        </Card>
        <Card>
          <p className="stat__label">Completed</p>
          <p className="stat__value stat__value--lg">{completed}</p>
          <p className="stat__hint">sincronizados</p>
        </Card>
        <Card>
          <p className="stat__label">Failed</p>
          <p className="stat__value stat__value--lg">{failed}</p>
          <p className="stat__hint">exigem ação</p>
        </Card>
      </div>

      <Card>
        <div className="filters">
          <label>
            Status
            <select
              value={status ?? ""}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                const val = e.target.value;
                if (val) next.set("status", val);
                else next.delete("status");
                setSearchParams(next);
              }}
            >
              <option value="">Todos</option>
              {SyncJobStatusSchema.options.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Booking ID
            <input
              value={bookingId}
              placeholder="cuid…"
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                const val = e.target.value;
                if (val) next.set("bookingId", val);
                else next.delete("bookingId");
                setSearchParams(next);
              }}
            />
          </label>
        </div>

        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState
            message="Falha ao carregar sync jobs."
            onRetry={() => void refetch()}
          />
        ) : null}

        {data ? (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Reserva</th>
                <th>Provedor</th>
                <th>Status</th>
                <th>Tentativas</th>
                <th>Criado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((j) => (
                <tr key={j.id}>
                  <td>
                    <code>{j.id.slice(0, 12)}…</code>
                  </td>
                  <td>
                    <Link to={`/bookings/${j.bookingId}`}>{j.bookingId.slice(0, 12)}…</Link>
                  </td>
                  <td>
                    <code>{j.providerId.slice(0, 12)}…</code>
                  </td>
                  <td>
                    <Badge variant={syncJobStatusVariant(j.status)}>
                      {j.status}
                    </Badge>
                  </td>
                  <td>{j.attempts}</td>
                  <td>{formatDateTime(j.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

        {data?.length === 0 ? (
          <p className="muted">Nenhum sync job encontrado.</p>
        ) : null}

        {data?.some((j) => j.lastError) ? (
          <div className="errors-panel">
            <h4>Últimos erros</h4>
            <ul>
              {data
                .filter((j) => j.lastError)
                .map((j) => (
                  <li key={j.id}>
                    <code>{j.id.slice(0, 8)}</code>: {j.lastError}
                  </li>
                ))}
            </ul>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
