"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { filterTransactions } from "../application/transactions/transactionService";
import { formatCurrency, formatDate, getTransactionBadge, getTransactionLabel } from "../domain/transactions";
import { useTx } from "../context/TxContext";

const PAGE_SIZE = 8;

export default function TransactionsView() {
  const { transactions, openModal, deleteTransaction } = useTx();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | number | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search, filterType, filterPeriod]);

  const filtered = useMemo(
    () => filterTransactions(transactions, {
      search,
      type: filterType,
      period: filterPeriod as "month" | "3months" | "year" | undefined,
    }),
    [transactions, search, filterType, filterPeriod],
  );

  const visibleTransactions = useMemo(
    () => filtered.slice(0, page * PAGE_SIZE),
    [filtered, page],
  );

  const hasMoreTransactions = visibleTransactions.length < filtered.length;

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMoreTransactions) return;

    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry?.isIntersecting) {
        setPage((current) => current + 1);
      }
    }, { rootMargin: "160px" });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMoreTransactions]);

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
            {visibleTransactions.map((tx) => (
              <tr key={tx.id}>
                <td className="tx-desc">
                  {tx.description}
                  <small>{tx.note ? tx.note : '—'}</small>
                  {tx.attachments?.length ? (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {tx.attachments.slice(0, 2).map((attachment, index) => (
                        <a
                          key={`${tx.id}-${attachment.name}-${index}`}
                          href={attachment.dataUrl}
                          download={attachment.name}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'var(--c-surface)',
                            border: '1px solid var(--c-border)',
                            borderRadius: '999px',
                            padding: '4px 8px',
                            color: 'var(--c-text)',
                            fontSize: '11px',
                            textDecoration: 'none',
                          }}
                        >
                          📎 {attachment.name}
                        </a>
                      ))}
                      {tx.attachments.length > 2 && (
                        <span style={{ fontSize: '11px', color: 'var(--c-muted)' }}>+{tx.attachments.length - 2} anexos</span>
                      )}
                    </div>
                  ) : null}
                </td>
                <td><span className={`tx-type-badge ${getTransactionBadge(tx.type)}`}>{getTransactionLabel(tx.type)}</span></td>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', gap: '12px' }}>
        <span style={{ color: 'var(--c-muted)', fontSize: '13px' }}>
          Mostrando {visibleTransactions.length} de {filtered.length} transações
        </span>
        {hasMoreTransactions && (
          <button className="btn btn-ghost" onClick={() => setPage((current) => current + 1)}>
            Carregar mais
          </button>
        )}
      </div>

      <div ref={loadMoreRef} style={{ height: '1px' }} />

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
