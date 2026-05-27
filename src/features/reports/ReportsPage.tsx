import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";

const reports = [
  { title: "Booking volume", value: "128", hint: "reservas processadas no período" },
  { title: "Gross booking value", value: "USD 248k", hint: "simulação de GMV B2B" },
  { title: "Provider SLA", value: "98.4%", hint: "respostas dentro do tempo esperado" },
];

export function ReportsPage() {
  return (
    <div className="page">
      <PageHeader
        title="Reports"
        description="Indicadores executivos para acompanhar operação, receita e SLA dos provedores."
      />

      <div className="grid grid--stats">
        {reports.map((report) => (
          <Card key={report.title}>
            <p className="stat__label">{report.title}</p>
            <p className="stat__value stat__value--lg">{report.value}</p>
            <p className="stat__hint">{report.hint}</p>
          </Card>
        ))}
      </div>

      <Card title="Resumo operacional">
        <div className="timeline">
          <div>
            <strong>Conversão por canal</strong>
            <span>Agências corporativas lideram o volume de reservas confirmadas.</span>
          </div>
          <div>
            <strong>Receita por provedor</strong>
            <span>Amadeus e HotelBeds concentram a maior parte do GMV simulado.</span>
          </div>
          <div>
            <strong>Fila de sincronização</strong>
            <span>Falhas são agrupadas por provedor para priorizar investigação.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
