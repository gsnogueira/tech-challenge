import { describe, expect, it } from 'vitest';

import {
  formatCurrency,
  formatDate,
  getBalance,
  getTransactionBadge,
  getTransactionLabel,
  getTransactionSuggestions,
  normalizeTransaction,
  suggestTransactionType,
  validateTransactionDraft,
} from './transactions';

describe('transactions domain', () => {
  it('normalizes legacy transaction input', () => {
    const transaction = normalizeTransaction({
      desc: 'Salario',
      value: 2500,
      type: 'deposit',
      note: 'Pagamento do mes',
    });

    expect(transaction).toMatchObject({
      type: 'deposit',
      description: 'Salario',
      amount: 2500,
      note: 'Pagamento do mes',
      attachments: [],
    });
    expect(transaction.id).toBeTypeOf('number');
  });

  it('suggests and labels transaction types from description', () => {
    expect(suggestTransactionType('Pagamento de aluguel')).toBe('payment');
    expect(getTransactionLabel('withdraw')).toBe('Saque');
    expect(getTransactionBadge('investment')).toBe('badge-investment');
  });

  it('returns suggestions from keywords', () => {
    const suggestions = getTransactionSuggestions('mercado mensal');

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({ type: 'payment', label: 'Despesa' });
  });

  it('validates transaction drafts with business rules', () => {
    const errors = validateTransactionDraft({
      description: 'ab',
      amount: -10,
      date: '2099-01-01',
      note: 'x'.repeat(141),
      attachments: new Array(6).fill({ name: 'a', type: 'text/plain', size: 1, dataUrl: 'data:' }),
    });

    expect(errors).toEqual([
      'A descrição deve ter pelo menos 3 caracteres.',
      'Informe um valor maior que zero.',
      'A data da transação não pode ser no futuro.',
      'A observação deve ter no máximo 140 caracteres.',
      'Você pode anexar até 5 arquivos por transação.',
    ]);
  });

  it('accepts valid drafts', () => {
    expect(
      validateTransactionDraft({
        description: 'Venda consultoria',
        amount: 1200,
        date: '2026-07-12',
        note: 'Contrato mensal',
        attachments: [],
      }),
    ).toEqual([]);
  });

  it('formats values and computes balance', () => {
    const transactions = [
      normalizeTransaction({ desc: 'Receita', value: 3000, type: 'deposit', date: '2026-07-10' }),
      normalizeTransaction({ desc: 'Aluguel', value: 1000, type: 'payment', date: '2026-07-11' }),
    ];

    expect(formatCurrency(1500)).toContain('R$');
    expect(formatDate('2026-07-12')).toBe('12/07/2026');
    expect(getBalance(transactions)).toBe(2000);
  });
});