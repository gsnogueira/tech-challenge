import type { ShellNavItem, ShellUser } from './types';

interface ShellSidebarProps {
  navItems: ShellNavItem[];
  activePath: string;
  user?: ShellUser;
}

const defaultUser: ShellUser = {
  initials: 'G',
  name: 'Gabri',
  role: 'Usuario',
};

export function ShellSidebar({ navItems, activePath, user = defaultUser }: ShellSidebarProps) {
  return (
    <aside className="sh-sidebar" aria-label="Sidebar">
      <div className="sh-logo">
        <div className="sh-logo-icon" aria-hidden>
          F
        </div>
        <div>
          <div className="sh-logo-name">Finances</div>
          <div className="sh-logo-sub">Gestao Financeira</div>
        </div>
      </div>

      <nav className="sh-nav">
        <div className="sh-nav-label">Principal</div>
        {navItems.map((item) => {
          const isActive =
            activePath === item.href ||
            (item.href !== '/' && activePath.startsWith(item.href));

          return (
            <a
              key={item.href}
              href={item.href}
              className={`sh-nav-item ${isActive ? 'sh-nav-item-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="sh-sidebar-footer">
        <div className="sh-user-card">
          <div className="sh-user-avatar">{user.initials}</div>
          <div>
            <div>{user.name}</div>
            <div className="sh-logo-sub">{user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
