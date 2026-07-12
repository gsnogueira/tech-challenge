import type { Metadata } from 'next';
import Dashboard from './Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard | Finances',
  description: 'Painel financeiro com resumo, metas e alertas.',
};

export const dynamic = 'force-static';

export default function Home() {
  return (
    <div>
      <main className="container py-8">
        <Dashboard />
      </main>
    </div>
  );
}
