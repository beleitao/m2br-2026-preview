# Orientacoes de Ajuste — Site M2BR 2026
**Ref:** https://2026.m2br.com/
**Data:** 2026-04-01 (revisao 2)
**Para:** Agente Cursor

---

## STATUS ATUAL: SITE QUEBRADO

O site em producao apresenta problemas graves de renderizacao. Em testes com headless Chrome e capturas de tela reais, o resultado e:

- **Nav** renderiza corretamente (logo M2BR, menu, toggle tema, Contato, WhatsApp)
- **Hero** aparece deslocado (~7000px abaixo do topo) em vez de estar logo apos o nav
- **Todo o conteudo abaixo do hero (cases, clientes, servicos, sobre, equipe, footer) NAO renderiza** — telas em branco
- **Animacao de particulas/constelacao** e a unica coisa visivel em 90% da pagina — pontos vermelhos e linhas cinza sobre fundo branco vazio
- O site esta em **light mode** por padrao

**Conclusao:** O JS que monta/posiciona as secoes esta falhando. O site funciona parcialmente no browser real (com interacao do usuario) mas falha catastroficamente em renderizacao estatica, bots, SEO crawlers e compartilhamento social.

---

## P0 — CRITICOS (site nao funciona sem esses fixes)

### 1. Conteudo nao renderiza — secoes invisiveis
Todas as secoes abaixo do hero (cases, clientes, servicos, sobre, equipe, footer) aparecem como telas brancas vazias.
**Causa provavel:** As secoes dependem de scroll-triggered animations (IntersectionObserver ou similar) que nunca disparam, OU o layout esta usando posicao absoluta/fixed com calculo JS que falha.
**Acao:**
- Garantir que TODAS as secoes tem conteudo visivel sem depender de JS
- Se usar reveal-on-scroll, o estado initial deve ser `opacity: 1` com fallback. Animacoes devem ser progressivas, nao obstrutivas
- Testar com JS desabilitado — o conteudo base deve aparecer

### 2. Hero deslocado ~7000px abaixo do nav
O hero com texto "Somos uma agencia digital raiz..." aparece a ~7000px de scroll do topo. Entre o nav e o hero, ha so tela branca com particulas.
**Causa provavel:** A animacao de particulas/constelacao tem um canvas ou container com height excessivo empurrando o conteudo pra baixo. Ou o hero tem `position: absolute` com `top` calculado errado.
**Acao:**
- Verificar o container da animacao de particulas — garantir que nao tem `height: 100vh` multiplicado ou `position: relative` gerando espaco
- O hero DEVE estar logo apos o nav, sem espaco vazio
- Considerar mover particulas para background do hero, nao como secao separada

### 3. Rotas com anchor (#) retornam 404
As URLs `https://2026.m2br.com/#cases`, `/#servicos`, `/#equipe` retornam HTTP 404.
**Acao:** Configurar SPA fallback no servidor — todas as rotas devem servir `index.html`.

### 4. Imagens placeholder no codigo
Referencias a `/assets-temp/tutu-placeholder.svg` e `/assets-temp/banner-placeholder.svg` em producao.
**Acao:** Substituir por imagens reais.

---

## P1 — ALTO IMPACTO (afeta UX e credibilidade)

### 5. Animacao de particulas domina a pagina
A animacao de constelacao/particulas (pontos vermelhos + linhas cinza conectando) e o elemento mais visivel da pagina inteira. Ocupa todo o background e e a unica coisa renderizando em quase todas as secoes.
**Acao:**
- Restringir a animacao APENAS ao hero section (nao fullpage)
- Reduzir quantidade de particulas — esta poluido
- Em mobile e telas menores, desativar ou simplificar drasticamente
- Respeitar `prefers-reduced-motion: reduce`

### 6. Hero sem carousel — conteudo estatico
Hero mostra apenas texto estatico. A versao de referencia tinha carousel com 3 cases de destaque e metricas.
**Acao:** Implementar hero carousel com:
- Slide 1: A Novica Rebelde — +14.080 ingressos | R$ 3.4M receita
- Slide 2: Grupo Technos — +158.92% conversao | +106.04% receita
- Slide 3: Impulsiona — +3.736% engajamento | +10.000 escolas

### 7. Sidebar vertical esquerda
Existe sidebar com labels (M2BR, Web, Redes, Tecnologia, Inteligencia). Funcionalidade incerta.
**Acao:** Se for navegacao, linkar para secoes. Se for decorativa, remover — esta consumindo espaco horizontal e confundindo o layout.

### 8. Links de cases inconsistentes
Mix de rotas internas (`/cases/a-novica-rebelde`) e externas (`agencia.m2br.com/case/`).
**Acao:** Padronizar todas para rotas internas. Criar subpaginas usando o template `cases/tutu.html` como base.

### 9. Fotos da equipe ausentes
HTML nao contem `src` de fotos. Secao de equipe (29 pessoas) sem imagens.
**Acao:** Adicionar fotos reais. Fallback: iniciais + cor do departamento. Formato: 400x400px WebP.

### 10. Formulario de contato sem backend
O formulario de briefing tem campos completos mas nao ha evidencia de integracao com backend (API, RD Station, email).
**Acao:** Configurar envio real — RD Station, Resend, ou backend API.

