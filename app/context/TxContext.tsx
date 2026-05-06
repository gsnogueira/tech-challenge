"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Tx = { id: string | number; type: string; description?: string; amount: number; date: string; note?: string };

const TxContext = createContext<any>(null);

export function TxProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Tx | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("tx_data");
    if (data) {
      try { setTransactions(JSON.parse(data)); } catch { setTransactions([]); }
    } else {
      fetch("/transactions.json").then(r => r.json()).then(d => {
        const normalized = Array.isArray(d) ? d.map((it:any) => ({ ...it, amount: it.amount ?? it.value ?? 0 })) : [];
        setTransactions(normalized);
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem("tx_data", JSON.stringify(transactions)); } catch {}
  }, [transactions]);

  function openModal(tx?: Tx | null) { if (tx) setEditingTx(tx); else setEditingTx(null); setIsModalOpen(true); }
  function closeModal() { setIsModalOpen(false); setEditingTx(null); }

  function addTransaction(tx: Omit<Tx, "id">) {
    const id = Date.now();
    const newTx: Tx = { ...tx, id } as Tx;
    setTransactions(prev => [newTx, ...prev]);
    showToast("Transação adicionada", "success");
  }

  function updateTransaction(id: string | number, updates: Partial<Tx>) {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast("Transação atualizada", "success");
  }

  function deleteTransaction(id: string | number) {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast("Transação excluída", "success");
  }

  function showToast(msg: string, type: string = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <TxContext.Provider value={{ transactions, addTransaction, updateTransaction, deleteTransaction, isModalOpen, openModal, closeModal, editingTx, setEditingTx, toast }}>
      {children}
    </TxContext.Provider>
  );
}

export function useTx() { const ctx = useContext(TxContext); if (!ctx) throw new Error("useTx must be used within TxProvider"); return ctx; }
