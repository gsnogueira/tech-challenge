"use client";

import React, { useEffect, useState } from "react";
import { useTx } from "../context/TxContext";

export default function TxModal(){
  const { isModalOpen, closeModal, addTransaction, updateTransaction, editingTx } = useTx();
  const [type, setType] = useState<string>("deposit");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | string>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [note, setNote] = useState("");

  useEffect(()=>{
    if (editingTx) {
      setType(editingTx.type || "deposit");
      setDescription(editingTx.description || editingTx.desc || "");
      setAmount(editingTx.amount ?? (editingTx.value ?? 0));
      setDate(editingTx.date || new Date().toISOString().slice(0,10));
      setNote(editingTx.note || "");
    } else {
      setType("deposit"); setDescription(""); setAmount(0); setDate(new Date().toISOString().slice(0,10)); setNote("");
    }
  }, [editingTx]);

  function handleSave(){
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (!description || isNaN(Number(num)) || num <= 0) return;
    const payload = { type, description, amount: Number(num), date, note };
    if (editingTx) updateTransaction(editingTx.id, payload);
    else addTransaction(payload);
    closeModal();
  }

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{editingTx? 'Editar Transação':'Nova Transação'}</h3>
          <button onClick={closeModal} className="modal-close">×</button>
        </div>
        <div className="form-grid">
          <div className="form-group full">
            <label>Tipo de transação</label>
            <div className="type-grid">
              {['deposit','withdraw','transfer','payment','investment'].map(t=> (
                <div key={t} className={`type-opt ${t===type? 'selected-'+t:''}`} onClick={()=>setType(t)}>
                  <span style={{fontSize:12,fontWeight:700}}>{t === 'deposit' ? 'Depósito' : t === 'withdraw'? 'Saque' : t === 'transfer'? 'Transferência' : t === 'payment'? 'Pagamento':'Investimento'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group full">
            <label>Descrição</label>
            <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Ex: Salário, Aluguel..." />
          </div>
          <div className="form-group">
            <label>Valor</label>
            <input type="number" step="0.01" value={amount as any} onChange={e=>setAmount(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Data</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div className="form-group full">
            <label>Observação (opcional)</label>
            <input value={note} onChange={e=>setNote(e.target.value)} />
          </div>
        </div>
        <div className="form-footer">
          <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>{editingTx? 'Salvar alterações':'Adicionar'}</button>
        </div>
      </div>
    </div>
  );
}
