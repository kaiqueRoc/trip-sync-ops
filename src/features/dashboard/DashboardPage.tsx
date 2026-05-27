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

const providerIntegrations = [
  { name: "Amadeus", type: "Flights", status: "Online" },
  { name: "Sabre", type: "Hotels", status: "Degraded" },
  { name: "Travelport", type: "Cars", status: "Online" },
];

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
  const confirmed =
    bookings.data?.data.filter((b) => b.status === "CONFIRMED").length ?? 0;
  const failedJobs =
    syncJobs.data?.filter((j) => j.status === "FAILED").length ?? 0;
  const queuedJobs =
    syncJobs.data?.filter((j) => j.status === "QUEUED").length ?? 0;
  const activeProviders =
    providers.data?.data.filter((p) => p.active).length ?? 0;

  return (
    <div className="page">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Operations console</span>
          <h1>TripSync Ops</h1>
          <p>
            Controle reservas, provedores e fila de sincronização em um painel
            operacional para integrações travel B2B.
          </p>
        </div>
        <div className="hero-card__meta">
          <Badge variant="success">API {health.data!.status}</Badge>
          <span>TanStack Query</span>
          <span>OpenAPI contracts</span>
        </div>
      </section>

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
          <p className="stat__hint">{confirmed} confirmadas na amostra atual</p>
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
          <p className="stat__hint">{queuedJobs} aguardando processamento</p>
          <Link to="/sync-jobs?status=FAILED">Investigar →</Link>
        </Card>
      </div>

      <div className="grid grid--two">
        <Card title="Provider integrations">
          <div className="integration-list">
            {providerIntegrations.map((provider) => (
              <div key={provider.name} className="integration-item">
                <span className="integration-item__logo">
                  {provider.name.slice(0, 1)}
                </span>
                <div>
                  <strong>{provider.name}</strong>
                  <small>{provider.type}</small>
                </div>
                <Badge
                  variant={provider.status === "Online" ? "success" : "warning"}
                >
                  {provider.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

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
      </div>

      <div className="grid grid--two">
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

        <Card title="Recent sync activity">
          {syncJobs.isLoading ? (
            <LoadingState label="Carregando fila…" />
          ) : (
            <div className="timeline">
              {(syncJobs.data ?? []).slice(0, 4).map((job) => (
                <div key={job.id}>
                  <strong>{job.status}</strong>
                  <span>
                    Job <code>{job.id.slice(0, 8)}</code> para reserva{" "}
                    <code>{job.bookingId.slice(0, 8)}</code>
                  </span>
                </div>
              ))}
              {syncJobs.data?.length === 0 ? (
                <p className="muted">Nenhum job recente encontrado.</p>
              ) : null}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
