# Stewardly App Experience v1

> Documento de referência da direção visual **aprovada** para a área autenticada da Stewardly.
> Este documento **não implementa** componentes, telas, rotas, services ou estilos. Ele registra a
> direção oficial que deve guiar o desenvolvimento futuro sem perder o visual aprovado.

---

## 1. Objetivo visual

A área autenticada da Stewardly deve **parecer um aplicativo financeiro pessoal**, próximo de um
app mobile premium de finanças pessoais — e **não** um painel administrativo, um CRM ou um dashboard
genérico corporativo.

A intenção é que o usuário sinta que está usando um produto cuidado, calmo e com identidade própria,
focado na sua vida financeira, e não uma ferramenta de back-office cheia de tabelas e formulários frios.

---

## 2. Referência aprovada

A referência visual aprovada e oficial para a área autenticada é o mockup:

**“Stewardly Multi-screen Proposal v3”**

Qualquer redesenho futuro deve se ancorar nesse mockup como fonte de verdade visual. Divergências
significativas em relação a ele exigem nova aprovação.

O mockup é um HTML estático de prototipação, com as quatro telas (dashboard, categories,
transactions, commitments) em versão **desktop e mobile**, alternância **light/dark** e os tokens,
o gráfico linear em SVG e os water meters já materializados. Os valores concretos extraídos dele
estão registrados nos **Apêndices A e B** deste documento como referência de implementação — eles
descrevem o alvo visual, não obrigam a mesma estrutura de arquivos/classes.

---

## 3. Princípios visuais

- **App financeiro pessoal**, não painel admin/CRM.
- **Gráfico linear como protagonista** do dashboard.
- **Water meters** como elemento visual próprio da marca.
- **Cards premium arredondados**.
- **Mobile-first**, com cara de app.
- **Desktop amplo e respirado**.
- **Dark mode premium**.
- **Light mode com profundidade** (atmosfera, não branco chapado).
- **Verde como cor principal**, **dourado como acento**, **azul/sky apenas como apoio**.

---

## 4. O que evitar

- Visual de CRM.
- Visual de admin dashboard genérico.
- Tabelas frias como elemento principal.
- Sidebar pesada demais.
- Cards secos, sem profundidade.
- Telas com aparência corporativa e sem identidade.
- Uso excessivo de branco sem atmosfera no light mode.
- Uso excessivo de elementos decorativos sem função.
- Duplicação de componentes visuais.

---

## 5. Rotas autenticadas

A área autenticada é composta pelas seguintes rotas:

- `/dashboard`
- `/categories`
- `/transactions`
- `/commitments`

---

## 6. Componentes principais planejados

Estes são os componentes previstos para dar forma à App Experience. São **planejamento**; nenhum
deles é implementado por este documento.

- `AppShell`
- `AppSidebar`
- `MobileTopbar`
- `PageHeader`
- `StewardlyLineChart`
- `WaterMeter`
- `WaterMeterGroup`
- `MetricCard`
- `SectionCard`
- `QuickActionCard`
- `FilterChip`
- `FinancialRow`
- `CategoryPressureCard`
- `TransactionRow`
- `CommitmentCalendar`
- `CommitmentAgenda`

---

## 7. Dashboard aprovado

O dashboard deve conter:

- **Header** com contexto do mês.
- **Saldo / balanço em destaque**.
- **Hero principal em verde escuro premium**.
- **Gráfico linear** de income vs expenses.
- **Badge de saúde financeira**.
- **Water meters mensais**.
- Cards de **income**, **expenses** e **saved**.
- **Ações rápidas**.
- **Category pressure**.
- **Upcoming commitments**.
- **Recent transactions** no mobile ou quando fizer sentido.

---

## 8. Categories aprovado

A tela de categorias deve conter:

- **Header humano e explicativo**.
- **Filtros All / Income / Expense em chips**.
- **Cards de categoria com water meter**.
- **Lista de categorias preservando o CRUD** existente.
- Visual de **“containers vivos”** para mostrar pressão / uso.
- **Mobile com cards empilhados e legíveis**.

