import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useProvider } from "@/api/queries";
import { formatDateTime } from "@/lib/format";

export function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const provider = useProvider(id);

  if (provider.isLoading) return <LoadingState />;
  if (provider.isError || !provider.data) {
    return (
      <ErrorState
        message="Provedor não encontrado."
        onRetry={() => void provider.refetch()}
      />
    );
  }

  const p = provider.data;

  return (
    <div className="page">
      <PageHeader
        title={p.name}
        description={`/${p.slug} · ${p.integrationType}`}
        actions={
          <Link to="/providers" className="btn btn--ghost btn--sm">
            ← Voltar
          </Link>
        }
      />
      <Card>
        <dl className="detail-list">
          <div>
            <dt>Base URL</dt>
            <dd>{p.baseUrl ?? "—"}</dd>
          </div>
          <div>
            <dt>Ativo</dt>
            <dd>
              <Badge variant={p.active ? "success" : "muted"}>
                {p.active ? "Sim" : "Não"}
              </Badge>
            </dd>
          </div>
          <div>
            <dt>Última verificação</dt>
            <dd>
              {p.lastHealthAt ? formatDateTime(p.lastHealthAt) : "—"}{" "}
              {p.lastHealthStatus ? `(${p.lastHealthStatus})` : ""}
            </dd>
          </div>
          <div>
            <dt>Criado em</dt>
            <dd>{formatDateTime(p.createdAt)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
