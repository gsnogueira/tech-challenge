interface ShellTopbarProps {
  title: string;
  subtitle: string;
  transactionsHref: string;
  onCreateTransaction?: () => void;
}

export function ShellTopbar({
  title,
  subtitle,
  transactionsHref,
  onCreateTransaction,
}: ShellTopbarProps) {
  return (
    <header className="sh-topbar">
      <div className="sh-topbar-inner">
        <div>
          <div className="sh-page-title">{title}</div>
          <div className="sh-page-sub">{subtitle}</div>
        </div>
        <div className="sh-actions">
          <a className="sh-btn sh-btn-ghost" href={transactionsHref}>
            Ver transacoes
          </a>
          <button
            type="button"
            className="sh-btn sh-btn-primary"
            onClick={onCreateTransaction}
          >
            + Nova transacao
          </button>
        </div>
      </div>
    </header>
  );
}
