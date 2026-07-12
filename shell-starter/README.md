# Shell Starter para paridade visual

Este pacote local contem um starter copiavel para seu repositorio shell-host, mantendo visual parecido com o modulo atual de Financas.

## Conteudo
- src/styles/shell-theme.css: tokens visuais e layout shell (sidebar, topbar, content).
- src/components/ShellSidebar.tsx: navegacao lateral.
- src/components/ShellTopbar.tsx: cabecalho superior.
- src/pages/FinancasContainerPage.tsx: container para consumo do modulo em Fase 1.
- src/mf/types.ts: contrato tipado para fase federada.
- src/mf/remoteEvents.ts: eventos de observabilidade.

## Como aplicar na shell
1. Copie a pasta src para o repositorio shell-host.
2. Importe src/styles/shell-theme.css no bootstrap da shell.
3. Renderize FinancasContainerPage na rota /financas.
4. Passe a URL publica do modulo em remoteUrl.

Exemplo de uso:

```tsx
import './styles/shell-theme.css';
import { FinancasContainerPage } from './pages/FinancasContainerPage';

export function App() {
  return (
    <FinancasContainerPage remoteUrl="https://seu-dominio-financas.com/" currentPath="/financas" />
  );
}
```

## Modo embed no modulo de Financas
No deploy do modulo remoto (este repositorio), configure:
- NEXT_PUBLIC_EMBED_MODE=true
- NEXT_PUBLIC_BASE_PATH conforme seu caminho de publicacao

## Evolucao para Fase 2
Quando migrar para Module Federation runtime, mantenha:
- ShellSidebar
- ShellTopbar
- shell-theme.css

Troque apenas o consumo do iframe por:
- loadFinancasRemote()
- remote.mount(element, props)
- remote.unmount(element)

Os tipos em src/mf/types.ts ja deixam o contrato pronto.
