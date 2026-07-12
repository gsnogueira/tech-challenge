import { normalizeTransaction } from '../../domain/transactions';
import type { Transaction } from '../../interfaces/transactions';

const STORAGE_KEY = 'tx_data';

function readStoredTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];

  const data = window.localStorage.getItem(STORAGE_KEY);
  if (!data) return [];

  try {
    const parsed = JSON.parse(data) as Array<Partial<Transaction>>;
    return Array.isArray(parsed) ? parsed.map((transaction) => normalizeTransaction(transaction)) : [];
  } catch {
    return [];
  }
}

export async function loadTransactions(): Promise<Transaction[]> {
  const stored = readStoredTransactions();
  if (stored.length > 0) return stored;

  try {
    const response = await fetch('/transactions.json');
    const data = await response.json();
    const normalized = Array.isArray(data) ? data.map((transaction) => normalizeTransaction(transaction)) : [];

    persistTransactions(normalized);
    return normalized;
  } catch {
    return [];
  }
}

export function persistTransactions(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
