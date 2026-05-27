import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";

const alerts = [
  {
    title: "Provider timeout",
    severity: "Alta",
    detail: "Sabre SOAP passou de 30s em 3 tentativas recentes.",
  },
  {
    title: "Sync queue backlog",
    severity: "Média",
    detail: "Fila aguardando processamento automático de jobs pendentes.",
  },
  {
    title: "Contract drift",
    severity: "Baixa",
    detail: "OpenAPI regenerado recentemente; validar clientes consumidores.",
  },
];

export function AlertsPage() {
  return (
    <div className="page">
      <PageHeader
        title="Alerts"
        description="Central de alertas operacionais para priorizar incidentes de integração."
      />

      <Card>
        <div className="timeline">
          {alerts.map((alert) => (
            <div key={alert.title}>
              <strong>{alert.title}</strong>
              <span>{alert.detail}</span>
              <Badge variant={alert.severity === "Alta" ? "danger" : "warning"}>
                {alert.severity}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