---

## P2 — MELHORIAS (qualidade e completude)

### 11. Imagens sem alt descritivo
Varias `<img>` de cases sem `alt` preenchido.
**Acao:** Adicionar alt descritivo em cada imagem.

### 12. Cards de servicos com expand nao funcional
Os 6 servicos tem botao (+) mas conteudo expandido nao aparece. Servicos:
1. Design & Experiencia
2. Tecnologia
3. Campanhas
4. Midias Sociais & Engajamento
5. Estrategia Digital
6. Inteligencia Artificial

**Acao:** Implementar expand/collapse com sub-items detalhados.

### 13. Completar lista de clientes
Clientes no site: Michelin, Globo, Basel, Valia, RNP, Aventura, Roxy, Alumni PUC-Rio, Blue Note, Fuel, PASA, Dellarte.
Da versao anterior faltam: SC Johnson, HomeHub, Leather Labs, Alegria, Vivescer, Aprendiz Legal, M2BR Academy, BMA, Impulsiona.
**Acao:** Completar todos, padronizar logos como SVG local em `/images/clients/`.

### 14. Definir tema padrao
Site renderiza em light mode. A versao de referencia usava dark mode.
**Acao:** Alinhar com cliente qual e o padrao desejado. Toggle deve funcionar e persistir via localStorage.

### 15. Meta robots noindex
O site tem `<meta name="robots" content="noindex, nofollow">`.
**Acao:** Manter enquanto em homologacao. Remover quando for para producao.

---

## P3 — POLIMENTO

### 16. Imagens hospedadas em servidor externo
Imagens de cases carregam de `agencia.m2br.com` — latencia extra.
**Acao:** Migrar imagens criticas para dominio local ou CDN.

### 17. Fonts
Verificar carregamento correto de: Inter (Google Fonts, body) e Quadon (local @font-face, headings).

### 18. Selos de parceiros no footer
Garantir presenca: RD Station Gold 2025, Meta Business Partners, Google Partner.

### 19. WhatsApp
Numero correto: `+5521982442500`. Verificar que todos os links apontam para este numero.

### 20. JSON-LD
Manter schema.org Organization ja existente no `<head>`.

---

## DADOS DE CONTEUDO (referencia para o agente)

### Equipe completa (29 pessoas, 7 departamentos)
- **Diretoria (2):** Bernardo Leitao (Fundador), Artur Oliveira (Operacoes)
- **Criacao (8):** Henrique Melo, Ingrid Vieira, Thales Pontes, Daniela Teles, Karl Quaresma, Mariana Teles, Matheus Dias
- **Midia (4):** Allan Quadros, Marcellia Oliveira, Mariana Alves, Rafaella Soares
- **Gestao de Contas (3):** Igor Krau, Larissa Guedes, Mariana Rodrigues
- **Conteudo (2):** Bianca Nery, Thais de Paula
- **Social (2):** Carol Souza, Jamile Lima
- **Inbound/SAC (3):** Thiago Loureiro, Carol Soares, Victoria Soares

### Formulario de briefing (campos)
- Nome completo (obrigatorio)
- Email corporativo (obrigatorio)
- Telefone/WhatsApp (obrigatorio)
- Empresa/Marca (obrigatorio)
- Cargo (opcional)
- O que voce precisa? (Performance, Social, Branding, Tecnologia, IA, Inbound, 360)
- Faixa de investimento mensal
- Prazo desejado
- Como nos encontrou
- Descricao do projeto (obrigatorio, textarea)
- Checkbox LGPD (obrigatorio)

### Cases com metricas
| Case | Metricas | Categorias |
|---|---|---|
| A Novica Rebelde | +14.080 ingressos, R$ 3.4M receita | Performance |
| Grupo Technos | +158.92% conversao, +106.04% receita | Performance |
| Impulsiona | +3.736% engajamento, +10.000 escolas | Performance, Social |
| Tutu-Valia | IA + Criacao + Social | IA, Criacao |
| Michelin | CX + Estrategia | CX |
| Grupo Toquinho | — | Entretenimento |
| Casa e Video | — | Performance |
| Windsor Hoteis | — | Design |
| Spa das Sobrancelhas | — | Social |
| Geek Game Rio Festival | — | Entretenimento |

---

## RESUMO DE PRIORIDADES

| Prioridade | Item | Descricao |
|---|---|---|
| **P0** | #1 | Secoes invisiveis — conteudo nao renderiza |
| **P0** | #2 | Hero deslocado 7000px abaixo do nav |
| **P0** | #3 | Rotas # retornam 404 |
| **P0** | #4 | Placeholders em producao |
| **P1** | #5 | Particulas dominam a pagina |
| **P1** | #6 | Hero sem carousel |
| **P1** | #7 | Sidebar sem funcao clara |
| **P1** | #8 | Links de cases inconsistentes |
| **P1** | #9 | Fotos da equipe ausentes |
| **P1** | #10 | Form sem backend |
| **P2** | #11-15 | Alt tags, servicos expand, clientes, tema, noindex |
| **P3** | #16-20 | CDN, fonts, selos, WhatsApp, JSON-LD |
