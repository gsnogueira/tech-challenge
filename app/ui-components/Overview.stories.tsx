import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Card } from './Card';
import { MetricCard } from './MetricCard';
import { DataTable } from './DataTable';

const meta: Meta = {
  title: 'UI/Overview',
};

export default meta;
type Story = StoryObj;

export const DashboardPreview: Story = {
  render: () => (
    <div className="ui-shell" style={{ padding: 24 }}>
      <div className="ui-row" style={{ marginBottom: 16 }}>
        <Button variant="primary">Nova transação</Button>
        <Button variant="ghost">Exportar</Button>
      </div>

      <div className="ui-row" style={{ marginBottom: 16 }}>
        <MetricCard label="Fluxo líquido" value="$18.4k" change="▲ 12% vs. mês anterior" tone="green" />
        <MetricCard label="Despesas" value="$5.2k" change="▼ 4% vs. mês anterior" tone="red" changeDirection="down" />
        <MetricCard label="Receitas" value="$23.6k" change="▲ 8% vs. mês anterior" tone="blue" />
      </div>

      <div className="ui-row" style={{ marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <Card title="Operações principais" subtitle="Últimas entradas e saídas" accent="purple">
            <div className="ui-stack">
              <p>Bloco preparado para reutilização em dashboards e páginas de gestão.</p>
              <Button variant="ghost" size="sm">Abrir relatório</Button>
            </div>
          </Card>
        </div>
        <div style={{ flex: 1 }}>
          <Card title="Resumo rápido" subtitle="Acompanhe o estado da conta" accent="blue">
            <div className="ui-stack">
              <p>Os componentes usam os mesmos tokens visuais da aplicação atual.</p>
              <Button variant="primary" size="sm">Atualizar</Button>
            </div>
          </Card>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'description', label: 'Descrição' },
          { key: 'category', label: 'Categoria' },
          { key: 'amount', label: 'Valor' },
        ]}
        rows={[
          { description: 'Assinatura', category: 'Operação', amount: '$89' },
          { description: 'Freelance', category: 'Receita', amount: '$1.450' },
          { description: 'Aluguel', category: 'Despesa', amount: '$1.200' },
        ]}
      />
    </div>
  ),
};
