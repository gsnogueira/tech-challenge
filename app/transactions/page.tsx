import type { Metadata } from 'next';
import TransactionsView from './TransactionsView';

export const metadata: Metadata = {
  title: 'Transações | Finances',
  description: 'Lista e filtros de transações financeiras com carregamento otimizado.',
};

export const dynamic = 'force-static';

export default function TransactionsPage() {
  return <TransactionsView />;
}

