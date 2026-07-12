# Instrucoes para construir a Shell SPA com Module Federation

## Objetivo
Criar um repositorio Shell SPA (Host) capaz de consumir o modulo de Financas como microfrontend.

## Estado atual do modulo de Financas (este repositorio)
- Build estatico habilitado em [next.config.ts](next.config.ts).
- Modo embutido habilitado em [app/layout.tsx](app/layout.tsx).
- Saida de build no diretorio [out](out).
- Rotas estaticas principais:
  - /
  - /transactions/
  - /analytics/
- Variaveis de ambiente suportadas:
  - NEXT_PUBLIC_EMBED_MODE=true: remove shell interna (sidebar/topbar) e deixa apenas conteudo funcional.
  - NEXT_PUBLIC_BASE_PATH=/algum-prefixo: ajusta base de publicacao sob subcaminho.

## Kit pronto para copiar na Shell
Este repositorio ja contem um starter completo para deixar a shell com layout parecido com o modulo atual.

- Guia do starter: [shell-starter/README.md](shell-starter/README.md)
- CSS de paridade visual: [shell-starter/src/styles/shell-theme.css](shell-starter/src/styles/shell-theme.css)
- Sidebar da shell: [shell-starter/src/components/ShellSidebar.tsx](shell-starter/src/components/ShellSidebar.tsx)
- Topbar da shell: [shell-starter/src/components/ShellTopbar.tsx](shell-starter/src/components/ShellTopbar.tsx)
- Container Fase 1 (iframe + fallback): [shell-starter/src/pages/FinancasContainerPage.tsx](shell-starter/src/pages/FinancasContainerPage.tsx)
- Eventos de observabilidade: [shell-starter/src/mf/remoteEvents.ts](shell-starter/src/mf/remoteEvents.ts)
- Tipos para contrato federado: [shell-starter/src/mf/types.ts](shell-starter/src/mf/types.ts)
- Loader para Fase 2 federada: [shell-starter/src/mf/loadFinancasRemote.ts](shell-starter/src/mf/loadFinancasRemote.ts)

Ordem recomendada de aplicacao na shell:
1. Copiar o conteudo de `shell-starter/src` para `src` no repositorio da shell.
2. Importar `styles/shell-theme.css` no bootstrap da shell.
3. Renderizar `FinancasContainerPage` na rota `/financas`.
4. Apontar `remoteUrl` para o dominio publicado do modulo de Financas.
5. Depois que a Fase 1 estiver estavel, substituir iframe por `loadFinancasRemote` usando o contrato mount/unmount.

## Recomendacao de arquitetura
- Shell (Host): roteamento, autenticacao, layout global, observabilidade e carregamento dos remotes.
- Financas (Remote): dominio financeiro, estado de transacoes e UI do modulo.
- Contrato de integracao:
  - Curto prazo: consumir build estatico do modulo.
  - Medio prazo: expor remote federado de montagem (mount/unmount) para composicao em runtime sem iframe.

## Plano em 2 fases para a Shell

### Fase 1 (imediata e estavel)
Objetivo: colocar a Shell no ar consumindo o modulo atual sem bloquear o roadmap.

1. Criar repositorio Shell (React + Vite ou React + Rspack).
2. Definir rota da shell para Financas (exemplo: /financas).
3. Publicar este app de Financas como estatico (conteudo de [out](out)) em um dominio dedicado.
4. Configurar deploy do modulo com:
   - NEXT_PUBLIC_EMBED_MODE=true
   - NEXT_PUBLIC_BASE_PATH alinhado com o caminho de publicacao
5. Na Shell, renderizar o modulo em um container dedicado.
6. Validar navegacao:
   - shell -> /financas
   - modulo -> /transactions/
   - modulo -> /analytics/
7. Validar comunicacao basica host/modulo:
   - evento de carregamento do modulo
   - evento de erro de carregamento

Resultado esperado da Fase 1:
- Shell operando com o modulo de Financas em producao de forma previsivel.

### Fase 2 (Module Federation completo)
Objetivo: evoluir para composicao em runtime via remote federado.

1. No repositorio de Financas, criar entrypoint de microfrontend com contrato:
   - mount(element, props)
   - unmount(element)
2. Empacotar esse entrypoint como remote federado.
3. Expor manifesto/remote entry em URL publica versionada.
4. Na Shell, registrar remote no Module Federation e lazy-load por rota.
5. Compartilhar dependencias singleton:
   - react
   - react-dom
6. Definir contrato de props entre host e remote:
   - tenantId
   - authToken (ou estrategia de autenticacao adotada)
   - locale
   - callbacks de navegacao
7. Definir fallback e retry no host para indisponibilidade do remote.
8. Medir e registrar:
   - tempo de carregamento do remote
   - taxa de falhas de carregamento

Resultado esperado da Fase 2:
- Shell compondo o modulo de Financas por Module Federation em runtime, com menor acoplamento de deploy.

## Requisitos de qualidade para a Shell
- Isolamento de estilos:
  - manter namespace de classes do host
  - evitar reset global agressivo na shell
- Resiliencia:
  - fallback visual quando remote falhar
  - retry com backoff para erro de rede
- Observabilidade:
  - logs de carregamento do remote
  - metrica de erro por rota federada
- Seguranca:
  - validar origem dos remotes
  - versionamento explicito das URLs dos remotes

## Checklist de validacao (usar na outra sessao)
- Shell sobe localmente com rota /financas.
- Modulo de Financas abre sem sidebar/topbar proprios em embed mode.
- Navegacao interna do modulo funciona com base path configurado.
- Build da Shell concluido sem warnings criticos.
- Build do modulo de Financas concluido e publicado.
- Fallback de erro de remote testado.
- React e React DOM compartilhados como singleton (quando Fase 2 estiver ativa).

## Informacoes para levar para a sessao da Shell
- Contexto tecnico confirmado neste repositorio:
  - [next.config.ts](next.config.ts)
  - [app/layout.tsx](app/layout.tsx)
  - [out](out)
- Decisao arquitetural:
  - adotar Module Federation
- Estrategia de entrega:
  - Fase 1 para entrega rapida e segura
  - Fase 2 para federacao completa em runtime

## Prompt sugerido para iniciar a outra sessao
Quero criar a Shell SPA host usando Module Federation para consumir o modulo de Financas. Siga o plano em duas fases deste documento, comecando pela Fase 1 e deixando os pontos de extensao preparados para a Fase 2. Gere estrutura de pastas, configuracao de build, rota /financas, fallback de erro e checklist de validacao automatizavel.
