import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProviderForm } from "@/features/providers/ProviderForm";
import { useCreateProvider, useProviders } from "@/api/queries";

export function ProvidersPage() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, isError, refetch } = useProviders();
  const createProvider = useCreateProvider();

  return (
    <div className="page">
      <PageHeader
        title="Provedores"
        description="Parceiros de integração REST/SOAP."
        actions={
          <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Fechar" : "Novo provedor"}
          </Button>
        }
      />

      {showForm ? (
        <Card title="Registrar provedor">
          <ProviderForm
            isPending={createProvider.isPending}
            onSubmit={(input) => {
              const payload = {
                ...input,
                baseUrl: input.baseUrl?.trim() ? input.baseUrl : undefined,
              };
              createProvider.mutate(payload, {
                onSuccess: () => setShowForm(false),
              });
            }}
          />
          {createProvider.isError ? (
            <p className="form__error">{createProvider.error.message}</p>
          ) : null}
        </Card>
      ) : null}

      <Card>
        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState
            message="Falha ao carregar provedores."
            onRetry={() => void refetch()}
          />
        ) : null}
        {data ? (
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Slug</th>
                <th>Tipo</th>
                <th>Saúde</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/providers/${p.id}`}>{p.name}</Link>
                  </td>
                  <td>
                    <code>{p.slug}</code>
                  </td>
                  <td>{p.integrationType}</td>
                  <td>
                    {p.lastHealthStatus ? (
                      <Badge
                        variant={
                          p.lastHealthStatus === "UP" ? "success" : "danger"
                        }
                      >
                        {p.lastHealthStatus}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <Badge variant={p.active ? "success" : "muted"}>
                      {p.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </Card>
    </div>
  );
}
