"use client";
import React, { useState } from "react";
import { useTx } from "../context/TxContext";

export default function TransactionsPage() {
  const { transactions, openModal, deleteTransaction } = useTx();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("");
  const [deleting, setDeleting] = useState<string | number | null>(null);

  const filtered = transactions.filter(tx => {
    const matchSearch = search === "" || 
      (tx.description || tx.desc || "").toLowerCase().includes(search.toLowerCase()) ||
      (tx.note || "").toLowerCase().includes(search.toLowerCase());
    
    const matchType = filterType === "" || tx.type === filterType;
    
    let matchPeriod = true;
    if (filterPeriod) {
      const txDate = new Date(tx.date);
      const now = new Date();
      if (filterPeriod === "month") matchPeriod = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      else if (filterPeriod === "3months") matchPeriod = txDate >= new Date(now.getFullYear(), now.getMonth() - 2, 1);
      else if (filterPeriod === "year") matchPeriod = txDate.getFullYear() === now.getFullYear();
    }
    
    return matchSearch && matchType && matchPeriod;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    <div className="container py-8">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="page-title">Transações</h2>
        <button onClick={() => openModal()} className="btn btn-primary">+ Nova Transação</button>
      </div>

      <div className="filter-bar">
        <input 
          type="text" 
          placeholder="🔍  Buscar transações..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)', flex: 1, minWidth: '200px' }}
        />
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
          style={{ background: 'var(--c-surface)' }}
        >
          <option value="">Todos os tipos</option>
          <option value="deposit">Depósito</option>
          <option value="withdraw">Saque</option>
          <option value="transfer">Transferência</option>
          <option value="payment">Pagamento</option>
          <option value="investment">Investimento</option>
        </select>
        <select 
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="filter-select"
          style={{ background: 'var(--c-surface)' }}
        >
          <option value="">Todo período</option>
          <option value="month">Este mês</option>
          <option value="3months">Últimos 3 meses</option>
          <option value="year">Este ano</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id}>
                <td className="tx-desc">{tx.description || tx.desc}<small>{tx.note ? tx.note : '—'}</small></td>
                <td>{getTypeBadge(tx.type)}</td>
                <td className="tx-date">{formatDate(tx.date)}</td>
                <td className={`tx-amount ${tx.amount < 0 ? "negative" : "positive"}`}>
                  {tx.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(tx.amount))}
                </td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => openModal(tx)} className="icon-btn icon-btn-edit" title="Editar">✎</button>
                    <button onClick={() => setDeleting(tx.id)} className="icon-btn icon-btn-del" title="Deletar">×</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <p>Nenhuma transação encontrada</p>
        </div>
      )}

      {deleting !== null && (
        <div className="modal-overlay open">
          <div className="confirm-box">
            <div className="confirm-icon" style={{ background: 'var(--c-red-dim)' }}>×</div>
            <div className="confirm-title">Excluir transação?</div>
            <div className="confirm-desc">Esta ação não pode ser desfeita.</div>
            <div className="confirm-actions">
              <button className="btn btn-ghost" onClick={() => setDeleting(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => { deleteTransaction(deleting); setDeleting(null); }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

