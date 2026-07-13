"use client";

import { useMemo } from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Button, Card, MetricCard, DataTable } from 'gabri-ui-components';
import { useTx } from '../context/TxContext';
import { formatCurrency, formatDate, getTransactionLabel } from '../domain/transactions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

const CHART_COLORS = {
  green: '#00e5a0',
  greenSoft: 'rgba(0, 229, 160, 0.25)',
  red: '#ff4f6e',
  redSoft: 'rgba(255, 79, 110, 0.22)',
  blue: '#4d9fff',
  blueSoft: 'rgba(77, 159, 255, 0.22)',
  purple: '#9d7dff',
  purpleSoft: 'rgba(157, 125, 255, 0.22)',
  text: '#e8eaf0',
  muted: '#7b8099',
  border: 'rgba(255, 255, 255, 0.08)',
};

function getLastMonths(months: number) {
  const now = new Date();
  const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

  return Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const label = monthFormatter
      .format(date)
      .replace('.', '')
      .replace(/^[a-z]/, (char) => char.toUpperCase());

    return { key, label, year: date.getFullYear(), month: date.getMonth() };
  });
}

function toMonthKey(dateString: string) {
  const parsedDate = new Date(`${dateString}T00:00:00`);
  return `${parsedDate.getFullYear()}-${parsedDate.getMonth()}`;
}

