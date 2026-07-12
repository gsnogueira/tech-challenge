import type { FinancasRemoteModule } from './types';

declare global {
  interface Window {
    financesRemote?: {
      get: (module: string) => Promise<() => unknown>;
      init: (shareScope: unknown) => Promise<void>;
    };
    __webpack_init_sharing__?: (scope: string) => Promise<void>;
    __webpack_share_scopes__?: Record<string, unknown>;
  }
}

interface LoadRemoteOptions {
  remoteEntryUrl: string;
  scope?: string;
  module?: string;
}

export async function loadFinancasRemote({
  remoteEntryUrl,
  scope = 'financesRemote',
  module = './mount',
}: LoadRemoteOptions): Promise<FinancasRemoteModule> {
  await appendRemoteScript(remoteEntryUrl, scope);

  if (!window.financesRemote) {
    throw new Error('Remote container financesRemote nao foi encontrado no window.');
  }

  if (window.__webpack_init_sharing__) {
    await window.__webpack_init_sharing__('default');
  }

  if (window.financesRemote.init && window.__webpack_share_scopes__) {
    await window.financesRemote.init(window.__webpack_share_scopes__.default);
  }

  const factory = await window.financesRemote.get(module);
  const remote = factory() as FinancasRemoteModule;

  if (!remote.mount || !remote.unmount) {
    throw new Error('Remote carregado sem contrato mount/unmount valido.');
  }

  return remote;
}

async function appendRemoteScript(remoteEntryUrl: string, scope: string): Promise<void> {
  const existing = document.querySelector<HTMLScriptElement>(`script[data-remote-scope="${scope}"]`);
  if (existing) return;

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = remoteEntryUrl;
    script.type = 'text/javascript';
    script.async = true;
    script.dataset.remoteScope = scope;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Falha ao carregar remote entry: ${remoteEntryUrl}`));
    document.head.appendChild(script);
  });
}
