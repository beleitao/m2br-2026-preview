# Orientacoes de Ajuste — Site M2BR 2026
**Ref:** https://2026.m2br.com/
**Data:** 2026-04-01
**Para:** Agente Cursor

---

## PROBLEMAS CRITICOS (resolver primeiro)

### 1. Rotas com anchor (#) retornam 404
As URLs `https://2026.m2br.com/#cases`, `/#servicos`, `/#equipe` retornam HTTP 404.
**Causa provavel:** O servidor/deploy nao esta configurado para redirecionar todas as rotas para o index (SPA fallback).
**Acao:** Configurar o servidor para servir `index.html` em qualquer rota. Se for Vercel/Netlify, adicionar `rewrites` ou `_redirects`. Se for Apache/Nginx, configurar try_files.

### 2. Imagens placeholder ainda no codigo
Existem referencias a `/assets-temp/tutu-placeholder.svg` e `/assets-temp/banner-placeholder.svg`.
**Acao:** Substituir por imagens reais. Para o Tutu, usar a imagem do case que ja existe no hero da pagina `/cases/tutu.html`.

### 3. Imagens de cases sem alt descritivo
Varias `<img>` de cases nao tem `alt` preenchido — prejudica acessibilidade e SEO.
**Acao:** Adicionar alt descritivo em cada imagem. Ex: `alt="Case A Novica Rebelde — campanha digital de ingressos"`.

---

## HERO SECTION

### 4. Sem carousel — adicionar slides
O hero atual e estatico, com texto unico. A versao anterior (referencia em `index.html` do repo) tinha carousel com 3 slides (A Novica Rebelde, Grupo Technos, Impulsiona) com transicoes clip-path, timeline nav e dados de resultado em cada slide.
**Acao:** Implementar hero carousel com os 3 cases de destaque, mostrando metricas de resultado em cada slide:
- Slide 1: A Novica Rebelde — +14.080 ingressos | R$ 3.4M receita
- Slide 2: Grupo Technos — +158.92% conversao | +106.04% receita
- Slide 3: Impulsiona — +3.736% engajamento | +10.000 escolas

### 5. Background de particulas/constelacao
O efeito de constelacao/particles e visualmente interessante mas parece pesado e o conteudo fica perdido no meio de uma tela muito vazia.
**Acao:** Manter o efeito mais sutil ou restrito a uma area. O hero precisa de mais impacto visual — considerar usar imagens dos cases como background dos slides ao inves de particulas genericas.

### 6. Sidebar de navegacao esquerda
Existe uma sidebar vertical com labels (M2BR, Web, Redes, Tecnologia, Inteligencia).
**Acao:** Verificar se essa sidebar funciona como navegacao secundaria ou e apenas decorativa. Se for funcional, garantir que os links rolam para as secoes corretas. Se for decorativa, avaliar se agrega ou polui.

---

## CASES SECTION

### 7. Estrutura de cases: manter 2 niveis
A secao de cases tem 2 partes:
- **Carousel de destaque** (3 cases com metricas)
- **Grid de portfolio** (9+ cases com filtros)

**Acao:** Garantir que ambas as partes estao funcionando. Filtros por categoria: Todos, Performance, Design, Social, Tecnologia.

### 8. Links de cases inconsistentes
Alguns cases apontam para `/cases/a-novica-rebelde` (rota interna), outros para `https://agencia.m2br.com/case/michelin/` (site antigo).
**Acao:** Decidir: ou todos apontam para subpaginas internas (como `/cases/tutu.html`) ou todos apontam para o site antigo. Nao misturar. Recomendacao: criar subpaginas internas para todos, usando o template de `cases/tutu.html` como base.

### 9. Cases que precisam de subpagina propria
Ja existe template em `cases/tutu.html`. Criar subpaginas para:
- `/cases/a-novica-rebelde`
- `/cases/grupo-technos`
- `/cases/impulsiona`
- `/cases/michelin`

Os demais podem linkar temporariamente para `agencia.m2br.com`.

---

## CLIENTES

### 10. Novos clientes a incluir
O site live lista clientes que nao estavam na versao anterior. Garantir que TODOS estao presentes:
- **Industria:** SC Johnson, Michelin, Basel, HomeHub, Leather Labs
- **Entretenimento:** Globo, Alegria, Aventura, Roxy, Blue Note
- **Terceiro Setor:** Impulsiona, Vivescer, Aprendiz Legal, PASA
- **Educacao:** M2BR Academy, Alumni PUC-Rio
- **Juridico:** BMA
- **Novos (adicionar se faltam):** Valia, RNP, Fuel, Dellarte

### 11. Logos locais vs externos
O site live usa mix de logos locais (`/images/clients/valia.svg`) e externos (`agencia.m2br.com`).
**Acao:** Padronizar. Preferencialmente hospedar todos localmente em `/images/clients/` como SVG para performance e controle.

---

## SERVICOS

### 12. Cards de servicos com expand
Os 6 servicos usam estrutura expansivel (+) mas o conteudo expandido nao aparece.
**Acao:** Implementar expand/collapse funcional em cada card com sub-servicos detalhados:

1. **Design & Experiencia** — UX/UI, identidade visual, branding, motion
2. **Tecnologia** — Desenvolvimento web, apps, integracao, CMS
3. **Campanhas** — Midia paga, performance, awareness, conversao
4. **Midias Sociais & Engajamento** — Gestao de redes, conteudo, community
5. **Estrategia Digital** — Planejamento, dados, analytics, consultoria
6. **Inteligencia Artificial** — Automacao, chatbots, IA generativa, otimizacao

