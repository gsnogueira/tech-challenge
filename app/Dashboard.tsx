"use client";
import { useMemo, useState } from 'react';
import { buildDashboardSummary } from './application/transactions/transactionService';
import { formatCurrency, formatDate, getTransactionBadge, getTransactionLabel } from './domain/transactions';
import { useTx } from './context/TxContext';

export default function Dashboard() {
  const { transactions } = useTx();
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(['summary', 'goals', 'alerts']);

  const summary = useMemo(() => buildDashboardSummary(transactions), [transactions]);

  function toggleWidget(widget: string) {
    setSelectedWidgets((prev) =>
      prev.includes(widget) ? prev.filter((item) => item !== widget) : [...prev, widget],
    );
  }

  return (
    <div>
      <div className="balance-hero">
        <div>
          <div className="balance-label">Saldo da conta</div>
          <div className="balance-amount">{summary.formattedBalance}</div>
          <div className="balance-meta">Conta corrente • Atualizado hoje</div>
        </div>
        <div className="balance-account">
          <div className="balance-account-label">Agência</div>
          <div className="balance-account-num">0001 • 123456-7</div>
        </div>
      </div>

      <div className="section" style={{ marginTop: '20px' }}>
        <div className="section-header">
          <div className="section-title">Personalizar widgets</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['summary', 'goals', 'alerts'].map((widget) => (
            <label key={widget} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '999px', background: 'var(--c-surface)', border: '1px solid var(--c-border)', cursor: 'pointer' }}>
              <input type="checkbox" checked={selectedWidgets.includes(widget)} onChange={() => toggleWidget(widget)} />
              <span>{widget === 'summary' ? 'Resumo' : widget === 'goals' ? 'Metas de economia' : 'Alertas de gastos'}</span>
            </label>
          ))}
        </div>
      </div>

      {selectedWidgets.includes('summary') && (
        <div className="cards-grid">
          <div className="metric-card green">
            <div className="metric-label">Receitas</div>
            <div className="metric-value green">{summary.formattedIncome}</div>
            <div className="metric-change up">{summary.totalTransactions} transações</div>
          </div>
          <div className="metric-card red">
            <div className="metric-label">Despesas</div>
            <div className="metric-value red">{summary.formattedExpense}</div>
            <div className="metric-change down">{summary.totalTransactions} transações</div>
          </div>
          <div className="metric-card blue">
            <div className="metric-label">Transferências</div>
            <div className="metric-value blue">{summary.transfersCount}</div>
            <div className="metric-change">Últimos 30 dias</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {selectedWidgets.includes('goals') && (
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div className="metric-card purple" style={{ minHeight: '180px' }}>
              <div className="metric-label">Meta de economia</div>
              <div className="metric-value" style={{ color: 'var(--c-purple)' }}>R$ 8.000</div>
              <div className="metric-change up">Progresso: 62% concluído</div>
              <div style={{ marginTop: '12px', height: '8px', borderRadius: '999px', background: 'rgba(157,125,255,0.18)' }}>
                <div style={{ width: '62%', height: '100%', borderRadius: '999px', background: 'var(--c-purple)' }} />
              </div>
            </div>
          </div>
        )}

        {selectedWidgets.includes('alerts') && (
          <div style={{ flex: 1 }}>
            <div className="metric-card red" style={{ minHeight: '180px' }}>
              <div className="metric-label">Alertas de gastos</div>
              <div className="metric-value red">3 itens</div>
              <div className="metric-change down">Gastos acima do limite planejado</div>
              <ul style={{ marginTop: '12px', display: 'grid', gap: '8px', color: 'var(--c-muted)', fontSize: '13px' }}>
                <li>• Restaurante: +R$ 180</li>
                <li>• Transporte: +R$ 95</li>
                <li>• Assinaturas: +R$ 60</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <section className="section">
        <div className="section-header">
          <div className="section-title">Últimas transações</div>
          <button className="btn btn-ghost" onClick={() => window.location.href = '/transactions'}>Ver todas →</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 8).map((tx) => (
                <tr key={tx.id}>
                  <td className="tx-desc">
                    {tx.description}
                    <small className="tx-date">{tx.note || '—'}</small>
                  </td>
                  <td><span className={`tx-type-badge ${getTransactionBadge(tx.type)}`}>{getTransactionLabel(tx.type)}</span></td>
                  <td className="tx-date">{formatDate(tx.date)}</td>
                  <td className={`tx-amount ${tx.amount < 0 ? 'negative' : 'positive'}`}>
                    {tx.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(tx.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
