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
