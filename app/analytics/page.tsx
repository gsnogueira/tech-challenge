import type { Metadata } from 'next';
import AnalyticsView from './AnalyticsView';

export const metadata: Metadata = {
  title: 'Análises | Finances',
  description: 'Dashboard financeiro com métricas, tendências e exportação do relatório.',
};

export const dynamic = 'force-static';

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
