import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  useBookings,
  useHealth,
  useProviders,
  useSyncJobs,
} from "@/api/queries";
import { formatUptime } from "@/lib/format";
import { healthStatusVariant } from "@/lib/status";
import { API_URL } from "@/config/env";

export function DashboardPage() {
  const health = useHealth();
  const bookings = useBookings({ page: 1, pageSize: 5 });
  const providers = useProviders();
  const syncJobs = useSyncJobs();

  if (health.isLoading) return <LoadingState />;
  if (health.isError) {
    return (
      <ErrorState
        message="Não foi possível carregar o status da API."
        onRetry={() => void health.refetch()}
      />
    );
  }

  const pending = bookings.data?.data.filter((b) => b.status === "PENDING").length ?? 0;
  const failedJobs =
    syncJobs.data?.filter((j) => j.status === "FAILED").length ?? 0;
  const activeProviders =
    providers.data?.data.filter((p) => p.active).length ?? 0;

  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        description="Visão operacional do TripSync — reservas, provedores e sincronização."
      />

      <div className="grid grid--stats">
        <Card>
          <p className="stat__label">API</p>
          <div className="stat__value">
            <Badge variant={healthStatusVariant(health.data!.status)}>
              {health.data!.status}
            </Badge>
          </div>
          <p className="stat__hint">
            v{health.data!.version} · uptime {formatUptime(health.data!.uptimeSeconds)}
          </p>
        </Card>
        <Card>
          <p className="stat__label">Reservas pendentes</p>
          <p className="stat__value stat__value--lg">{pending}</p>
          <Link to="/bookings?status=PENDING">Ver pendentes →</Link>
        </Card>
        <Card>
          <p className="stat__label">Provedores ativos</p>
          <p className="stat__value stat__value--lg">{activeProviders}</p>
          <Link to="/providers">Gerenciar →</Link>
        </Card>
        <Card>
          <p className="stat__label">Sync jobs com falha</p>
          <p className="stat__value stat__value--lg">{failedJobs}</p>
          <Link to="/sync-jobs?status=FAILED">Investigar →</Link>
        </Card>
      </div>

      <div className="grid grid--two">
        <Card title="Saúde dos serviços">
          <ul className="checks-list">
            <li>
              Database{" "}
              <Badge
                variant={
                  health.data!.checks.database === "up" ? "success" : "danger"
                }
              >
                {health.data!.checks.database}
              </Badge>
            </li>
            <li>
              Redis{" "}
              <Badge variant="muted">{health.data!.checks.redis}</Badge>
            </li>
          </ul>
          <p className="muted">
            Endpoint: <code>{API_URL}</code>
          </p>
        </Card>

        <Card title="Últimas reservas">
          {bookings.isLoading ? (
            <LoadingState label="Carregando reservas…" />
          ) : (
            <table className="table table--compact">
              <thead>
                <tr>
                  <th>Ref.</th>
                  <th>Destino</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.data?.data.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <Link to={`/bookings/${b.id}`}>{b.reference}</Link>
                    </td>
                    <td>{b.destination}</td>
                    <td>{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}
