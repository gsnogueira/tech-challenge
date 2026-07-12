"use client";

import { Button, Card, MetricCard, DataTable } from 'gabri-ui-components';
import { useTx } from '../context/TxContext';
import { formatCurrency, formatDate, getTransactionLabel } from '../domain/transactions';

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

export default function AnalyticsView() {
  const { transactions } = useTx();

  function handleExportReport() {
    if (typeof window === 'undefined') return;

    const header = ['Data', 'Tipo', 'Descrição', 'Valor', 'Observação'];
    const rows = transactions.map((transaction) => [
      formatDate(transaction.date),
      getTransactionLabel(transaction.type),
      transaction.description,
      formatCurrency(Math.abs(transaction.amount)),
      transaction.note ?? '',
    ]);

    const csv = [header, ...rows]
      .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio-financas.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  return (
    <main style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Análises financeiras</h1>
          <p style={{ color: '#7b8099' }}>Uma visão detalhada do desempenho financeiro da operação.</p>
        </div>
        <Button variant="primary" onClick={handleExportReport}>Exportar relatório</Button>
      </section>

      <section style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <MetricCard label="Receita total" value="R$ 92,4k" change="▲ 12% vs. último trimestre" tone="green" />
        <MetricCard label="Despesas" value="R$ 29,8k" change="▼ 4% vs. último trimestre" tone="red" changeDirection="down" />
        <MetricCard label="Saldo líquido" value="R$ 62,6k" change="▲ 8% vs. último trimestre" tone="blue" />
      </section>

      <section style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '320px' }}>
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

        <div style={{ flex: 1, minWidth: '260px' }}>
          <Card title="Resumo executivo" subtitle="Indicadores-chave" accent="green">
            <div style={{ display: 'grid', gap: '10px' }}>
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
