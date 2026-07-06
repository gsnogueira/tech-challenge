"use client";
import { useEffect, useState } from 'react';
import { useTx } from './context/TxContext';

export default function Dashboard(){
  const { transactions, openModal } = useTx();
  const [monthData, setMonthData] = useState({ income: 0, expense: 0, invest: 0, total: 0 });
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(['summary', 'goals', 'alerts']);

  useEffect(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const monthly = transactions.filter((t: { date: string; type: string; amount: number }) => {
      const [y, m] = t.date.split('-').map(Number);
      return m - 1 === thisMonth && y === thisYear;
    });

    const income = monthly.filter((t: { type: string; amount: number }) => t.type === 'deposit').reduce((s: number, t: { amount: number }) => s + Math.abs(t.amount), 0);
    const expense = monthly.filter((t: { type: string; amount: number }) => t.type !== 'deposit').reduce((s: number, t: { amount: number }) => s + Math.abs(t.amount), 0);
    const invest = monthly.filter((t: { type: string; amount: number }) => t.type === 'investment').reduce((s: number, t: { amount: number }) => s + Math.abs(t.amount), 0);

    setMonthData({ income, expense, invest, total: monthly.length });
  }, [transactions]);

  const balance = transactions.reduce((s: number, t: { type: string; amount: number }) => {
    if (t.type === 'deposit') return s + Math.abs(t.amount);
    return s - Math.abs(t.amount);
  }, 0);

  function formatCurrency(val: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date + 'T00:00:00'));
  }

  function toggleWidget(widget: string) {
    setSelectedWidgets((prev) => prev.includes(widget) ? prev.filter((item) => item !== widget) : [...prev, widget]);
  }

  function getTypeBadge(type: string) {
    const types: {[key:string]: string} = {
      'deposit': 'Depósito',
      'withdraw': 'Saque',
      'transfer': 'Transferência',
      'payment': 'Pagamento',
      'investment': 'Investimento'
    };
    const typeCls: {[key:string]: string} = {
      'deposit': 'badge-deposit',
      'withdraw': 'badge-withdraw',
      'transfer': 'badge-transfer',
      'payment': 'badge-payment',
      'investment': 'badge-investment'
    };
    return <span className={`tx-type-badge ${typeCls[type] || 'badge-deposit'}`}>{types[type] || type}</span>;
  }

  return (
    <div>
      <div className="balance-hero">
        <div>
          <div className="balance-label">Saldo da conta</div>
          <div className="balance-amount">{formatCurrency(balance)}</div>
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
        <div className="ui-row" style={{ gap: '10px' }}>
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
            <div className="metric-value green">{formatCurrency(monthData.income)}</div>
            <div className="metric-change up">{transactions.filter((t: { type: string }) => t.type === 'deposit').length} transações</div>
          </div>
          <div className="metric-card red">
            <div className="metric-label">Despesas</div>
            <div className="metric-value red">{formatCurrency(monthData.expense)}</div>
            <div className="metric-change down">{transactions.filter((t: { type: string }) => t.type !== 'deposit').length} transações</div>
          </div>
          <div className="metric-card blue">
            <div className="metric-label">Transferências</div>
            <div className="metric-value blue">{transactions.filter((t: { type: string }) => t.type === 'transfer').length}</div>
            <div className="metric-change">Últimos 30 dias</div>
          </div>
        </div>
      )}

      <div className="ui-row" style={{ marginBottom: '24px' }}>
        {selectedWidgets.includes('goals') && (
          <div style={{ flex: 1 }}>
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
              {transactions.slice(0, 8).map((tx: { id: string | number; description?: string; desc?: string; note?: string; type: string; date: string; amount: number }) => (
                <tr key={tx.id}>
                  <td className="tx-desc">
                    {tx.description || tx.desc}
                    <small className="tx-date">{tx.note || '—'}</small>
                  </td>
                  <td>{getTypeBadge(tx.type)}</td>
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