---

## EQUIPE

### 13. Fotos da equipe ausentes
O HTML nao contem `src` de fotos dos membros. A secao de equipe precisa de fotos reais.
**Acao:** Adicionar fotos de todos os 29 membros. Padrao sugerido: 400x400px, fundo neutro, formato WebP. Fallback com iniciais + cor de departamento.

### 14. Estrutura da equipe (29 pessoas, 7 departamentos)
Garantir que TODOS estao presentes:
- **Diretoria (2):** Bernardo Leitao (Fundador), Artur Oliveira (Operacoes)
- **Criacao (8):** Henrique Melo, Ingrid Vieira, Thales Pontes, Daniela Teles, Karl Quaresma, Mariana Teles, Matheus Dias
- **Midia (4):** Allan Quadros, Marcellia Oliveira, Mariana Alves, Rafaella Soares
- **Gestao de Contas (3):** Igor Krau, Larissa Guedes, Mariana Rodrigues
- **Conteudo (2):** Bianca Nery, Thais de Paula
- **Social (2):** Carol Souza, Jamile Lima
- **Inbound/SAC (3):** Thiago Loureiro, Carol Soares, Victoria Soares

---

## FORMULARIO DE CONTATO

### 15. Formulario de briefing completo
O form deve ter estes campos (validar que todos existem):
- Nome completo (obrigatorio)
- Email corporativo (obrigatorio)
- Telefone/WhatsApp (obrigatorio)
- Empresa/Marca (obrigatorio)
- Cargo (opcional)
- Dropdown: O que voce precisa? (Performance, Social, Branding, Tecnologia, IA, Inbound, 360)
- Faixa de investimento mensal
- Prazo desejado
- Como nos encontrou
- Descricao do projeto (obrigatorio, textarea)
- Checkbox LGPD (obrigatorio)
- Botao: "Enviar briefing"

**Acao:** Verificar que o form envia para algum backend (API, email, RD Station, etc). Sem backend configurado = form decorativo.

---

## TEMA LIGHT/DARK

### 16. Light mode como padrao no live
O site live renderiza em light mode com fundo claro e texto escuro. A versao anterior usava dark mode como padrao.
**Acao:** Alinhar qual e o padrao desejado. O toggle deve funcionar e persistir via localStorage. Verificar contrastes em AMBOS os temas.

### 17. Script de tema no head
O site tem inline script no `<head>` para aplicar tema antes do paint (evitar flash).
**Acao:** Garantir que este script existe e roda antes de qualquer CSS:
```js
(() => {
  const key = 'm2br-theme';
  const saved = localStorage.getItem(key);
  const prefersLight = matchMedia('(prefers-color-scheme: light)').matches;
  if (saved ? saved === 'light' : prefersLight)
    document.documentElement.setAttribute('data-theme', 'light');
})();
```

---

## SEO E META

### 18. JSON-LD estruturado ja presente — manter
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "M2BR",
  "url": "https://2026.m2br.com",
  "email": "contato@m2br.com",
  "sameAs": ["facebook", "instagram", "linkedin", "youtube", "behance"]
}
```

### 19. Meta robots noindex
O site tem `<meta name="robots" content="noindex, nofollow">`.
**Acao:** Manter enquanto estiver em homologacao. Remover quando for para producao.

---

## FOOTER

### 20. Selos de parceiros
Garantir presenca dos 3 selos:
- RD Station Gold 2025
- Meta Business Partners
- Google Partner

### 21. WhatsApp correto
Numero: `+5521982442500`
**Acao:** Verificar que TODOS os links de WhatsApp no site apontam para este numero.

---

## PERFORMANCE E TECNICO

### 22. Imagens externas demais
Muitas imagens carregam de `agencia.m2br.com` (servidor externo). Isso adiciona DNS lookup e latencia.
**Acao:** Migrar imagens criticas (hero, cases de destaque, logos de clientes) para o proprio dominio/CDN.

### 23. Fonts
Verificar carregamento de:
- **Inter** (Google Fonts) — body
- **Quadon** (local @font-face) — headings/display
Se Quadon nao estiver carregando, os headings caem para fallback sans-serif e perdem identidade.

### 24. Preload de imagens do hero
Manter `<link rel="preload">` para as 3 imagens do carousel hero. Sem preload, o LCP (Largest Contentful Paint) sofre.

---

## RESUMO DE PRIORIDADES

| Prioridade | Item | Impacto |
|---|---|---|
| P0 | #1 — Fix rotas 404 (SPA fallback) | Site quebrado |
| P0 | #2 — Remover placeholders | Impressao amadora |
| P1 | #4 — Hero carousel com cases | Impacto visual |
| P1 | #8 — Padronizar links de cases | UX/navegacao |
| P1 | #13 — Fotos da equipe | Credibilidade |
| P1 | #15 — Backend do form | Funcionalidade core |
| P2 | #3 — Alt tags em imagens | SEO/acessibilidade |
| P2 | #10 — Completar lista de clientes | Conteudo |
| P2 | #12 — Expand de servicos | UX |
| P2 | #16 — Definir tema padrao | Consistencia |
| P3 | #22 — Migrar imagens para local | Performance |
| P3 | #11 — Padronizar logos SVG | Manutencao |
