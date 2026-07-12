export const FINANCAS_EVENTS = {
  loaded: 'financas:loaded',
  loadError: 'financas:load_error',
  retry: 'financas:retry',
} as const;

export function dispatchShellEvent(name: string, detail?: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}
