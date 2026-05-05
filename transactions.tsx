"use client";
import React from "react";
import Link from "next/link";

export default function TransactionsPage() {
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [editing, setEditing] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({ type: "deposit", description: "", amount: 0, date: new Date().toISOString().slice(0, 10) });

  React.useEffect(() => {
    fetch("/transactions.json").then(r => r.json()).then(d => setTransactions(d)).catch(() => { });
  }, []);

  function handleSave() {
    if (!formData.description || !formData.amount) return;
    if (editing) {
      setTransactions(prev => prev.map(t => t.id === editing.id ? { ...formData, id: editing.id } : t));
    } else {
      setTransactions(prev => [{ ...formData, id: String(Date.now()) }, ...prev]);
    }
    setShowModal(false);
    setEditing(null);
    setFormData({ type: "deposit", description: "", amount: 0, date: new Date().toISOString().slice(0, 10) });
  }

  function openEdit(tx: any) {
    setEditing(tx);
    setFormData(tx);
    setShowModal(true);
  }

  function handleDelete(id: string) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="container py-8">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="page-title">Transações</h2>
        <button onClick={() => { setEditing(null); setFormData({ type: "deposit", description: "", amount: 0, date: new Date().toISOString().slice(0, 10) }); setShowModal(true); }} className="btn btn-primary">+ Nova Transação</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Valor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="tx-desc">{tx.description}</td>
                <td><span className={`tx-type-badge badge-${tx.type === "deposit" ? "deposit" : tx.type === "withdrawal" ? "withdraw" : "transfer"}`}>{tx.type}</span></td>
                <td className="tx-date">{tx.date}</td>
                <td className={`tx-amount ${tx.amount < 0 ? "negative" : "positive"}`}>{Number(tx.amount).toLocaleString(undefined, { style: "currency", currency: "USD" })}</td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => openEdit(tx)} className="icon-btn icon-btn-edit" title="Editar">✎</button>
                    <button onClick={() => handleDelete(tx.id)} className="icon-btn icon-btn-del" title="Deletar">×</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editing ? "Editar Transação" : "Nova Transação"}</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">×</button>
            </div>
            <div className="form-grid">
              <div className="form-group full">
                <label>Tipo</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <option value="deposit">Depósito</option>
                  <option value="withdrawal">Retirada</option>
                  <option value="transfer">Transferência</option>
                </select>
              </div>
              <div className="form-group full">
                <label>Descrição</label>
                <input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Ex: Salário" />
              </div>
              <div className="form-group">
                <label>Valor</label>
                <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Data</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
            </div>
            <div className="form-footer">
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">Cancelar</button>
              <button onClick={handleSave} className="btn btn-primary">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
