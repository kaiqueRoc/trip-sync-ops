import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { API_URL } from "@/config/env";

export function SettingsPage() {
  return (
    <div className="page">
      <PageHeader
        title="Settings"
        description="Configurações do console operacional e integrações do ambiente."
      />

      <div className="grid grid--two">
        <Card title="Ambiente">
          <dl className="detail-list">
            <div>
              <dt>API base</dt>
              <dd>
                <code>{API_URL}</code>
              </dd>
            </div>
            <div>
              <dt>Modo</dt>
              <dd>
                <Badge variant="success">Production-ready</Badge>
              </dd>
            </div>
            <div>
              <dt>Cache</dt>
              <dd>TanStack Query com invalidação por domínio</dd>
            </div>
          </dl>
        </Card>

        <Card title="Permissões">
          <div className="settings-list">
            <label>
              <input type="checkbox" checked readOnly />
              Criar reservas
            </label>
            <label>
              <input type="checkbox" checked readOnly />
              Gerenciar provedores
            </label>
            <label>
              <input type="checkbox" checked readOnly />
              Monitorar sync jobs
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}
