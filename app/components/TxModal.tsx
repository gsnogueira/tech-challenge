"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTx } from "../context/TxContext";
import { getTransactionSuggestions, suggestTransactionType, validateTransactionDraft } from "../domain/transactions";
import type { TransactionAttachment, TransactionType } from "../interfaces/transactions";
import { canShowAttachments, getFieldErrorList, getTransactionModalHint, hasVisibleFieldError, validateTxModalDraft, type TxModalDraft, type TxModalField } from './txModalValidation';

const TRANSACTION_TYPES: TransactionType[] = ["deposit", "withdraw", "transfer", "payment", "investment"];

export default function TxModal(){
  const { isModalOpen, closeModal, addTransaction, updateTransaction, editingTx } = useTx();
  const [type, setType] = useState<TransactionType>("deposit");
  const [activeSection, setActiveSection] = useState<'basic' | 'details' | 'attachments'>('basic');
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | string>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState<TransactionAttachment[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<TxModalField, boolean>>({
    description: false,
    amount: false,
    date: false,
    note: false,
    attachments: false,
  });

  const suggestedCategories = useMemo(() => getTransactionSuggestions(description), [description]);

  const attachmentsVisible = canShowAttachments(type);

  const draft: TxModalDraft = useMemo(() => ({
    type,
    description,
    amount,
    date,
    note,
    attachments: attachmentsVisible ? attachments : [],
  }), [type, description, amount, date, note, attachments, attachmentsVisible]);

  const fieldErrors = useMemo(() => validateTxModalDraft(draft), [draft]);
  const validationErrors = useMemo(() => getFieldErrorList(fieldErrors), [fieldErrors]);

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
    setSubmitted(false);
    setTouched({
      description: false,
      amount: false,
      date: false,
      note: false,
      attachments: false,
    });
    setActiveSection('basic');
  }, [editingTx]);

  useEffect(() => {
    if (!attachmentsVisible && attachments.length > 0) {
      setAttachments([]);
    }
  }, [attachmentsVisible, attachments.length]);

  function markTouched(field: TxModalField) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function shouldShowFieldError(field: TxModalField) {
    return submitted || touched[field];
  }

  function updateType(nextType: TransactionType) {
    setType(nextType);
    if (!canShowAttachments(nextType)) {
      setAttachments([]);
      setTouched((current) => ({ ...current, attachments: false }));
      if (activeSection === 'attachments') {
        setActiveSection('details');
      }
    }
    markTouched('description');
  }

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
    markTouched('attachments');
    event.target.value = "";
  }

  function handleSave(){
    setSubmitted(true);
    const nextErrors = validateTransactionDraft(draft);
    if (nextErrors.length > 0) {
      return;
    }

    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    const payload = { type, description, amount: Number(num), date, note, attachments: attachmentsVisible ? attachments : [] };
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

        <div style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(77,159,255,0.08)', border: '1px solid rgba(77,159,255,0.22)', color: 'var(--c-text)' }}>
          <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--c-blue)' }}>
            {type === 'deposit' ? 'Receita' : type === 'withdraw' ? 'Saque' : type === 'transfer' ? 'Transferência' : type === 'payment' ? 'Pagamento' : 'Investimento'}
          </strong>
          <span style={{ fontSize: '13px', color: 'var(--c-muted)' }}>{getTransactionModalHint(type)}</span>
        </div>

        {submitted && validationErrors.length > 0 && (
          <div role="alert" style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(255, 90, 95, 0.08)', border: '1px solid rgba(255, 90, 95, 0.28)' }}>
            <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--c-red)' }}>Revise os campos destacados</strong>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'grid', gap: '4px' }}>
              {validationErrors.slice(0, 4).map((error) => (
                <li key={error} style={{ color: 'var(--c-text)', fontSize: '13px' }}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {[
            { id: 'basic', label: 'Básico' },
            { id: 'details', label: 'Detalhes' },
            { id: 'attachments', label: 'Anexos', hidden: !attachmentsVisible },
          ].filter((section) => !('hidden' in section && section.hidden)).map((section) => (
            <button
              key={section.id}
              type="button"
              className={`btn ${activeSection === section.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '7px 12px', fontSize: '12px' }}
              onClick={() => setActiveSection(section.id as 'basic' | 'details' | 'attachments')}
            >
              {section.label}
            </button>
          ))}
        </div>

        {activeSection === 'basic' && (
          <div className="form-grid">
            <div className="form-group full">
              <label>Tipo de transação</label>
              <div className="type-grid">
                {TRANSACTION_TYPES.map((option) => (
                  <div key={option} className={`type-opt ${option===type? 'selected-'+option:''}`} onClick={() => updateType(option)}>
                    <span style={{fontSize:12,fontWeight:700}}>{option === 'deposit' ? 'Depósito' : option === 'withdraw'? 'Saque' : option === 'transfer'? 'Transferência' : option === 'payment'? 'Pagamento':'Investimento'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group full">
              <label>Descrição</label>
              <input
                value={description}
                onBlur={() => markTouched('description')}
                onChange={(event) => {
                  const nextDescription = event.target.value;
                  setDescription(nextDescription);
                  setType(suggestTransactionType(nextDescription));
                }}
                placeholder="Ex: Salário, Aluguel..."
                aria-invalid={shouldShowFieldError('description') && hasVisibleFieldError(fieldErrors, 'description')}
              />
              {shouldShowFieldError('description') && fieldErrors.description && (
                <small style={{ color: 'var(--c-red)', marginTop: '6px' }}>{fieldErrors.description}</small>
              )}
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
              <input
                type="number"
                step="0.01"
                value={amount as any}
                onBlur={() => markTouched('amount')}
                onChange={e=>setAmount(e.target.value)}
                aria-invalid={shouldShowFieldError('amount') && hasVisibleFieldError(fieldErrors, 'amount')}
              />
              {shouldShowFieldError('amount') && fieldErrors.amount && (
                <small style={{ color: 'var(--c-red)', marginTop: '6px' }}>{fieldErrors.amount}</small>
              )}
            </div>
            <div className="form-group">
              <label>Data</label>
              <input
                type="date"
                value={date}
                onBlur={() => markTouched('date')}
                onChange={e=>setDate(e.target.value)}
                aria-invalid={shouldShowFieldError('date') && hasVisibleFieldError(fieldErrors, 'date')}
              />
              {shouldShowFieldError('date') && fieldErrors.date && (
                <small style={{ color: 'var(--c-red)', marginTop: '6px' }}>{fieldErrors.date}</small>
              )}
            </div>
          </div>
        )}

        {activeSection === 'details' && (
          <div className="form-grid">
            <div className="form-group full">
              <label>Observação (opcional)</label>
              <textarea
                value={note}
                rows={5}
                onBlur={() => markTouched('note')}
                onChange={e=>setNote(e.target.value)}
                aria-invalid={shouldShowFieldError('note') && hasVisibleFieldError(fieldErrors, 'note')}
                style={{ resize: 'vertical', minHeight: '160px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '6px' }}>
                {shouldShowFieldError('note') && fieldErrors.note ? (
                  <small style={{ color: 'var(--c-red)' }}>{fieldErrors.note}</small>
                ) : (
                  <small style={{ color: 'var(--c-muted)' }}>Opcional. Use para contexto adicional.</small>
                )}
                <small style={{ color: 'var(--c-muted)' }}>{note.length}/140</small>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'attachments' && attachmentsVisible && (
          <div className="form-grid">
            <div className="form-group full">
              <label>Anexos (recibo ou documento)</label>
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                onBlur={() => markTouched('attachments')}
                onChange={handleAttachmentChange}
              />
              {shouldShowFieldError('attachments') && fieldErrors.attachments && (
                <small style={{ color: 'var(--c-red)', marginTop: '6px' }}>{fieldErrors.attachments}</small>
              )}
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
        )}

        {activeSection === 'attachments' && !attachmentsVisible && (
          <div className="form-group full">
            <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--c-border)', color: 'var(--c-muted)', fontSize: '13px' }}>
              Anexos ficam disponíveis apenas para saque, pagamento e investimento.
            </div>
          </div>
        )}
        <div className="form-footer">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setActiveSection((current) => current === 'basic' ? 'basic' : current === 'details' ? 'basic' : 'details')}
            >
              Voltar
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setActiveSection((current) => {
                if (current === 'basic') return 'details';
                if (current === 'details') return attachmentsVisible ? 'attachments' : 'details';
                return 'basic';
              })}
            >
              Próxima etapa
            </button>
          </div>
          <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>{editingTx? 'Salvar alterações':'Adicionar'}</button>
        </div>
      </div>
    </div>
  );
}
