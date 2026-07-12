export interface FinancasRemoteProps {
  tenantId?: string;
  locale?: string;
  authToken?: string;
  onNavigate?: (path: string) => void;
}

export interface FinancasRemoteModule {
  mount: (element: HTMLElement, props?: FinancasRemoteProps) => void | Promise<void>;
  unmount: (element: HTMLElement) => void | Promise<void>;
}

export type FinancasRemoteStatus = 'idle' | 'loading' | 'loaded' | 'error';
