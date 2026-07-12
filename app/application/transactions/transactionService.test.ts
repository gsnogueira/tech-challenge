import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildDashboardSummary,
  createTransaction,
  filterTransactions,
  removeTransaction,
  updateTransactions,
} from './transactionService';

import type { Transaction } from '../../interfaces/transactions';

const transactions: Transaction[] = [
  { id: 1, type: 'deposit', description: 'Salario', amount: 5000, date: '2026-07-01', note: 'mes', attachments: [] },
  { id: 2, type: 'payment', description: 'Aluguel', amount: 1500, date: '2026-07-05', note: 'casa', attachments: [] },
  { id: 3, type: 'transfer', description: 'Pix reserva', amount: 300, date: '2026-06-20', note: 'poupanca', attachments: [] },
];

afterEach(() => {
  vi.useRealTimers();
});

describe('transaction service', () => {
  it('creates transactions from draft data', () => {
    const transaction = createTransaction({
      type: 'deposit',
      description: 'Venda',
      amount: 900,
      date: '2026-07-12',
      note: '',
      attachments: [],
    });

    expect(transaction).toMatchObject({
      type: 'deposit',
      description: 'Venda',
      amount: 900,
      date: '2026-07-12',
    });
  });

  it('updates a transaction by id', () => {
    const updated = updateTransactions(transactions, 2, {
      description: 'Aluguel ajustado',
      amount: 1600,
    });

    expect(updated[1]).toMatchObject({
      id: 2,
      description: 'Aluguel ajustado',
      amount: 1600,
      type: 'payment',
    });
  });

  it('removes transactions by id', () => {
    expect(removeTransaction(transactions, 3)).toHaveLength(2);
  });

  it('filters by search, type and period while sorting by newest first', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-12T12:00:00Z'));

    const filtered = filterTransactions(
      [
        { id: 1, type: 'deposit', description: 'Salario julho', amount: 5000, date: '2026-07-01', note: '', attachments: [] },
        { id: 2, type: 'payment', description: 'Aluguel', amount: 1500, date: '2026-07-05', note: '', attachments: [] },
        { id: 3, type: 'payment', description: 'Aluguel antigo', amount: 1200, date: '2026-06-10', note: '', attachments: [] },
      ],
      { search: 'aluguel', type: 'payment', period: 'month' },
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(2);
  });

  it('builds a dashboard summary for the current month', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-12T12:00:00Z'));

    const summary = buildDashboardSummary(transactions);

    expect(summary).toMatchObject({
      balance: 3200,
      income: 5000,
      expense: 1500,
      transfersCount: 0,
      totalTransactions: 2,
    });
    expect(summary.formattedBalance).toContain('R$');
    expect(summary.formattedIncome).toContain('R$');
    expect(summary.formattedExpense).toContain('R$');
  });
});