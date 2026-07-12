export type TransactionType = 'deposit' | 'withdraw' | 'transfer' | 'payment' | 'investment';

export type TransactionAttachment = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

export type Transaction = {
  id: string | number;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  note?: string;
  attachments?: TransactionAttachment[];
};

export type TransactionDraft = Omit<Transaction, 'id'>;

export type TransactionFilters = {
  search?: string;
  type?: string;
  period?: 'month' | '3months' | 'year';
};

export type CategorySuggestion = {
  type: TransactionType;
  label: string;
  keywords: string[];
};

export const CATEGORY_SUGGESTIONS: CategorySuggestion[] = [
  {
    type: 'deposit',
    label: 'Receita',
    keywords: ['salario', 'bonus', 'renda', 'freelance', 'venda', 'premio', 'reembolso'],
  },
  {
    type: 'payment',
    label: 'Despesa',
    keywords: ['aluguel', 'mercado', 'supermercado', 'energia', 'internet', 'agua', 'cartao', 'assinatura', 'conta', 'luz', 'farmacia', 'transporte', 'combustivel'],
  },
  {
    type: 'transfer',
    label: 'Transferência',
    keywords: ['transferencia', 'ted', 'pix', 'doc', 'envio', 'transfer', 'pagamento entre'],
  },
  {
    type: 'investment',
    label: 'Investimento',
    keywords: ['investimento', 'acao', 'fundo', 'aplicacao', 'tesouro', 'bitcoin', 'carteira'],
  },
  {
    type: 'withdraw',
    label: 'Saque',
    keywords: ['saque', 'retirada', 'cash', 'dinheiro'],
  },
];

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  deposit: 'Depósito',
  withdraw: 'Saque',
  transfer: 'Transferência',
  payment: 'Pagamento',
  investment: 'Investimento',
};

export const TRANSACTION_TYPE_BADGES: Record<TransactionType, string> = {
  deposit: 'badge-deposit',
  withdraw: 'badge-withdraw',
  transfer: 'badge-transfer',
  payment: 'badge-payment',
  investment: 'badge-investment',
};

const NORMALIZED_TYPES: Record<string, TransactionType> = {
  deposit: 'deposit',
  withdraw: 'withdraw',
  withdrawal: 'withdraw',
  transfer: 'transfer',
  payment: 'payment',
  investment: 'investment',
};

export function normalizeTransaction(input: Partial<Transaction> & { desc?: string; value?: number; type?: string }): Transaction {
  const rawType = input.type ?? 'deposit';
  const normalizedType = NORMALIZED_TYPES[rawType] ?? 'deposit';
  const description = input.description ?? input.desc ?? 'Transação';
  const amount = typeof input.amount === 'number'
    ? input.amount
    : typeof input.value === 'number'
      ? input.value
      : 0;

  const attachments = Array.isArray(input.attachments)
    ? input.attachments.map((attachment) => ({
        name: attachment.name ?? 'arquivo',
        type: attachment.type ?? 'application/octet-stream',
        size: typeof attachment.size === 'number' ? attachment.size : 0,
        dataUrl: attachment.dataUrl ?? '',
      }))
    : [];

  return {
    id: input.id ?? Date.now(),
    type: normalizedType,
    description,
    amount,
    date: input.date ?? new Date().toISOString().slice(0, 10),
    note: input.note ?? '',
    attachments,
  };
}

export function getTransactionLabel(type: string): string {
  const normalizedType = NORMALIZED_TYPES[type] ?? 'deposit';
  return TRANSACTION_TYPE_LABELS[normalizedType];
}

export function getTransactionBadge(type: string): string {
  const normalizedType = NORMALIZED_TYPES[type] ?? 'deposit';
  return TRANSACTION_TYPE_BADGES[normalizedType];
}

export function suggestTransactionType(description: string): TransactionType {
  const normalizedDescription = description.trim().toLowerCase();
  if (!normalizedDescription) return 'deposit';

  const match = CATEGORY_SUGGESTIONS.find((suggestion) =>
    suggestion.keywords.some((keyword) => normalizedDescription.includes(keyword)),
  );

  return match?.type ?? 'deposit';
}

export function getTransactionSuggestions(description: string): CategorySuggestion[] {
  const normalizedDescription = description.trim().toLowerCase();
  if (!normalizedDescription) return CATEGORY_SUGGESTIONS.slice(0, 3);

  return CATEGORY_SUGGESTIONS.filter((suggestion) =>
    suggestion.keywords.some((keyword) => normalizedDescription.includes(keyword)),
  ).slice(0, 3);
}

export function validateTransactionDraft(draft: {
  type?: string;
  description?: string;
  amount?: number | string;
  date?: string;
  note?: string;
  attachments?: TransactionAttachment[];
}): string[] {
  const errors: string[] = [];
  const trimmedDescription = draft.description?.trim() ?? '';
  const normalizedAmount = typeof draft.amount === 'string' ? Number(draft.amount) : draft.amount;
  const parsedDate = draft.date ? new Date(`${draft.date}T00:00:00`) : null;

  if (!trimmedDescription) {
    errors.push('Informe uma descrição para a transação.');
  } else if (trimmedDescription.length < 3) {
    errors.push('A descrição deve ter pelo menos 3 caracteres.');
  }

  if (typeof normalizedAmount !== 'number' || Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
    errors.push('Informe um valor maior que zero.');
  } else if (normalizedAmount > 10000000) {
    errors.push('O valor máximo permitido por transação é R$ 10.000.000,00.');
  }

  if (draft.date && (!parsedDate || Number.isNaN(parsedDate.getTime()))) {
    errors.push('A data informada é inválida.');
  } else if (draft.date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate && parsedDate > today) {
      errors.push('A data da transação não pode ser no futuro.');
    }
  }

  if ((draft.note ?? '').trim().length > 140) {
    errors.push('A observação deve ter no máximo 140 caracteres.');
  }

  if ((draft.attachments?.length ?? 0) > 5) {
    errors.push('Você pode anexar até 5 arquivos por transação.');
  }

  return errors;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${date}T00:00:00`));
}

export function getBalance(transactions: Transaction[]): number {
  return transactions.reduce((sum, transaction) => {
    if (transaction.type === 'deposit') return sum + Math.abs(transaction.amount);
    return sum - Math.abs(transaction.amount);
  }, 0);
}