---

## 9. Transactions aprovado

A tela de transações deve conter:

- **Header claro**.
- **Filtros em chips**.
- **Cards de resumo**.
- **Water meters por semana ou período**.
- **Desktop com tabela premium**.
- **Mobile com lista / cards**, nunca uma tabela espremida.
- **Preservar create / edit / delete** existentes.

---

## 10. Commitments aprovado

A tela de compromissos deve conter:

- **Calendário financeiro calmo**.
- **Hero** com compromissos planejados.
- **Water meters por semana / período**.
- **Calendário mensal no desktop**.
- **Agenda lateral no desktop**.
- **Mobile** com **semana em chips** e **agenda abaixo**.
- Inicialmente pode existir como **visual de planned feature**, **sem fingir dados reais**.

---

## 11. Regras mobile

- **Mobile-first**.
- **Evitar overflow horizontal**.
- **Priorizar uma coluna**.
- **Cards com respiro**.
- **Botões com área de toque confortável**.
- **Tabelas devem virar cards / listas**.

### Ordem do dashboard no mobile

1. Header
2. Contexto do mês
3. Hero com saldo + gráfico linear
4. Water meters
5. Income / Expenses
6. Ações rápidas
7. Compromissos
8. Transações recentes

---

## 12. Water meters

Os **water meters** são um **elemento visual proprietário da Stewardly**.

Eles representam **progresso, pressão, saúde financeira, uso de categoria ou fluxo semanal/mensal**.

Devem parecer **suaves, preenchidos como água, com brilho sutil** e **sem aparência infantil**.

---

## 13. Gráfico linear

O **gráfico linear** é o **elemento protagonista do dashboard**.

- Deve representar **income vs expenses** ou o **fluxo financeiro**.
- **Não usar biblioteca de chart** inicialmente.
- Preferir **SVG / CSS controlado** para preservar a identidade visual.
- Deve funcionar corretamente em **light e dark mode**.

---

## 14. Decisões técnicas

- **Não adicionar biblioteca de UI**.
- **Não adicionar biblioteca de chart** neste momento.
- Preferir **componentes reutilizáveis**.
- **Evitar lógica visual espalhada**.
- **Usar tokens existentes**.
- Manter **TypeScript com tipos explícitos**.
- **Não usar `any`**.

---

## 15. Próximos cards relacionados

- **Card 66** — Criar componentes base da App Experience
- **Card 67** — Redesenhar layout autenticado AppShell
- **Card 68** — Redesenhar Dashboard com gráfico linear e water meters
- **Card 69** — Criar adaptadores de dados para gráficos e water meters
- **Card 70** — Redesenhar Categories com water meters
- **Card 71** — Redesenhar Transactions com fluxo semanal
- **Card 72** — Criar rota `/commitments` visual inicial

---

## Apêndice A — Design tokens de referência

