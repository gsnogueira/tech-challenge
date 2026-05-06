"use client";
import { useEffect, useState } from 'react';
import { useTx } from './context/TxContext';

export default function Dashboard(){
  const { transactions, openModal } = useTx();
  const [monthData, setMonthData] = useState({ income: 0, expense: 0, invest: 0, total: 0 });

  useEffect(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const monthly = transactions.filter(t => {
      const [y, m] = t.date.split('-').map(Number);
      return m - 1 === thisMonth && y === thisYear;
    });

    const income = monthly.filter(t => t.type === 'deposit').reduce((s, t) => s + Math.abs(t.amount), 0);
    const expense = monthly.filter(t => t.type !== 'deposit').reduce((s, t) => s + Math.abs(t.amount), 0);
    const invest = monthly.filter(t => t.type === 'investment').reduce((s, t) => s + Math.abs(t.amount), 0);

    setMonthData({ income, expense, invest, total: monthly.length });
  }, [transactions]);

  const balance = transactions.reduce((s, t) => {
    if (t.type === 'deposit') return s + Math.abs(t.amount);
    return s - Math.abs(t.amount);
  }, 0);

  function formatCurrency(val: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date + 'T00:00:00'));
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

      <div className="cards-grid">
        <div className="metric-card green">
          <div className="metric-label">Receitas</div>
          <div className="metric-value green">{formatCurrency(monthData.income)}</div>
          <div className="metric-change up">{transactions.filter(t => t.type === 'deposit').length} transações</div>
        </div>
        <div className="metric-card red">
          <div className="metric-label">Despesas</div>
          <div className="metric-value red">{formatCurrency(monthData.expense)}</div>
          <div className="metric-change down">{transactions.filter(t => t.type !== 'deposit').length} transações</div>
        </div>
        <div className="metric-card blue">
          <div className="metric-label">Transferências</div>
          <div className="metric-value blue">{transactions.filter(t => t.type === 'transfer').length}</div>
          <div className="metric-change">Últimos 30 dias</div>
        </div>
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
              {transactions.slice(0, 8).map(tx => (
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
