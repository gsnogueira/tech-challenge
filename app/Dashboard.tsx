"use client";
import { useEffect, useState } from 'react';

export default function Dashboard(){
  const [transactions, setTransactions] = useState<any[]>([]);
  useEffect(()=>{
    fetch('/transactions.json').then(r=>r.json()).then(d=> setTransactions(d)).catch(()=>{});
  },[]);

  const balance = transactions.reduce((s,t)=> s + Number(t.amount||0), 0);

  return (
    <div>
      <div className="balance-hero">
        <div>
          <div className="balance-label">Saldo da conta</div>
          <div className="balance-amount">{balance.toLocaleString(undefined,{style:'currency',currency:'USD'})}</div>
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
          <div className="metric-value green">{transactions.filter(t=>t.amount>0).reduce((s,t)=>s+Number(t.amount),0).toLocaleString(undefined,{style:'currency',currency:'USD'})}</div>
          <div className="metric-change up">+5% no último mês</div>
        </div>
        <div className="metric-card red">
          <div className="metric-label">Despesas</div>
          <div className="metric-value red">{transactions.filter(t=>t.amount<0).reduce((s,t)=>s+Number(t.amount),0).toLocaleString(undefined,{style:'currency',currency:'USD'})}</div>
          <div className="metric-change down">-2% no último mês</div>
        </div>
        <div className="metric-card blue">
          <div className="metric-label">Transferências</div>
          <div className="metric-value blue">{transactions.filter(t=>t.type==='transfer').length}</div>
          <div className="metric-change">Últimos 30 dias</div>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <div className="section-title">Últimas transações</div>
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
              {transactions.slice(0,8).map(tx=> (
                <tr key={tx.id}>
                  <td className="tx-desc">{tx.description}<small className="tx-date">{tx.date}</small></td>
                  <td><span className={`tx-type-badge badge-${tx.type==='deposit'? 'deposit': tx.type==='withdrawal'? 'withdraw':'transfer'}`}>{tx.type}</span></td>
                  <td className="tx-date">{tx.date}</td>
                  <td className={`tx-amount ${tx.amount<0? 'negative':'positive'}`}>{Number(tx.amount).toLocaleString(undefined,{style:'currency',currency:'USD'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
