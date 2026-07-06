"use client";

import { Button } from '../ui-components/Button';
import { Card } from '../ui-components/Card';
import { MetricCard } from '../ui-components/MetricCard';
import { DataTable } from '../ui-components/DataTable';

const monthlyTrend = [
  { month: 'Jan', inflow: 12, outflow: 8 },
  { month: 'Fev', inflow: 14, outflow: 9 },
  { month: 'Mar', inflow: 13, outflow: 10 },
  { month: 'Abr', inflow: 16, outflow: 11 },
  { month: 'Mai', inflow: 15, outflow: 8 },
  { month: 'Jun', inflow: 18, outflow: 9 },
];

const insights = [
  { label: 'Margem líquida', value: '68%', tone: 'green' },
  { label: 'Ponto de equilíbrio', value: 'R$ 4,8k', tone: 'blue' },
  { label: 'Risco de caixa', value: 'Baixo', tone: 'purple' },
];

export default function AnalyticsPage() {
  return (
    <main className="ui-shell" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <section className="ui-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Análises financeiras</h1>
          <p style={{ color: '#7b8099' }}>Uma visão detalhada do desempenho financeiro da operação.</p>
        </div>
        <Button variant="primary">Exportar relatório</Button>
      </section>

      <section className="ui-row">
        <MetricCard label="Receita total" value="R$ 92,4k" change="▲ 12% vs. último trimestre" tone="green" />
        <MetricCard label="Despesas" value="R$ 29,8k" change="▼ 4% vs. último trimestre" tone="red" changeDirection="down" />
        <MetricCard label="Saldo líquido" value="R$ 62,6k" change="▲ 8% vs. último trimestre" tone="blue" />
      </section>

      <section className="ui-row">
        <div style={{ flex: 2 }}>
          <Card title="Fluxo de caixa mensal" subtitle="Comparativo entre entradas e saídas" accent="purple">
            <div style={{ display: 'grid', gap: '10px' }}>
              {monthlyTrend.map((item) => (
                <div key={item.month}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span>{item.month}</span>
                    <span style={{ color: '#00e5a0' }}>+{item.inflow}k</span>
                    <span style={{ color: '#ff4f6e' }}>-{item.outflow}k</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(0,229,160,0.18)' }}>
                      <div style={{ width: `${item.inflow * 5}%`, height: '100%', background: '#00e5a0', borderRadius: '999px' }} />
                    </div>
                    <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(255,79,110,0.18)' }}>
                      <div style={{ width: `${item.outflow * 5}%`, height: '100%', background: '#ff4f6e', borderRadius: '999px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ flex: 1 }}>
          <Card title="Resumo executivo" subtitle="Indicadores-chave" accent="green">
            <div className="ui-stack">
              {insights.map((item) => (
                <div key={item.label} style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '12px', color: '#7b8099' }}>{item.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: item.tone === 'green' ? '#00e5a0' : item.tone === 'blue' ? '#4d9fff' : '#9d7dff' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section>
        <Card title="Categorias de despesa" subtitle="Distribuição por área" accent="blue">
          <DataTable
            columns={[
              { key: 'category', label: 'Categoria' },
              { key: 'amount', label: 'Valor' },
              { key: 'share', label: 'Participação' },
            ]}
            rows={[
              { category: 'Operação', amount: 'R$ 12,4k', share: '41%' },
              { category: 'Pessoal', amount: 'R$ 8,1k', share: '27%' },
              { category: 'Marketing', amount: 'R$ 5,3k', share: '18%' },
              { category: 'Tecnologia', amount: 'R$ 4,0k', share: '14%' },
            ]}
          />
        </Card>
      </section>
    </main>
  );
}
