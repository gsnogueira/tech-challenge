"use client";
import Link from 'next/link';

export default function Sidebar(){
  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="logo">
        <div className="logo-icon" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12l4-4 8 8" stroke="#072" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
