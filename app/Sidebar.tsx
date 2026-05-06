"use client";
import Link from 'next/link';
import { useTx } from './context/TxContext';

export default function Sidebar(){
  const { openModal } = useTx();
  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="logo">
        <div className="logo-icon" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="#0d0f14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7l10-5 10 5-10 5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <div>
          <div className="logo-name">Finances</div>
          <div className="page-sub">Gestão Financeira</div>
        </div>
      </div>

      <nav>
        <div className="nav-section">
          <div className="nav-label">Principal</div>
          <div className="nav-item active"><Link href="/">Dashboard</Link></div>
          <div className="nav-item"><Link href="/transactions">Transações</Link></div>
          <div className="nav-item" onClick={() => openModal()} style={{cursor:'pointer'}}>Nova Transação</div>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">G</div>
          <div>
            <div className="user-name">Gabri</div>
            <div className="user-role">Usuário</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
