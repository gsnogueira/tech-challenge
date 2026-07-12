"use client";

import { Button, Card, MetricCard, DataTable } from 'gabri-ui-components';

const tableRows = [
  { description: 'Salário', category: 'Receita', amount: '$4.500' },
  { description: 'Aluguel', category: 'Despesa', amount: '$1.200' },
  { description: 'Marketing', category: 'Investimento', amount: '$650' },
];

export default function DesignSystemPage() {
  return (
    <main className="ui-shell" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Design System</h1>
        <p style={{ color: '#7b8099' }}>Vitrine interna de componentes reutilizáveis para a aplicação.</p>
      </section>

      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Botões</h2>
        <div className="ui-row">
          <Button variant="primary">Primário</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Cards</h2>
        <div className="ui-row">
          <div style={{ flex: 1 }}>
            <Card title="Resumo do mês" subtitle="Indicadores principais" accent="green">
              <p>Card reutilizável para blocos de conteúdo e contexto.</p>
            </Card>
          </div>
          <div style={{ flex: 1 }}>
            <Card title="Atenção" subtitle="Eventos importantes" accent="red">
              <p>Ideal para alertas, destaques e estados de aplicação.</p>
            </Card>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Métricas</h2>
        <div className="ui-row">
          <MetricCard label="Fluxo líquido" value="$18.4k" change="▲ 12% vs. mês anterior" tone="green" />
          <MetricCard label="Despesas" value="$5.2k" change="▼ 4% vs. mês anterior" tone="red" changeDirection="down" />
          <MetricCard label="Receitas" value="$23.6k" change="▲ 8% vs. mês anterior" tone="blue" />
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Tabela</h2>
        <DataTable
          columns={[
            { key: 'description', label: 'Descrição' },
            { key: 'category', label: 'Categoria' },
            { key: 'amount', label: 'Valor' },
          ]}
          rows={tableRows}
        />
      </section>
    </main>
  );
}
