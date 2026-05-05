"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="topbar">
      <div className="logo">
        <div className="logo-icon" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12l4-4 8 8" stroke="#072" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <div className="logo-name">Finances</div>
          <div className="page-sub">Gestão Financeira</div>
        </div>
      </div>

      <div className="topbar-actions">
        <nav className="flex items-center gap-4">
          <Link className="nav-link" href="/">Home</Link>
          <Link className="nav-link" href="/transactions">Transações</Link>
        </nav>
        <button className="btn btn-primary">Nova</button>
      </div>
    </header>
  );
}