Valores extraídos do mockup aprovado. Servem como **alvo visual**. Na implementação, devem ser
reconciliados com os tokens já existentes no projeto (ver Decisões técnicas: "usar tokens
existentes") — não é para duplicar uma nova paleta se já houver equivalente.

### Cores — Light mode

| Token | Valor |
| --- | --- |
| `primary` | `#43B67B` |
| `primary-strong` | `#2E8E60` |
| `primary-soft` | `#EAF7F0` |
| `gold` (acento) | `#D3A353` |
| `gold-soft` | `#FBF3E5` |
| `sky` (apoio) | `#76B7C7` |
| `bg` | `#F7FAF8` |
| `surface` | `#FFFFFF` |
| `surface-2` | `#F2F7F4` |
| `surface-3` | `#EDF3EF` |
| `border` | `#DCE7E0` |
| `text` | `#1F2A37` |
| `muted` | `#64748B` |
| Expense (negativo) | `#E35D5D` |

### Cores — Dark mode

| Token | Valor |
| --- | --- |
| `primary` | `#48C784` |
| `primary-strong` | `#2DA96A` |
| `primary-soft` | `#103322` |
| `gold` (acento) | `#D7AF65` |
| `gold-soft` | `#2B2417` |
| `sky` (apoio) | `#7DB9C4` |
| `bg` | `#07120D` |
| `surface` | `#0C1A14` |
| `surface-2` | `#102118` |
| `surface-3` | `#11271D` |
| `border` | `rgba(255,255,255,.08)` |
| `text` | `#F5FBF8` |
| `muted` | `#A3B5AD` |

### Gradientes, sombras e profundidade

- **Hero verde escuro premium** (`green-grad`):
  - Light: `linear-gradient(135deg,#1D563C 0%, #214C3B 35%, #32583B 100%)`
  - Dark: `linear-gradient(135deg,#071A12 0%, #0C2518 40%, #1F3421 100%)`
- **Sombra de card** (`shadow`): light `0 24px 80px rgba(16,24,40,.08)` / dark `0 28px 84px rgba(0,0,0,.38)`
- **Glow verde** (`glow`): light `0 18px 48px rgba(67,182,123,.16)` / dark `0 18px 48px rgba(72,199,132,.12)`
- **Atmosfera de fundo** (a "profundidade" do light mode): dois `radial-gradient` sutis (verde no
  canto superior esquerdo, dourado no canto superior direito) sobre o `bg` — é isso que evita o
  branco chapado citado em "O que evitar".
- **Preenchimento dos water meters**: `linear-gradient(180deg, color-mix(primary 70% white), primary)`
  com um brilho elíptico translúcido no topo (aparência de água, não infantil). Variações `gold` e `sky`.

### Tipografia

- Família: **Inter**, com fallback `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`.
- Títulos com `letter-spacing` negativo acentuado (`-.04em` a `-.08em`) e peso 900 — ar premium/app.

### Raios de canto (arredondamento premium)

- Frame desktop `38px` · frame mobile `44px` · hero `34px` · cards `26px` · category-card `24px`
- Rows/itens de lista `18px` · chips e pills totalmente arredondados (`999px`) · water tank `18px 18px 14px 14px`

---

## Apêndice B — Estrutura de layout de referência

Dimensões observadas no mockup, como orientação (não como contrato rígido de CSS):

- **Container geral**: `max-width: 1560px`.
- **Desktop frame**: grid `240px + 1fr` (sidebar fixa de **240px** + conteúdo), `min-height ~860px`.
- **Sidebar**: coluna vertical — marca no topo, navegação, e um card de apoio (`side-card`) ancorado
  na base (`margin-top:auto`). Some abaixo de **980px**.
- **Mobile frame**: largura **405px**, moldura tipo dispositivo, tela interna `min-height ~850px`,
  layout em **uma coluna**.
- **Breakpoints**: `1280px` (empilha desktop+mobile no protótipo), `980px` (esconde sidebar, colapsa
  grids para 1 coluna, tabela vira lista), `560px` (ajustes de densidade mobile).
- **Gráfico linear**: SVG com `viewBox="0 0 560 220"` no desktop; linha principal `stroke-width` ~8
  com gradiente `sky → verde → dourado`, área com gradiente verde esmaecido, mais uma linha
  secundária dourada (income vs expenses). Nenhuma biblioteca de chart — SVG puro.

---

## Apêndice C — Divergências entre o card e o mockup (a decidir)

Registradas para não passarem despercebidas na implementação. **Não** resolvidas aqui:

1. **Item de navegação "Reports"**: a sidebar do mockup lista **cinco** itens
   (Dashboard, Transactions, Categories, Commitments, **Reports**), mas o Card 65 documenta apenas
   **quatro** rotas autenticadas. `Reports` não tem rota nem card associado. Tratar como item futuro
   fora de escopo, ou remover da sidebar na implementação — decisão pendente.
2. **Ordem da navegação**: no mockup a ordem é *Dashboard → Transactions → Categories → Commitments*;
   o card lista as rotas como *dashboard → categories → transactions → commitments*. Definir a ordem
   canônica do menu antes do Card 67 (AppShell/Sidebar).
