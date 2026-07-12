"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createTransaction, removeTransaction, updateTransactions } from "../application/transactions/transactionService";
import type { Transaction, TransactionDraft } from "../interfaces/transactions";
import { loadTransactions, persistTransactions } from "../infrastructure/transactions/transactionRepository";

type TxToast = { msg: string; type: "success" | "error" };
type TxContextValue = {
  transactions: Transaction[];
  addTransaction: (tx: TransactionDraft) => void;
  updateTransaction: (id: string | number, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string | number) => void;
  isModalOpen: boolean;
  openModal: (tx?: Transaction | null) => void;
  closeModal: () => void;
  editingTx: Transaction | null;
  setEditingTx: React.Dispatch<React.SetStateAction<Transaction | null>>;
  toast: TxToast | null;
};

const TxContext = createContext<TxContextValue | null>(null);

export function TxProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [toast, setToast] = useState<TxToast | null>(null);

  useEffect(() => {
    async function bootstrap() {
      const data = await loadTransactions();
      setTransactions(data);
    }
    bootstrap();
  }, []);

  useEffect(() => {
    persistTransactions(transactions);
  }, [transactions]);

  function showToast(msg: string, type: TxToast["type"] = "success") {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 3000);
  }

  function openModal(tx?: Transaction | null) {
    setEditingTx(tx ?? null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingTx(null);
  }

  function addTransaction(tx: TransactionDraft) {
    const newTx = createTransaction(tx);
    setTransactions((previous) => [newTx, ...previous]);
    showToast("Transação adicionada");
  }

  function updateTransaction(id: string | number, updates: Partial<Transaction>) {
    setTransactions((previous) => updateTransactions(previous, id, updates));
    showToast("Transação atualizada");
  }

  function deleteTransaction(id: string | number) {
    setTransactions((previous) => removeTransaction(previous, id));
    showToast("Transação excluída");
  }

  const value = useMemo<TxContextValue>(() => ({
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isModalOpen,
    openModal,
    closeModal,
    editingTx,
    setEditingTx,
    toast,
  }), [transactions, isModalOpen, editingTx, toast]);

  return <TxContext.Provider value={value}>{children}</TxContext.Provider>;
}

export function useTx() {
  const ctx = useContext(TxContext);
  if (!ctx) throw new Error("useTx must be used within TxProvider");
  return ctx;
}
