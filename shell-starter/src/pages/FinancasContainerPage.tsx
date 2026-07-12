import { useMemo, useState } from 'react';

import { ShellSidebar } from '../components/ShellSidebar';
import { ShellTopbar } from '../components/ShellTopbar';
import { FINANCAS_EVENTS, dispatchShellEvent } from '../mf/remoteEvents';
import type { FinancasRemoteStatus } from '../mf/types';

interface FinancasContainerPageProps {
  remoteUrl: string;
  currentPath?: string;
}

export function FinancasContainerPage({
  remoteUrl,
  currentPath = '/financas',
}: FinancasContainerPageProps) {
  const [status, setStatus] = useState<FinancasRemoteStatus>('loading');

  const iframeSrc = useMemo(() => {
    const url = new URL(remoteUrl);
    url.searchParams.set('embed', '1');
    return url.toString();
  }, [remoteUrl]);

  return (
    <div className="sh-root">
      <ShellSidebar
        activePath={currentPath}
        navItems={[
          { href: '/', label: 'Dashboard' },
          { href: '/financas', label: 'Financas' },
        ]}
      />

      <div className="sh-main">
        <ShellTopbar
          title="Dashboard"
          subtitle="Visao geral das suas financas"
          transactionsHref="/financas/transactions"
          onCreateTransaction={() => {
            const frame = document.querySelector('iframe[data-financas-frame]') as HTMLIFrameElement | null;
            frame?.contentWindow?.postMessage({ type: 'financas:open_modal' }, '*');
          }}
        />

        <main className="sh-content">
          <iframe
            title="Modulo Financas"
            src={iframeSrc}
            data-financas-frame
            className="sh-module-frame"
            onLoad={() => {
              setStatus('loaded');
              dispatchShellEvent(FINANCAS_EVENTS.loaded, { url: iframeSrc });
            }}
            onError={() => {
              setStatus('error');
              dispatchShellEvent(FINANCAS_EVENTS.loadError, { url: iframeSrc });
            }}
          />

          {status === 'loading' && (
            <div className="sh-status">Carregando modulo de Financas...</div>
          )}

          {status === 'loaded' && (
            <div className="sh-status">Modulo carregado com sucesso.</div>
          )}

          {status === 'error' && (
            <div className="sh-status sh-status-error">
              Falha ao carregar modulo remoto.
              <button
                type="button"
                className="sh-btn sh-btn-ghost"
                style={{ marginLeft: '10px' }}
                onClick={() => {
                  dispatchShellEvent(FINANCAS_EVENTS.retry, { url: iframeSrc });
                  setStatus('loading');
                  const frame = document.querySelector('iframe[data-financas-frame]') as HTMLIFrameElement | null;
                  if (frame) frame.src = iframeSrc;
                }}
              >
                Tentar novamente
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
