import { type Transaction, type TransactionDraft, type TransactionFilters, formatCurrency, getBalance, normalizeTransaction } from '../../domain/transactions';

export function createTransaction(draft: TransactionDraft): Transaction {
  return normalizeTransaction(draft);
}

export function updateTransactions(list: Transaction[], id: string | number, updates: Partial<Transaction>): Transaction[] {
  return list.map((transaction) => (transaction.id === id ? normalizeTransaction({ ...transaction, ...updates }) : transaction));
}

export function removeTransaction(list: Transaction[], id: string | number): Transaction[] {
  return list.filter((transaction) => transaction.id !== id);
}

export function filterTransactions(list: Transaction[], filters: TransactionFilters): Transaction[] {
  const search = filters.search?.trim().toLowerCase() ?? '';

  return list.filter((transaction) => {
    const description = `${transaction.description} ${transaction.note ?? ''}`.toLowerCase();
    const matchesSearch = search.length === 0 || description.includes(search);
    const matchesType = !filters.type || transaction.type === filters.type;

    let matchesPeriod = true;
    if (filters.period) {
      const txDate = new Date(`${transaction.date}T00:00:00`);
      const now = new Date();
      if (filters.period === 'month') {
        matchesPeriod = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      }
      if (filters.period === '3months') {
        matchesPeriod = txDate >= new Date(now.getFullYear(), now.getMonth() - 2, 1);
      }
      if (filters.period === 'year') {
        matchesPeriod = txDate.getFullYear() === now.getFullYear();
      }
    }

    return matchesSearch && matchesType && matchesPeriod;
  }).sort((left, right) => new Date(`${right.date}T00:00:00`).getTime() - new Date(`${left.date}T00:00:00`).getTime());
}

export function buildDashboardSummary(list: Transaction[]) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const currentMonthTransactions = list.filter((transaction) => {
    const parsedDate = new Date(`${transaction.date}T00:00:00`);
    return parsedDate.getMonth() === thisMonth && parsedDate.getFullYear() === thisYear;
  });

  const income = currentMonthTransactions
    .filter((transaction) => transaction.type === 'deposit')
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  const expense = currentMonthTransactions
    .filter((transaction) => transaction.type !== 'deposit')
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  const transfersCount = currentMonthTransactions.filter((transaction) => transaction.type === 'transfer').length;

  return {
    balance: getBalance(list),
    income,
    expense,
    transfersCount,
    totalTransactions: currentMonthTransactions.length,
    formattedBalance: formatCurrency(getBalance(list)),
    formattedIncome: formatCurrency(income),
    formattedExpense: formatCurrency(expense),
  };
}
