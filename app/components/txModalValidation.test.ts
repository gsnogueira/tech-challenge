import { describe, expect, it } from 'vitest';

import {
  canShowAttachments,
  getFieldErrorList,
  getTransactionModalHint,
  validateTxModalDraft,
} from './txModalValidation';

describe('tx modal validation helpers', () => {
  it('hides attachments for income and transfer types', () => {
    expect(canShowAttachments('deposit')).toBe(false);
    expect(canShowAttachments('transfer')).toBe(false);
    expect(canShowAttachments('payment')).toBe(true);
    expect(canShowAttachments('withdraw')).toBe(true);
  });

  it('returns contextual hints by transaction type', () => {
    expect(getTransactionModalHint('deposit')).toContain('Receitas');
    expect(getTransactionModalHint('transfer')).toContain('Transferências');
    expect(getTransactionModalHint('investment')).toContain('Investimentos');
  });

  it('validates only the relevant visible fields', () => {
    const errors = validateTxModalDraft({
      type: 'deposit',
      description: 'ab',
      amount: -10,
      date: '2099-01-01',
      note: 'x'.repeat(141),
      attachments: new Array(6).fill({ name: 'file.pdf', type: 'application/pdf', size: 1, dataUrl: 'data:' }),
    });

    expect(getFieldErrorList(errors)).toEqual([
      'A descrição deve ter pelo menos 3 caracteres.',
      'Informe um valor maior que zero.',
      'A data da transação não pode ser no futuro.',
      'A observação deve ter no máximo 140 caracteres.',
    ]);
    expect(errors.attachments).toBeUndefined();
  });

  it('validates attachments when the type supports them', () => {
    const errors = validateTxModalDraft({
      type: 'payment',
      description: 'Conta de energia',
      amount: 120,
      date: '2026-07-12',
      note: '',
      attachments: new Array(6).fill({ name: 'file.pdf', type: 'application/pdf', size: 1, dataUrl: 'data:' }),
    });

    expect(errors.attachments).toBe('Você pode anexar até 5 arquivos por transação.');
  });
});