export default function AnalyticsView() {
  const { transactions } = useTx();

  const analytics = useMemo(() => {
    const months = getLastMonths(6);
    const monthlyMap = new Map(months.map((month) => [month.key, { income: 0, expense: 0 }]));

    const typeTotals = new Map<string, number>();

    for (const transaction of transactions) {
      const amount = Math.abs(transaction.amount);
      const monthKey = toMonthKey(transaction.date);
      const monthlySlot = monthlyMap.get(monthKey);

      if (monthlySlot) {
        if (transaction.type === 'deposit') monthlySlot.income += amount;
        else monthlySlot.expense += amount;
      }

      typeTotals.set(transaction.type, (typeTotals.get(transaction.type) ?? 0) + amount);
    }

    const monthlyFlow = months.map((month) => {
      const values = monthlyMap.get(month.key) ?? { income: 0, expense: 0 };
      return {
        month: month.label,
        income: values.income,
        expense: values.expense,
        net: values.income - values.expense,
      };
    });

    const totalIncome = transactions
      .filter((transaction) => transaction.type === 'deposit')
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    const totalExpense = transactions
      .filter((transaction) => transaction.type !== 'deposit')
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    const netBalance = totalIncome - totalExpense;
    const margin = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

    const sortedTypeTotals = Array.from(typeTotals.entries()).sort((a, b) => b[1] - a[1]);
    const expenseByType = sortedTypeTotals.filter(([type]) => type !== 'deposit');

    const currentMonth = monthlyFlow[monthlyFlow.length - 1] ?? { income: 0, expense: 0, net: 0 };
    const previousMonth = monthlyFlow[monthlyFlow.length - 2] ?? { income: 0, expense: 0, net: 0 };
    const monthVariation = previousMonth.net === 0
      ? 0
      : ((currentMonth.net - previousMonth.net) / Math.abs(previousMonth.net)) * 100;

    return {
      monthlyFlow,
      totalIncome,
      totalExpense,
      netBalance,
      margin,
      monthVariation,
      expenseByType,
      sortedTypeTotals,
    };
  }, [transactions]);

  const barData = useMemo(() => ({
    labels: analytics.monthlyFlow.map((item) => item.month),
    datasets: [
      {
        label: 'Entradas',
        data: analytics.monthlyFlow.map((item) => item.income),
        backgroundColor: CHART_COLORS.greenSoft,
        borderColor: CHART_COLORS.green,
        borderWidth: 1.5,
        borderRadius: 8,
      },
      {
        label: 'Saídas',
        data: analytics.monthlyFlow.map((item) => item.expense),
        backgroundColor: CHART_COLORS.redSoft,
        borderColor: CHART_COLORS.red,
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  }), [analytics.monthlyFlow]);

  const lineData = useMemo(() => ({
    labels: analytics.monthlyFlow.map((item) => item.month),
    datasets: [
      {
        label: 'Saldo mensal',
        data: analytics.monthlyFlow.map((item) => item.net),
        borderColor: CHART_COLORS.blue,
        backgroundColor: CHART_COLORS.blueSoft,
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: CHART_COLORS.blue,
      },
    ],
  }), [analytics.monthlyFlow]);

  const doughnutData = useMemo(() => ({
    labels: analytics.expenseByType.map(([type]) => getTransactionLabel(type)),
    datasets: [
      {
        label: 'Composição por tipo',
        data: analytics.expenseByType.map(([, amount]) => amount),
        backgroundColor: [
          CHART_COLORS.red,
          CHART_COLORS.blue,
          CHART_COLORS.purple,
          '#ffb347',
          '#00d2ff',
        ],
        borderColor: '#0d0f14',
        borderWidth: 2,
      },
    ],
  }), [analytics.expenseByType]);

  const commonOptions: ChartOptions<'bar' | 'line' | 'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: CHART_COLORS.text,
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#161b26',
        borderColor: CHART_COLORS.border,
        borderWidth: 1,
        titleColor: CHART_COLORS.text,
        bodyColor: CHART_COLORS.text,
      },
    },
    scales: {
      x: {
        ticks: { color: CHART_COLORS.muted },
        grid: { color: 'rgba(255,255,255,0.03)' },
      },
      y: {
        ticks: { color: CHART_COLORS.muted },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

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
        <MetricCard
          label="Receita total"
          value={formatCurrency(analytics.totalIncome)}
          change={`${transactions.filter((transaction) => transaction.type === 'deposit').length} lançamentos`}
          tone="green"
        />
        <MetricCard
          label="Despesas"
          value={formatCurrency(analytics.totalExpense)}
          change={`${transactions.filter((transaction) => transaction.type !== 'deposit').length} lançamentos`}
          tone="red"
          changeDirection="down"
        />
        <MetricCard
          label="Saldo líquido"
          value={formatCurrency(analytics.netBalance)}
          change={`${analytics.monthVariation >= 0 ? '▲' : '▼'} ${Math.abs(analytics.monthVariation).toFixed(1)}% vs. mês anterior`}
          tone="blue"
          changeDirection={analytics.monthVariation >= 0 ? 'up' : 'down'}
        />
      </section>

      <section style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '320px' }}>
          <Card title="Fluxo de caixa mensal" subtitle="Comparativo entre entradas e saídas" accent="purple">
            <div style={{ height: '280px' }}>
              <Bar data={barData} options={commonOptions as ChartOptions<'bar'>} />
            </div>
          </Card>
        </div>

        <div style={{ flex: 1, minWidth: '260px' }}>
          <Card title="Resumo executivo" subtitle="Indicadores-chave" accent="green">
            <div style={{ display: 'grid', gap: '10px' }}>
              {[
                {
                  label: 'Margem líquida',
                  value: `${analytics.margin.toFixed(1)}%`,
                  color: '#00e5a0',
                },
                {
                  label: 'Ticket médio',
                  value: formatCurrency(
                    transactions.length > 0
                      ? (analytics.totalIncome + analytics.totalExpense) / transactions.length
                      : 0,
                  ),
                  color: '#4d9fff',
                },
                {
                  label: 'Movimentações',
                  value: String(transactions.length),
                  color: '#9d7dff',
                },
              ].map((item) => (
                <div key={item.label} style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '12px', color: '#7b8099' }}>{item.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '320px' }}>
          <Card title="Evolução do saldo" subtitle="Tendência dos últimos meses" accent="blue">
            <div style={{ height: '260px' }}>
              <Line data={lineData} options={commonOptions as ChartOptions<'line'>} />
            </div>
          </Card>
        </div>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <Card title="Composição de despesas" subtitle="Distribuição por tipo" accent="red">
            {analytics.expenseByType.length === 0 ? (
              <p style={{ color: '#7b8099' }}>Sem despesas registradas para compor o gráfico.</p>
            ) : (
              <div style={{ height: '260px' }}>
                <Doughnut
                  data={doughnutData}
                  options={{
                    ...commonOptions,
                    scales: undefined,
                  } as ChartOptions<'doughnut'>}
                />
              </div>
            )}
          </Card>
        </div>
      </section>

      <section>
        <Card title="Categorias de despesa" subtitle="Distribuição por participação" accent="blue">
          <DataTable
            columns={[
              { key: 'category', label: 'Categoria' },
              { key: 'amount', label: 'Valor' },
              { key: 'share', label: 'Participação' },
            ]}
            rows={analytics.expenseByType.map(([type, amount]) => ({
              category: getTransactionLabel(type),
              amount: formatCurrency(amount),
              share: analytics.totalExpense > 0 ? `${((amount / analytics.totalExpense) * 100).toFixed(1)}%` : '0%',
            }))}
          />
        </Card>
      </section>
    </main>
  );
}
