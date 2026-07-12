"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTx } from "../context/TxContext";
import { getTransactionSuggestions, suggestTransactionType, validateTransactionDraft } from "../domain/transactions";
import type { TransactionAttachment, TransactionType } from "../interfaces/transactions";

const TRANSACTION_TYPES: TransactionType[] = ["deposit", "withdraw", "transfer", "payment", "investment"];

export default function TxModal(){
  const { isModalOpen, closeModal, addTransaction, updateTransaction, editingTx } = useTx();
  const [type, setType] = useState<TransactionType>("deposit");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | string>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState<TransactionAttachment[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const suggestedCategories = useMemo(() => getTransactionSuggestions(description), [description]);

  useEffect(()=>{
    if (editingTx) {
      setType(editingTx.type || "deposit");
      setDescription(editingTx.description || "");
      setAmount(editingTx.amount ?? 0);
      setDate(editingTx.date || new Date().toISOString().slice(0,10));
      setNote(editingTx.note || "");
      setAttachments(editingTx.attachments ?? []);
    } else {
      setType("deposit"); setDescription(""); setAmount(0); setDate(new Date().toISOString().slice(0,10)); setNote(""); setAttachments([]);
    }
  }, [editingTx]);

  useEffect(() => {
    const errors = validateTransactionDraft({ type, description, amount, date, note, attachments });
    setValidationErrors(errors);
  }, [type, description, amount, date, note, attachments]);

  async function handleAttachmentChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) return;

    const nextAttachments = await Promise.all(selectedFiles.map((file) => new Promise<TransactionAttachment>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        dataUrl: typeof reader.result === "string" ? reader.result : "",
      });
      reader.onerror = () => reject(new Error(`Não foi possível ler o arquivo ${file.name}`));
      reader.readAsDataURL(file);
    })));

    setAttachments((current) => [...current, ...nextAttachments]);
    event.target.value = "";
  }

  function handleSave(){
    const nextErrors = validateTransactionDraft({ type, description, amount, date, note, attachments });
    if (nextErrors.length > 0) {
      setValidationErrors(nextErrors);
      return;
    }

    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    const payload = { type, description, amount: Number(num), date, note, attachments };
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
              {TRANSACTION_TYPES.map((option) => (
                <div key={option} className={`type-opt ${option===type? 'selected-'+option:''}`} onClick={() => setType(option)}>
                  <span style={{fontSize:12,fontWeight:700}}>{option === 'deposit' ? 'Depósito' : option === 'withdraw'? 'Saque' : option === 'transfer'? 'Transferência' : option === 'payment'? 'Pagamento':'Investimento'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group full">
            <label>Descrição</label>
            <input
              value={description}
              onChange={(event) => {
                const nextDescription = event.target.value;
                setDescription(nextDescription);
                setType(suggestTransactionType(nextDescription));
              }}
              placeholder="Ex: Salário, Aluguel..."
            />
            {suggestedCategories.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {suggestedCategories.map((suggestion) => (
                  <button
                    key={suggestion.label}
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                    onClick={() => setType(suggestion.type)}
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            )}
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
          <div className="form-group full">
            <label>Anexos (recibo ou documento)</label>
            <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx" onChange={handleAttachmentChange} />
            {attachments.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {attachments.map((attachment, index) => (
                  <span key={`${attachment.name}-${index}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    borderRadius: '999px',
                    background: 'var(--c-surface)',
                    border: '1px solid var(--c-border)',
                    fontSize: '11px',
                    color: 'var(--c-text)',
                  }}>
                    📎 {attachment.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {validationErrors.length > 0 && (
          <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255, 90, 95, 0.08)', border: '1px solid rgba(255, 90, 95, 0.3)' }}>
            <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--c-red)' }}>Validação</strong>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              {validationErrors.map((error) => (
                <li key={error} style={{ color: 'var(--c-text)' }}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="form-footer">
          <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>{editingTx? 'Salvar alterações':'Adicionar'}</button>
        </div>
      </div>
    </div>
  );
}
