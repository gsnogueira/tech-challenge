"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTx } from './context/TxContext';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12.5L12 4l9 8.5" />
        <path d="M5 10.5V20h14v-9.5" />
      </svg>
    ),
  },
  {
    href: '/transactions',
    label: 'Transações',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 2v4M17 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    href: '/analytics',
    label: 'Análises',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19h16" />
        <path d="M7 16V9" />
        <path d="M12 16V5" />
        <path d="M17 16v-4" />
      </svg>
    ),
  },
];

export default function Sidebar(){
  const { openModal } = useTx();
  const currentPath = usePathname();

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
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
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
