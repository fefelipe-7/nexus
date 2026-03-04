# nexus — fase 4: layout expandido, calendario e modal refinado

documento de referencia completo para construcao da fase 4 do app nexus.
este arquivo assume que as fases 1, 2 e 3 foram concluidas e todos os seus criterios foram atendidos.

---

## objetivo da fase 4

quatro entregas que juntas elevam o nexus a um app visualmente maduro e funcionalmente completo no nucleo:

1. **correcao do erro ao salvar tarefa** — investigar causa raiz e corrigir com tratamento de erro real
2. **novo sistema de layout** — duas colunas com painel lateral contextual, conteudo fluido sem max-width rigido
3. **modal de tarefas refinado** — mais bonito e intuitivo sem exagerar
4. **modulo de calendario** — view propria com grid semanal e mensal, painel lateral no dashboard e tarefas, eventos nativos e tarefas com hora como eventos automaticos

---

## convencoes — lembrete obrigatorio

as mesmas das fases anteriores. nao mudam nunca:

- **todo texto visivel ao usuario em letras minusculas, sem excecao**
- nada hard-coded nos componentes — tudo via variaveis css
- sql em snake_case, js/svelte em camelCase

---

## entrega 1 — correcao do erro ao salvar tarefa

### investigacao da causa raiz

o erro generico "erro ao salvar" esconde o problema real. o primeiro passo e expor o erro verdadeiro. substituir o bloco catch no modal:

```javascript
// antes — engole o erro
} catch (e) {
  erro = 'erro ao salvar. tente novamente.';
}

// depois — expoe o erro real no desenvolvimento
} catch (e) {
  console.error('[nexus] erro ao salvar tarefa:', e);
  erro = e?.message ?? 'erro ao salvar. tente novamente.';
}
```

### causas mais provaveis e correcoes

**causa 1 — permissoes do plugin sql nao declaradas no tauri.conf.json**

no tauri 2, o plugin sql precisa de permissoes explicitas. sem elas, qualquer operacao de escrita falha silenciosamente ou com erro generico.

adicionar ao `tauri.conf.json`:

```json
{
  "app": {
    "security": {
      "csp": null,
      "capabilities": [
        {
          "identifier": "default",
          "description": "permissoes padrao do nexus",
          "platforms": ["linux", "windows"],
          "permissions": [
            "core:default",
            "sql:default",
            "sql:allow-execute",
            "sql:allow-select",
            "sql:allow-load"
          ]
        }
      ]
    }
  }
}
```

**causa 2 — area_id sendo passado como string "null"**

selects html em svelte convertem `null` para a string `"null"` quando o value e um option. isso viola a foreign key constraint do sqlite.

corrigir na funcao `criarTarefa` e `atualizarTarefa` nas queries:

```javascript
// correcao em criarTarefa — forcar null real
export async function criarTarefa(tarefa) {
  const db = getDb();

  // converte string "null" e valores falsy para null real
  const areaId = tarefa.areaId && tarefa.areaId !== 'null'
    ? Number(tarefa.areaId)
    : null;

  const result = await db.execute(`
    insert into tarefas (titulo, descricao, area_id, prioridade, data_prevista, hora_prevista)
    values (?, ?, ?, ?, ?, ?)
  `, [
    tarefa.titulo,
    tarefa.descricao  ?? null,
    areaId,
    tarefa.prioridade ?? 'media',
    tarefa.dataPrevista ?? null,
    tarefa.horaPrevista ?? null,
  ]);

  return result.lastInsertId;
}
```

aplicar a mesma sanitizacao em `atualizarTarefa`:

```javascript
if (campos.areaId !== undefined) {
  const areaIdSanitizado = campos.areaId && campos.areaId !== 'null'
    ? Number(campos.areaId)
    : null;
  sets.push('area_id = ?');
  valores.push(areaIdSanitizado);
}
```

**causa 3 — banco nao inicializado quando o modal abre**

o modal pode abrir antes do `initDb()` terminar se o usuario for rapido. adicionar guarda no `getDb()`:

```javascript
// src/lib/db/client.js
export function getDb() {
  if (!db) {
    throw new Error('banco nao inicializado. aguarde o carregamento do app.');
  }
  return db;
}
```

e no `App.svelte`, bloquear a renderizacao dos modulos ate o banco estar pronto:

```svelte
<script>
  let dbPronto = false;

  onMount(async () => {
    await initDb();
    dbPronto = true;
    await restaurarJanela();
    await iniciarPersistenciaJanela();
  });
</script>

{#if dbPronto}
  <div class="app-shell">
    <Sidebar />
    <main class="app-main">
      <svelte:component this={currentView} />
    </main>
  </div>
{:else}
  <div class="app-loading">
    <span>nexus</span>
  </div>
{/if}
```

```css
/* adicionar ao app.css */
.app-loading {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--text-muted);
  background: var(--bg);
}
```

---

## entrega 2 — novo sistema de layout

### o problema atual

`max-width: 900px` com `margin: 0 auto` concentra todo o conteudo numa faixa estreita no centro. em monitores de 1440px ou mais, as laterais ficam completamente vazias. em monitores menores como 1280px o conteudo fica ok mas sem usar o espaco disponivel de forma inteligente.

### a nova abordagem — fluido + duas colunas

o layout abandona o max-width fixo e passa a usar um sistema de duas colunas com proporcoes fluidas:

```
┌────────────────────────────────────────────────────────────┐
│ sidebar (220px fixo)                                       │
│ ├── coluna principal (flex: 1, min-width: 520px)           │
│ └── painel lateral (320px fixo, aparece contextualmente)   │
└────────────────────────────────────────────────────────────┘
```

- **coluna principal** — cresce para ocupar todo o espaco disponivel. tem padding interno de `var(--space-8)` nas laterais mas sem max-width
- **painel lateral** — 320px fixo, aparece no dashboard e no modulo de tarefas com o mini calendario. desaparece quando a view nao suporta painel (ex: modulo de calendario tem sua propria logica de layout)
- **comportamento fluido** — abaixo de 1100px de largura total (sidebar + conteudo + painel), o painel lateral some automaticamente e o conteudo expande

### design tokens novos

adicionar ao `app.css`:

```css
:root {
  /* layout de duas colunas */
  --painel-width:        320px;
  --coluna-padding:      var(--space-8);
  --layout-break-painel: 1100px; /* abaixo disso o painel some */
}
```

### src/lib/components/layout/AppShell.svelte

extrair o shell do `App.svelte` para um componente dedicado que gerencia o layout de duas colunas:

```svelte
<!-- src/lib/components/layout/AppShell.svelte -->
<script>
  import Sidebar from './Sidebar.svelte';
  import PainelLateral from './PainelLateral.svelte';
  import { painelVisivel } from '$lib/stores/ui.js';

  export let currentView;
  export let showPainel = false;
</script>

<div class="shell">
  <Sidebar />

  <div class="shell-corpo">
    <!-- coluna principal -->
    <div class="coluna-principal">
      <svelte:component this={currentView} />
    </div>

    <!-- painel lateral — so aparece quando showPainel = true -->
    {#if showPainel && $painelVisivel}
      <aside class="painel-lateral">
        <PainelLateral />
      </aside>
    {/if}
  </div>
</div>

<style>
  .shell {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: var(--bg);
  }

  .shell-corpo {
    flex: 1;
    display: flex;
    overflow: hidden;
    min-width: 0;
  }

  .coluna-principal {
    flex: 1;
    overflow-y: auto;
    min-width: 0;
    /* sem max-width — cresce livremente */
  }

  .painel-lateral {
    width: var(--painel-width);
    flex-shrink: 0;
    border-left: 1px solid var(--border);
    overflow-y: auto;
    background: var(--bg-secondary);

    /* some em telas menores */
    @media (max-width: 1100px) {
      display: none;
    }
  }
</style>
```

### padding interno das paginas

cada pagina (Dashboard, Tarefas, Calendario) passa a usar padding direto sem max-width:

```css
/* padrao para todas as paginas — substitui o .dashboard, .tarefas-page etc */
.page {
  padding: var(--space-8) var(--coluna-padding);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
```

atualizar o seletor `.dashboard` no `Dashboard.svelte` e `.tarefas-page` no `Tarefas.svelte` para seguir esse padrao — remover `max-width` e `margin: 0 auto`.

### store de ui atualizado

```javascript
// src/lib/stores/ui.js — adicionar:
export const painelVisivel = writable(true); // pode ser ocultado pelo usuario
```

### src/lib/components/layout/PainelLateral.svelte

o painel lateral e contextual — exibe conteudo diferente dependendo da view ativa.
na fase 4 ele exibe o mini calendario semanal e os proximos eventos/tarefas.

```svelte
<!-- src/lib/components/layout/PainelLateral.svelte -->
<script>
  import { currentRoute } from '$lib/stores/navigation.js';
  import MiniCalendario from '$lib/components/calendario/MiniCalendario.svelte';
  import ProximosEventos from '$lib/components/calendario/ProximosEventos.svelte';
</script>

<div class="painel">
  <div class="painel-secao">
    <MiniCalendario />
  </div>
  <div class="painel-secao">
    <ProximosEventos />
  </div>
</div>

<style>
  .painel {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .painel-secao {
    border-bottom: 1px solid var(--border);
  }

  .painel-secao:last-child {
    border-bottom: none;
    flex: 1;
    overflow-y: auto;
  }
</style>
```

### atualizar App.svelte

```svelte
<!-- src/App.svelte — versao fase 4 -->
<script>
  import AppShell from '$lib/components/layout/AppShell.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import Tarefas from './routes/Tarefas.svelte';
  import Calendario from './routes/Calendario.svelte';
  import { currentRoute } from '$lib/stores/navigation.js';
  import { initDb } from '$lib/db/client.js';
  import { restaurarJanela, iniciarPersistenciaJanela } from '$lib/utils/window.js';
  import { onMount } from 'svelte';

  let dbPronto = false;

  onMount(async () => {
    await initDb();
    dbPronto = true;
    await restaurarJanela();
    await iniciarPersistenciaJanela();
  });

  // views que exibem o painel lateral
  const viewsComPainel = new Set(['dashboard', 'tarefas']);

  const views = {
    dashboard:  Dashboard,
    tarefas:    Tarefas,
    calendario: Calendario,
  };

  $: currentView  = views[$currentRoute] ?? Dashboard;
  $: showPainel   = viewsComPainel.has($currentRoute);
</script>

{#if dbPronto}
  <AppShell {currentView} {showPainel} />
{:else}
  <div class="app-loading">nexus</div>
{/if}
```

---

## entrega 3 — modal de tarefas refinado

### o que muda visualmente

- **header redesenhado** — o label "nova tarefa / editar tarefa" sobe para dentro de um header com fundo `--bg-secondary`, separando visualmente o contexto do conteudo
- **campo de titulo mais generoso** — padding maior, linha inferior sutil no lugar da ausencia total de borda, placeholder mais descritivo
- **chips de metadados com cor quando ativos** — quando prioridade e "alta" ou "critica", o chip inteiro ganha uma cor de fundo sutil. quando uma area esta selecionada, o chip mostra a cor da area
- **botao salvar com cor da area** — se uma area esta selecionada, o botao salvar usa a cor dessa area ao inves do preto padrao. sutil mas conecta o modal visualmente ao sistema de areas
- **transicao da secao de detalhes** — a expansao usa uma transicao de altura com `grid-template-rows` ao inves de aparecer abruptamente
- **espacamento interno mais respirado** — aumentar gap entre secoes de `--space-4` para `--space-5`

### ModalTarefa.svelte — apenas as mudancas visuais

as mudancas sao todas de estilo e de alguns elementos html. a logica permanece identica a fase 3. indicar apenas os deltas:

**header:**
```svelte
<!-- substituir .modal-header por: -->
<div class="modal-header">
  <div class="modal-header-inner">
    <span class="modal-label">
      {editando ? 'editar tarefa' : 'nova tarefa'}
    </span>
    {#if editando && editando.area_nome}
      <span class="modal-area-badge" style="color: {editando.area_cor}">
        {editando.area_nome}
      </span>
    {/if}
  </div>
  <button class="btn-fechar" on:click={fechar} aria-label="fechar">×</button>
</div>
```

**campo de titulo:**
```svelte
<!-- substituir .campo-titulo por: -->
<div class="campo-titulo">
  <input
    bind:this={inputTitulo}
    bind:value={titulo}
    class="input-titulo"
    class:com-erro={!!erro}
    placeholder="no que voce precisa trabalhar?"
    autocomplete="off"
  />
  {#if erro}
    <span class="msg-erro">{erro}</span>
  {/if}
</div>
```

**chips com estado ativo:**
```svelte
<!-- chip de prioridade com cor quando ativa -->
<div
  class="chip-campo"
  class:chip-ativo={prioridade !== 'media'}
  style={prioridade !== 'media' ? `border-color: ${corPrioridade}33; background: ${corPrioridade}0d` : ''}
>
  <span class="indicador-prioridade" style="background: {corPrioridade}" />
  <select bind:value={prioridade} class="chip-select">
    {#each PRIORIDADES as p}
      <option value={p.valor}>{p.label}</option>
    {/each}
  </select>
</div>

<!-- chip de area com cor quando selecionada -->
{#if areaAtual}
<div
  class="chip-campo"
  style="border-color: {areaAtual.cor}33; background: {areaAtual.cor}0d"
>
  <span class="chip-dot" style="background: {areaAtual.cor}" />
  <select bind:value={areaId} class="chip-select" style="color: {areaAtual.cor}">
    <option value={null}>sem area</option>
    {#each $areas as area}
      <option value={area.id}>{area.nome}</option>
    {/each}
  </select>
</div>
{:else}
<div class="chip-campo">
  <span class="chip-icone">◎</span>
  <select bind:value={areaId} class="chip-select">
    <option value={null}>sem area</option>
    {#each $areas as area}
      <option value={area.id}>{area.nome}</option>
    {/each}
  </select>
</div>
{/if}
```

```javascript
// adicionar no <script> do modal:
$: areaAtual = areaId ? $areas.find(a => a.id === Number(areaId)) : null;
$: corBotaoSalvar = areaAtual?.cor ?? 'var(--text-primary)';
```

**botao salvar com cor da area:**
```svelte
<button
  class="btn-salvar"
  style="background: {corBotaoSalvar}"
  on:click={salvar}
  disabled={salvando || !titulo.trim()}
>
  {salvando ? 'salvando...' : 'salvar'}
</button>
```

**transicao da secao de detalhes com grid:**
```css
/* substituir .campos-detalhes por: */
.detalhes-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 200ms ease;
}

.detalhes-wrapper.aberto {
  grid-template-rows: 1fr;
}

.detalhes-inner {
  overflow: hidden;
}

.campos-detalhes {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border);
  margin-top: var(--space-1);
}
```

```svelte
<!-- envolver campos-detalhes: -->
<div class="detalhes-wrapper" class:aberto={mostrarDetalhes}>
  <div class="detalhes-inner">
    <div class="campos-detalhes">
      <!-- campos existentes -->
    </div>
  </div>
</div>
```

**css adicional para o header:**
```css
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4) var(--space-3) var(--space-5);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
}

.modal-header-inner {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.modal-area-badge {
  font-size: var(--text-xs);
  font-weight: 600;
  opacity: 0.8;
}

/* titulo com linha inferior sutil */
.input-titulo {
  border: none;
  border-bottom: 1px solid var(--border);
  border-radius: 0;
  padding-bottom: var(--space-3);
  font-size: var(--text-xl);
  font-family: var(--font-body);
  font-weight: 500;
  color: var(--text-primary);
  background: transparent;
  outline: none;
  width: 100%;
  line-height: 1.3;
  transition: border-color var(--transition-fast);
}

.input-titulo:focus { border-bottom-color: var(--text-primary); }
.input-titulo::placeholder { color: var(--text-disabled); font-weight: 400; }

.chip-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}
```

---

## entrega 4 — modulo de calendario

### schema — tabela de eventos

```sql
create table if not exists eventos (
  id             integer primary key autoincrement,

  -- conteudo
  titulo         text    not null,
  descricao      text,
  local          text,

  -- tempo
  inicio         text    not null,  -- 'YYYY-MM-DD HH:MM'
  fim            text,              -- 'YYYY-MM-DD HH:MM', null = evento de dia inteiro
  dia_inteiro    integer not null default 0,

  -- classificacao
  area_id        integer references areas_de_vida(id) on delete set null,
  cor            text,              -- override da cor da area, opcional

  -- conexao com tarefa (tarefa com hora vira evento automaticamente)
  tarefa_id      integer references tarefas(id) on delete cascade,

  -- recorrencia (fase futura)
  recorrente     integer not null default 0,

  -- metadados
  criado_em      text    not null default (datetime('now')),
  atualizado_em  text    not null default (datetime('now'))
);

create index if not exists idx_eventos_inicio   on eventos(inicio);
create index if not exists idx_eventos_area     on eventos(area_id);
create index if not exists idx_eventos_tarefa   on eventos(tarefa_id);
```

adicionar `migration_004_eventos` no `migrations.js`:

```javascript
async function migration_004_eventos(db) {
  await db.execute(`
    create table if not exists eventos (
      id          integer primary key autoincrement,
      titulo      text    not null,
      descricao   text,
      local       text,
      inicio      text    not null,
      fim         text,
      dia_inteiro integer not null default 0,
      area_id     integer references areas_de_vida(id) on delete set null,
      cor         text,
      tarefa_id   integer references tarefas(id) on delete cascade,
      recorrente  integer not null default 0,
      criado_em   text    not null default (datetime('now')),
      atualizado_em text  not null default (datetime('now'))
    )
  `);

  await db.execute(`create index if not exists idx_eventos_inicio  on eventos(inicio)`);
  await db.execute(`create index if not exists idx_eventos_area    on eventos(area_id)`);
  await db.execute(`create index if not exists idx_eventos_tarefa  on eventos(tarefa_id)`);
}
```

chamar no final de `runMigrations`:

```javascript
await migration_004_eventos(db);
```

### tarefas como eventos automaticos

quando uma tarefa tem `hora_prevista` preenchida, ela aparece automaticamente no calendario como evento. isso e feito na query — nao cria um registro real na tabela `eventos`, apenas une os dois na leitura:

```javascript
// src/lib/db/queries/eventos.js

import { getDb } from '../client.js';

// retorna todos os eventos de um intervalo, incluindo tarefas com hora
export async function getEventosDoIntervalo(dataInicio, dataFim) {
  const db = getDb();

  // eventos reais
  const eventosReais = await db.select(`
    select
      e.id,
      e.titulo,
      e.descricao,
      e.local,
      e.inicio,
      e.fim,
      e.dia_inteiro,
      e.cor,
      e.tarefa_id,
      a.nome  as area_nome,
      a.cor   as area_cor,
      'evento' as tipo
    from eventos e
    left join areas_de_vida a on e.area_id = a.id
    where date(e.inicio) between ? and ?
    order by e.inicio asc
  `, [dataInicio, dataFim]);

  // tarefas com hora (viram eventos automaticamente)
  const tarefasComoEventos = await db.select(`
    select
      t.id,
      t.titulo,
      t.descricao,
      null          as local,
      (t.data_prevista || ' ' || t.hora_prevista) as inicio,
      null          as fim,
      0             as dia_inteiro,
      a.cor,
      null          as tarefa_id,
      a.nome        as area_nome,
      a.cor         as area_cor,
      'tarefa'      as tipo
    from tarefas t
    left join areas_de_vida a on t.area_id = a.id
    where t.data_prevista between ? and ?
    and t.hora_prevista is not null
    and t.hora_prevista != ''
    and t.status != 'cancelada'
    order by t.data_prevista asc, t.hora_prevista asc
  `, [dataInicio, dataFim]);

  // une e ordena por inicio
  return [...eventosReais, ...tarefasComoEventos]
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
}

// retorna proximos eventos para o painel lateral (a partir de hoje)
export async function getProximosEventos(limite = 8) {
  const db = getDb();
  const hoje = new Date().toISOString().slice(0, 10);
  const em30dias = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  return getEventosDoIntervalo(hoje, em30dias).then(lista => lista.slice(0, limite));
}

export async function criarEvento(evento) {
  const db = getDb();

  const areaId = evento.areaId && evento.areaId !== 'null'
    ? Number(evento.areaId)
    : null;

  const result = await db.execute(`
    insert into eventos (titulo, descricao, local, inicio, fim, dia_inteiro, area_id, cor)
    values (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    evento.titulo,
    evento.descricao  ?? null,
    evento.local      ?? null,
    evento.inicio,
    evento.fim        ?? null,
    evento.diaInteiro ? 1 : 0,
    areaId,
    evento.cor        ?? null,
  ]);

  return result.lastInsertId;
}

export async function atualizarEvento(id, campos) {
  const db = getDb();
  const sets    = [];
  const valores = [];

  if (campos.titulo      !== undefined) { sets.push('titulo = ?');      valores.push(campos.titulo); }
  if (campos.descricao   !== undefined) { sets.push('descricao = ?');   valores.push(campos.descricao); }
  if (campos.local       !== undefined) { sets.push('local = ?');       valores.push(campos.local); }
  if (campos.inicio      !== undefined) { sets.push('inicio = ?');      valores.push(campos.inicio); }
  if (campos.fim         !== undefined) { sets.push('fim = ?');         valores.push(campos.fim); }
  if (campos.diaInteiro  !== undefined) { sets.push('dia_inteiro = ?'); valores.push(campos.diaInteiro ? 1 : 0); }
  if (campos.areaId      !== undefined) {
    const areaIdSanitizado = campos.areaId && campos.areaId !== 'null' ? Number(campos.areaId) : null;
    sets.push('area_id = ?');
    valores.push(areaIdSanitizado);
  }

  sets.push("atualizado_em = datetime('now')");
  valores.push(id);

  await db.execute(
    `update eventos set ${sets.join(', ')} where id = ?`,
    valores
  );
}

export async function deletarEvento(id) {
  const db = getDb();
  await db.execute('delete from eventos where id = ?', [id]);
}
```

### store de calendario

```javascript
// src/lib/stores/calendario.js
import { writable } from 'svelte/store';
import { getEventosDoIntervalo, getProximosEventos } from '$lib/db/queries/eventos.js';
import { getIntervalo } from '$lib/utils/dates.js';
import { hoje } from '$lib/utils/dates.js';

export const eventos          = writable([]);
export const proximosEventos  = writable([]);
export const carregandoEventos = writable(false);

// view do calendario: 'semana' ou 'mes'
export const viewCalendario   = writable('semana');

// data de referencia do calendario (navegar entre semanas/meses)
export const dataReferencia   = writable(hoje());

export async function carregarEventos(dataRef, view) {
  carregandoEventos.set(true);
  try {
    const tab = view === 'semana' ? 'semana' : 'mes';
    const { inicio, fim } = getIntervalo(tab, dataRef);
    const lista = await getEventosDoIntervalo(inicio, fim);
    eventos.set(lista);
  } finally {
    carregandoEventos.set(false);
  }
}

export async function carregarProximosEventos() {
  const lista = await getProximosEventos(8);
  proximosEventos.set(lista);
}
```

### utilitarios de data — adicionar funcoes de calendario

adicionar em `src/lib/utils/dates.js`:

```javascript
// retorna os dias de uma semana dado uma data de referencia
// retorna array de strings ISO ['2026-03-01', '2026-03-02', ...]
export function diasDaSemana(dataRef) {
  const [ano, mes, dia] = dataRef.split('-').map(Number);
  const ref = new Date(ano, mes - 1, dia);
  const diaSemana = ref.getDay(); // 0 = domingo
  const inicio = new Date(ref);
  inicio.setDate(ref.getDate() - diaSemana);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicio);
    d.setDate(inicio.getDate() + i);
    return toISO(d);
  });
}

// retorna os dias de um mes com padding para completar a grade (6 semanas)
export function diasDoMes(dataRef) {
  const [ano, mes] = dataRef.split('-').map(Number);
  const primeiroDia = new Date(ano, mes - 1, 1);
  const ultimoDia   = new Date(ano, mes, 0);

  // padding inicial (dias do mes anterior)
  const diasAntes = primeiroDia.getDay();
  const inicio = new Date(primeiroDia);
  inicio.setDate(primeiroDia.getDate() - diasAntes);

  // sempre 42 dias (6 semanas x 7 dias)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(inicio);
    d.setDate(inicio.getDate() + i);
    return {
      iso:        toISO(d),
      mesAtual:   d.getMonth() === mes - 1,
    };
  });
}

// navega para o periodo anterior ou proximo
// retorna a nova dataRef
export function navegarPeriodo(dataRef, view, direcao) {
  const [ano, mes, dia] = dataRef.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);

  if (view === 'semana') {
    d.setDate(d.getDate() + (direcao === 'proximo' ? 7 : -7));
  } else {
    d.setMonth(d.getMonth() + (direcao === 'proximo' ? 1 : -1));
  }

  return toISO(d);
}

// helper interno (ja existe, garantir que esta exportado)
export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
```

### src/routes/Calendario.svelte

```svelte
<!-- src/routes/Calendario.svelte -->
<script>
  import { onMount } from 'svelte';
  import { eventos, carregandoEventos, viewCalendario, dataReferencia, carregarEventos } from '$lib/stores/calendario.js';
  import { activeModal } from '$lib/stores/ui.js';
  import { tituloPeriodo, navegarPeriodo } from '$lib/utils/dates.js';

  import GridSemanal from '$lib/components/calendario/GridSemanal.svelte';
  import GridMensal from '$lib/components/calendario/GridMensal.svelte';
  import ModalEvento from '$lib/components/calendario/ModalEvento.svelte';

  onMount(() => {
    carregarEventos($dataReferencia, $viewCalendario);
  });

  $: carregarEventos($dataReferencia, $viewCalendario);

  $: titulo = tituloPeriodo(
    $viewCalendario === 'semana' ? 'semana' : 'mes',
    $dataReferencia
  );

  function navegar(direcao) {
    dataReferencia.update(ref => navegarPeriodo(ref, $viewCalendario, direcao));
  }

  function irParaHoje() {
    const { hoje } = await import('$lib/utils/dates.js');
    dataReferencia.set(hoje());
  }
</script>

<div class="page">

  <!-- header -->
  <header class="page-header">
    <div class="page-title">
      <h1>calendario</h1>
    </div>
    <div class="page-actions">
      <!-- navegacao de periodo -->
      <div class="nav-periodo">
        <button class="btn-nav" on:click={() => navegar('anterior')}>‹</button>
        <span class="periodo-titulo">{titulo}</span>
        <button class="btn-nav" on:click={() => navegar('proximo')}>›</button>
      </div>

      <!-- toggle semana / mes -->
      <div class="view-toggle">
        <button
          class="toggle-btn"
          class:ativo={$viewCalendario === 'semana'}
          on:click={() => viewCalendario.set('semana')}
        >semana</button>
        <button
          class="toggle-btn"
          class:ativo={$viewCalendario === 'mes'}
          on:click={() => viewCalendario.set('mes')}
        >mes</button>
      </div>

      <button class="btn-ghost" on:click={irParaHoje}>hoje</button>

      <button class="btn-primary" on:click={() => activeModal.set('novoEvento')}>
        + novo evento
      </button>
    </div>
  </header>

  <!-- grid -->
  {#if $carregandoEventos}
    <div class="estado-loading">carregando...</div>
  {:else if $viewCalendario === 'semana'}
    <GridSemanal
      eventos={$eventos}
      dataRef={$dataReferencia}
      on:atualizar={() => carregarEventos($dataReferencia, $viewCalendario)}
    />
  {:else}
    <GridMensal
      eventos={$eventos}
      dataRef={$dataReferencia}
      on:atualizar={() => carregarEventos($dataReferencia, $viewCalendario)}
    />
  {/if}

</div>

{#if $activeModal === 'novoEvento' || $activeModal === 'editarEvento'}
  <ModalEvento
    on:fechar={() => activeModal.set(null)}
    on:salvo={() => carregarEventos($dataReferencia, $viewCalendario)}
  />
{/if}

<style>
  .page {
    padding: var(--space-8) var(--coluna-padding);
    min-height: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  h1 {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .page-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .nav-periodo {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .btn-nav {
    background: none;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: var(--text-md);
    color: var(--text-secondary);
    transition: all var(--transition-fast);
  }
  .btn-nav:hover { background: var(--bg-hover); border-color: var(--border-strong); }

  .periodo-titulo {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
    min-width: 160px;
    text-align: center;
  }

  .view-toggle {
    display: flex;
    gap: 2px;
    padding: 3px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }

  .toggle-btn {
    padding: 4px 12px;
    border-radius: calc(var(--radius-md) - 2px);
    border: none;
    background: none;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .toggle-btn.ativo {
    background: var(--bg);
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }

  .btn-ghost {
    background: none;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    padding: 7px 14px;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .btn-ghost:hover { background: var(--bg-hover); }

  .btn-primary {
    background: var(--text-primary);
    color: var(--bg);
    border: none;
    border-radius: var(--radius-md);
    padding: 8px 14px;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    font-weight: 500;
    cursor: pointer;
    transition: opacity var(--transition-fast);
  }
  .btn-primary:hover { opacity: 0.85; }

  .estado-loading {
    font-size: var(--text-sm);
    color: var(--text-muted);
    padding: var(--space-8) 0;
  }
</style>
```

### src/lib/components/calendario/GridSemanal.svelte

```svelte
<!-- src/lib/components/calendario/GridSemanal.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import { diasDaSemana, hoje } from '$lib/utils/dates.js';
  import { activeModal, eventoEditando } from '$lib/stores/ui.js';

  export let eventos  = [];
  export let dataRef  = hoje();

  const dispatch = createEventDispatcher();

  const HORAS = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, '0') + ':00'
  );

  const DIAS_LABEL = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

  $: dias = diasDaSemana(dataRef);
  $: hojeISO = hoje();

  // mapeia eventos para cada dia
  $: eventosPorDia = dias.reduce((acc, dia) => {
    acc[dia] = eventos.filter(e => e.inicio.slice(0, 10) === dia);
    return acc;
  }, {});

  function getEventoStyle(evento) {
    if (!evento.inicio.includes(' ')) return '';
    const [, hora] = evento.inicio.split(' ');
    const [h, m]   = hora.split(':').map(Number);
    const top       = (h * 60 + m) * (64 / 60); // 64px por hora
    const altura    = evento.fim
      ? (() => {
          const [, fimHora] = evento.fim.split(' ');
          const [fh, fm]    = fimHora.split(':').map(Number);
          return ((fh * 60 + fm) - (h * 60 + m)) * (64 / 60);
        })()
      : 48; // altura padrao de 48px se nao tem fim

    return `top: ${top}px; height: ${Math.max(altura, 24)}px;`;
  }

  function abrirEvento(evento) {
    eventoEditando.set(evento);
    activeModal.set('editarEvento');
  }

  function novoPorClique(dia, hora) {
    // pre-preenche o modal com a data e hora clicada
    eventoEditando.set({ inicio: `${dia} ${hora}` });
    activeModal.set('novoEvento');
  }
</script>

<div class="grid-semanal">

  <!-- cabecalho dos dias -->
  <div class="grid-header">
    <div class="coluna-horas" />
    {#each dias as dia, i}
      <div class="coluna-dia-header" class:hoje={dia === hojeISO}>
        <span class="dia-label">{DIAS_LABEL[i]}</span>
        <span class="dia-numero" class:hoje={dia === hojeISO}>
          {parseInt(dia.slice(8))}
        </span>
      </div>
    {/each}
  </div>

  <!-- corpo com horas -->
  <div class="grid-corpo">

    <!-- coluna de horas -->
    <div class="coluna-horas">
      {#each HORAS as hora}
        <div class="celula-hora">
          <span class="hora-label">{hora}</span>
        </div>
      {/each}
    </div>

    <!-- colunas dos dias -->
    {#each dias as dia}
      <div class="coluna-dia">
        <!-- linhas de hora (clicaveis) -->
        {#each HORAS as hora}
          <div
            class="celula-tempo"
            on:click={() => novoPorClique(dia, hora)}
            on:keydown={() => {}}
            role="button"
            tabindex="0"
          />
        {/each}

        <!-- eventos posicionados absolutamente -->
        {#each eventosPorDia[dia] ?? [] as evento (evento.id)}
          <div
            class="evento-bloco"
            class:evento-tarefa={evento.tipo === 'tarefa'}
            style="{getEventoStyle(evento)} background: {evento.area_cor ?? evento.cor ?? 'var(--accent)'}22; border-left: 3px solid {evento.area_cor ?? evento.cor ?? 'var(--accent)'};"
            on:click|stopPropagation={() => abrirEvento(evento)}
            on:keydown={() => {}}
            role="button"
            tabindex="0"
            title={evento.titulo}
          >
            <span class="evento-titulo">{evento.titulo}</span>
            {#if evento.inicio.includes(' ')}
              <span class="evento-hora">{evento.inicio.slice(11, 16)}</span>
            {/if}
          </div>
        {/each}
      </div>
    {/each}

  </div>
</div>

<style>
  .grid-semanal {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: var(--bg);
  }

  /* header */
  .grid-header {
    display: grid;
    grid-template-columns: 52px repeat(7, 1fr);
    border-bottom: 1px solid var(--border);
    background: var(--bg-secondary);
    position: sticky;
    top: 0;
    z-index: 2;
  }

  .coluna-horas {
    border-right: 1px solid var(--border);
  }

  .coluna-dia-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-3) var(--space-2);
    border-right: 1px solid var(--border);
    gap: 2px;
  }
  .coluna-dia-header:last-child { border-right: none; }
  .coluna-dia-header.hoje { background: var(--accent-subtle); }

  .dia-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .dia-numero {
    font-size: var(--text-md);
    font-weight: 600;
    color: var(--text-secondary);
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-full);
  }
  .dia-numero.hoje {
    background: var(--accent);
    color: white;
  }

  /* corpo */
  .grid-corpo {
    display: grid;
    grid-template-columns: 52px repeat(7, 1fr);
    flex: 1;
    overflow-y: auto;
  }

  .coluna-horas {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border);
  }

  .celula-hora {
    height: 64px;
    display: flex;
    align-items: flex-start;
    padding: 4px 6px 0;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .hora-label {
    font-size: var(--text-xs);
    color: var(--text-disabled);
    font-weight: 400;
    white-space: nowrap;
  }

  .coluna-dia {
    position: relative;
    border-right: 1px solid var(--border);
    min-height: calc(64px * 24);
  }
  .coluna-dia:last-child { border-right: none; }

  .celula-tempo {
    height: 64px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background var(--transition-fast);
  }
  .celula-tempo:hover { background: var(--bg-hover); }

  /* eventos */
  .evento-bloco {
    position: absolute;
    left: 4px;
    right: 4px;
    border-radius: var(--radius-sm);
    padding: 3px 6px;
    cursor: pointer;
    overflow: hidden;
    z-index: 1;
    transition: opacity var(--transition-fast);
  }
  .evento-bloco:hover { opacity: 0.85; }

  .evento-titulo {
    display: block;
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }

  .evento-hora {
    display: block;
    font-size: 10px;
    color: var(--text-secondary);
    margin-top: 1px;
  }

  .evento-tarefa .evento-titulo::before {
    content: '✓ ';
    opacity: 0.5;
  }
</style>
```

### src/lib/components/calendario/GridMensal.svelte

```svelte
<!-- src/lib/components/calendario/GridMensal.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import { diasDoMes, hoje } from '$lib/utils/dates.js';
  import { activeModal, eventoEditando } from '$lib/stores/ui.js';

  export let eventos = [];
  export let dataRef = hoje();

  const dispatch = createEventDispatcher();

  const CABECALHO = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

  $: dias = diasDoMes(dataRef);
  $: hojeISO = hoje();

  $: eventosPorDia = eventos.reduce((acc, e) => {
    const dia = e.inicio.slice(0, 10);
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(e);
    return acc;
  }, {});

  function abrirEvento(evento) {
    eventoEditando.set(evento);
    activeModal.set('editarEvento');
  }

  function novoPorDia(iso) {
    eventoEditando.set({ inicio: iso });
    activeModal.set('novoEvento');
  }
</script>

<div class="grid-mensal">

  <!-- cabecalho -->
  <div class="mes-header">
    {#each CABECALHO as dia}
      <div class="mes-header-dia">{dia}</div>
    {/each}
  </div>

  <!-- grade de dias -->
  <div class="mes-grade">
    {#each dias as { iso, mesAtual }}
      <div
        class="mes-celula"
        class:fora-mes={!mesAtual}
        class:hoje={iso === hojeISO}
        on:click={() => novoPorDia(iso)}
        on:keydown={() => {}}
        role="button"
        tabindex="0"
      >
        <span class="mes-numero">{parseInt(iso.slice(8))}</span>

        <!-- eventos do dia (max 3 visiveis) -->
        <div class="mes-eventos">
          {#each (eventosPorDia[iso] ?? []).slice(0, 3) as evento (evento.id)}
            <div
              class="mes-evento-chip"
              style="background: {evento.area_cor ?? 'var(--accent)'}22; color: {evento.area_cor ?? 'var(--text-primary)'};"
              on:click|stopPropagation={() => abrirEvento(evento)}
              on:keydown={() => {}}
              role="button"
              tabindex="0"
              title={evento.titulo}
            >
              {evento.titulo}
            </div>
          {/each}
          {#if (eventosPorDia[iso] ?? []).length > 3}
            <span class="mes-mais">+{(eventosPorDia[iso] ?? []).length - 3} mais</span>
          {/if}
        </div>
      </div>
    {/each}
  </div>

</div>

<style>
  .grid-mensal {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: var(--bg);
  }

  .mes-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
  }

  .mes-header-dia {
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--text-muted);
    text-align: center;
    border-right: 1px solid var(--border);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .mes-header-dia:last-child { border-right: none; }

  .mes-grade {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    flex: 1;
  }

  .mes-celula {
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: var(--space-2);
    min-height: 96px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: background var(--transition-fast);
  }
  .mes-celula:hover { background: var(--bg-hover); }
  .mes-celula:nth-child(7n) { border-right: none; }
  .mes-celula.fora-mes { background: var(--bg-secondary); }
  .mes-celula.hoje { background: var(--accent-subtle); }

  .mes-numero {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-secondary);
    width: 24px; height: 24px;
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }
  .mes-celula.hoje .mes-numero {
    background: var(--accent);
    color: white;
    font-weight: 600;
  }
  .mes-celula.fora-mes .mes-numero { color: var(--text-disabled); }

  .mes-eventos {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    overflow: hidden;
  }

  .mes-evento-chip {
    font-size: 11px;
    font-weight: 500;
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    transition: opacity var(--transition-fast);
  }
  .mes-evento-chip:hover { opacity: 0.75; }

  .mes-mais {
    font-size: 10px;
    color: var(--text-muted);
    padding: 1px 4px;
  }
</style>
```

### src/lib/components/calendario/MiniCalendario.svelte

aparece no painel lateral do dashboard e das tarefas.

```svelte
<!-- src/lib/components/calendario/MiniCalendario.svelte -->
<script>
  import { diasDoMes, hoje, navegarPeriodo, toISO } from '$lib/utils/dates.js';
  import { dataReferencia } from '$lib/stores/calendario.js';

  const CABECALHO = ['d', 's', 't', 'q', 'q', 's', 's'];
  const MESES = ['janeiro','fevereiro','marco','abril','maio','junho',
                 'julho','agosto','setembro','outubro','novembro','dezembro'];

  let mesRef = hoje();
  $: [ano, mes] = mesRef.split('-').map(Number);
  $: dias = diasDoMes(mesRef);
  $: hojeISO = hoje();

  function navMes(dir) {
    mesRef = navegarPeriodo(mesRef, 'mes', dir === 1 ? 'proximo' : 'anterior');
  }

  function selecionarDia(iso) {
    dataReferencia.set(iso);
  }
</script>

<div class="mini-cal">
  <div class="mini-cal-header">
    <button class="mini-nav" on:click={() => navMes(-1)}>‹</button>
    <span class="mini-titulo">{MESES[mes - 1]} {ano}</span>
    <button class="mini-nav" on:click={() => navMes(1)}>›</button>
  </div>

  <div class="mini-grid-header">
    {#each CABECALHO as d}<span>{d}</span>{/each}
  </div>

  <div class="mini-grade">
    {#each dias as { iso, mesAtual }}
      <button
        class="mini-dia"
        class:fora={!mesAtual}
        class:hoje={iso === hojeISO}
        class:selecionado={iso === $dataReferencia}
        on:click={() => selecionarDia(iso)}
      >
        {parseInt(iso.slice(8))}
      </button>
    {/each}
  </div>
</div>

<style>
  .mini-cal {
    padding: var(--space-4);
  }

  .mini-cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-3);
  }

  .mini-titulo {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--text-primary);
  }

  .mini-nav {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-size: var(--text-md);
    width: 20px; height: 20px;
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }
  .mini-nav:hover { color: var(--text-primary); background: var(--bg-hover); }

  .mini-grid-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: var(--space-1);
  }

  .mini-grid-header span {
    font-size: 10px;
    color: var(--text-muted);
    text-align: center;
    font-weight: 500;
    padding: 2px 0;
  }

  .mini-grade {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .mini-dia {
    background: none; border: none; cursor: pointer;
    font-size: var(--text-xs); font-family: var(--font-body);
    color: var(--text-secondary);
    width: 100%; aspect-ratio: 1;
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }
  .mini-dia:hover:not(.fora)  { background: var(--bg-hover); color: var(--text-primary); }
  .mini-dia.fora              { color: var(--text-disabled); }
  .mini-dia.hoje              { font-weight: 700; color: var(--accent); }
  .mini-dia.selecionado       { background: var(--text-primary); color: var(--bg); border-radius: var(--radius-sm); }
  .mini-dia.hoje.selecionado  { background: var(--accent); }
</style>
```

### src/lib/components/calendario/ProximosEventos.svelte

```svelte
<!-- src/lib/components/calendario/ProximosEventos.svelte -->
<script>
  import { onMount } from 'svelte';
  import { proximosEventos, carregarProximosEventos } from '$lib/stores/calendario.js';
  import { labelRelativo } from '$lib/utils/dates.js';

  onMount(() => {
    carregarProximosEventos();
  });
</script>

<div class="proximos">
  <div class="proximos-header">
    <span class="proximos-titulo">proximos eventos</span>
  </div>

  {#if $proximosEventos.length === 0}
    <div class="proximos-vazio">
      <p>nenhum evento nos proximos 30 dias</p>
    </div>
  {:else}
    <div class="proximos-lista">
      {#each $proximosEventos as evento (evento.id)}
        <div class="proximos-item">
          <div
            class="proximos-cor"
            style="background: {evento.area_cor ?? 'var(--border-strong)'}"
          />
          <div class="proximos-info">
            <span class="proximos-nome">{evento.titulo}</span>
            <span class="proximos-data">
              {labelRelativo(evento.inicio.slice(0, 10))}
              {#if evento.inicio.includes(' ')}
                · {evento.inicio.slice(11, 16)}
              {/if}
            </span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .proximos { padding: var(--space-4); }

  .proximos-header {
    margin-bottom: var(--space-3);
  }

  .proximos-titulo {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.3px;
  }

  .proximos-vazio {
    font-size: var(--text-xs);
    color: var(--text-disabled);
    padding: var(--space-2) 0;
  }

  .proximos-lista {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .proximos-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--border);
  }
  .proximos-item:last-child { border-bottom: none; }

  .proximos-cor {
    width: 3px;
    height: 32px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .proximos-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .proximos-nome {
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .proximos-data {
    font-size: 11px;
    color: var(--text-muted);
  }
</style>
```

### src/lib/components/calendario/ModalEvento.svelte

```svelte
<!-- src/lib/components/calendario/ModalEvento.svelte -->
<script>
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { activeModal, eventoEditando } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';
  import { criarEvento, atualizarEvento, deletarEvento } from '$lib/db/queries/eventos.js';

  const dispatch = createEventDispatcher();

  let inputTitulo;
  $: editando = $eventoEditando;

  // pre-preenche com dados do evento ou valores do clique no grid
  let titulo      = editando?.titulo    ?? '';
  let descricao   = editando?.descricao ?? '';
  let local       = editando?.local     ?? '';
  let inicio      = editando?.inicio    ?? '';
  let fim         = editando?.fim       ?? '';
  let diaInteiro  = editando?.dia_inteiro ? true : false;
  let areaId      = editando?.area_id   ?? null;

  // separar data e hora do inicio para inputs separados
  $: dataInicio = inicio ? inicio.slice(0, 10) : '';
  $: horaInicio = inicio && inicio.includes(' ') ? inicio.slice(11, 16) : '';
  $: dataFim    = fim ? fim.slice(0, 10) : '';
  $: horaFim    = fim && fim.includes(' ') ? fim.slice(11, 16) : '';

  let salvando  = false;
  let deletando = false;
  let erro      = '';

  onMount(async () => {
    await tick();
    inputTitulo?.focus();
  });

  function fechar() {
    eventoEditando.set(null);
    dispatch('fechar');
  }

  function montarDatetime(data, hora) {
    if (!data) return null;
    if (!hora) return data;
    return `${data} ${hora}`;
  }

  async function salvar() {
    if (!titulo.trim()) {
      erro = 'o titulo e obrigatorio';
      return;
    }
    if (!dataInicio) {
      erro = 'a data de inicio e obrigatoria';
      return;
    }
    salvando = true;
    erro = '';
    try {
      const dados = {
        titulo:     titulo.trim(),
        descricao:  descricao.trim() || null,
        local:      local.trim() || null,
        inicio:     montarDatetime(dataInicio, horaInicio),
        fim:        montarDatetime(dataFim, horaFim),
        diaInteiro,
        areaId:     areaId || null,
      };

      if (editando?.id && !editando?.inicio?.includes('tarefa')) {
        await atualizarEvento(editando.id, dados);
      } else {
        await criarEvento(dados);
      }

      dispatch('salvo');
      fechar();
    } catch (e) {
      console.error('[nexus] erro ao salvar evento:', e);
      erro = e?.message ?? 'erro ao salvar. tente novamente.';
    } finally {
      salvando = false;
    }
  }

  async function remover() {
    if (!editando?.id) return;
    deletando = true;
    try {
      await deletarEvento(editando.id);
      dispatch('salvo');
      fechar();
    } finally {
      deletando = false;
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') fechar();
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) salvar();
  }

  $: areaAtual = areaId ? $areas.find(a => a.id === Number(areaId)) : null;
  $: corBotao  = areaAtual?.cor ?? 'var(--text-primary)';
  $: ehTarefa  = editando?.tipo === 'tarefa';
</script>

<svelte:window on:keydown={onKeydown} />

<div class="backdrop" on:click={fechar} on:keydown={() => {}} role="presentation" />

<div class="modal-wrapper" role="dialog" aria-modal="true">
  <div class="modal-conteudo">

    <div class="modal-header">
      <div class="modal-header-inner">
        <span class="modal-label">
          {ehTarefa ? 'tarefa no calendario' : editando?.id ? 'editar evento' : 'novo evento'}
        </span>
        {#if areaAtual}
          <span class="modal-area-badge" style="color: {areaAtual.cor}">{areaAtual.nome}</span>
        {/if}
      </div>
      <button class="btn-fechar" on:click={fechar}>×</button>
    </div>

    <div class="modal-corpo">
      <div class="campo-titulo">
        <input
          bind:this={inputTitulo}
          bind:value={titulo}
          class="input-titulo"
          class:com-erro={!!erro && !titulo}
          placeholder="nome do evento"
          disabled={ehTarefa}
          autocomplete="off"
        />
        {#if erro}<span class="msg-erro">{erro}</span>{/if}
      </div>

      <div class="campos-tempo">
        <div class="campo-detalhe">
          <label>data inicio</label>
          <input type="date" bind:value={dataInicio} class="input-detalhe" disabled={ehTarefa} />
        </div>
        {#if !diaInteiro}
          <div class="campo-detalhe">
            <label>hora inicio</label>
            <input type="time" bind:value={horaInicio} class="input-detalhe" disabled={ehTarefa} />
          </div>
          <div class="campo-detalhe">
            <label>data fim</label>
            <input type="date" bind:value={dataFim} class="input-detalhe" />
          </div>
          <div class="campo-detalhe">
            <label>hora fim</label>
            <input type="time" bind:value={horaFim} class="input-detalhe" />
          </div>
        {/if}
        <label class="label-check">
          <input type="checkbox" bind:checked={diaInteiro} disabled={ehTarefa} />
          dia inteiro
        </label>
      </div>

      <div class="campos-extra">
        <div class="campo-detalhe campo-detalhe--full">
          <label>local</label>
          <input
            type="text"
            bind:value={local}
            class="input-detalhe"
            placeholder="opcional"
            disabled={ehTarefa}
          />
        </div>
        <div class="campo-detalhe campo-detalhe--full">
          <label>area</label>
          <select bind:value={areaId} class="input-detalhe" disabled={ehTarefa}>
            <option value={null}>sem area</option>
            {#each $areas as area}
              <option value={area.id}>{area.nome}</option>
            {/each}
          </select>
        </div>
        {#if !ehTarefa}
          <div class="campo-detalhe campo-detalhe--full">
            <label>descricao</label>
            <textarea bind:value={descricao} class="input-desc" placeholder="opcional" rows="2" />
          </div>
        {/if}
      </div>

      {#if ehTarefa}
        <p class="aviso-tarefa">
          este evento foi gerado automaticamente a partir de uma tarefa com hora definida.
          para editar, va ao modulo de tarefas.
        </p>
      {/if}
    </div>

    <div class="modal-footer">
      <div class="footer-esquerda">
        {#if editando?.id && !ehTarefa}
          <button class="btn-deletar" on:click={remover} disabled={deletando}>
            {deletando ? 'removendo...' : 'remover evento'}
          </button>
        {/if}
      </div>
      <div class="footer-direita">
        <span class="hint">cmd+enter para salvar</span>
        <button class="btn-cancelar" on:click={fechar}>cancelar</button>
        {#if !ehTarefa}
          <button
            class="btn-salvar"
            style="background: {corBotao}"
            on:click={salvar}
            disabled={salvando || !titulo.trim()}
          >
            {salvando ? 'salvando...' : 'salvar'}
          </button>
        {/if}
      </div>
    </div>

  </div>
</div>

<style>
  .backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.25);
    z-index: 100;
    backdrop-filter: blur(3px);
    animation: fadeIn 150ms ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal-wrapper {
    position: fixed; inset: 0;
    display: flex; align-items: center; justify-content: center;
    z-index: 101; pointer-events: none;
  }

  .modal-conteudo {
    pointer-events: all;
    width: 480px;
    max-width: calc(100vw - var(--space-8));
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    display: flex; flex-direction: column; overflow: hidden;
    animation: modalEntrar 180ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes modalEntrar {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }

  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--space-3) var(--space-4) var(--space-3) var(--space-5);
    background: var(--bg-secondary); border-bottom: 1px solid var(--border);
  }
  .modal-header-inner { display: flex; align-items: center; gap: var(--space-2); }
  .modal-label { font-size: var(--text-xs); color: var(--text-muted); font-weight: 500; }
  .modal-area-badge { font-size: var(--text-xs); font-weight: 600; opacity: 0.8; }

  .btn-fechar {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-size: 18px; line-height: 1;
    width: 24px; height: 24px;
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-sm); transition: all var(--transition-fast);
  }
  .btn-fechar:hover { background: var(--bg-hover); color: var(--text-primary); }

  .modal-corpo {
    padding: var(--space-5);
    display: flex; flex-direction: column; gap: var(--space-4);
  }

  .campo-titulo { display: flex; flex-direction: column; gap: var(--space-1); }

  .input-titulo {
    border: none; border-bottom: 1px solid var(--border); border-radius: 0;
    padding-bottom: var(--space-3);
    font-size: var(--text-xl); font-family: var(--font-body); font-weight: 500;
    color: var(--text-primary); background: transparent; outline: none; width: 100%;
    transition: border-color var(--transition-fast);
  }
  .input-titulo:focus { border-bottom-color: var(--text-primary); }
  .input-titulo:disabled { opacity: 0.6; cursor: not-allowed; }
  .input-titulo::placeholder { color: var(--text-disabled); font-weight: 400; }

  .msg-erro { font-size: var(--text-xs); color: var(--status-danger); font-weight: 500; }

  .campos-tempo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
    align-items: end;
  }

  .campos-extra {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .campo-detalhe { display: flex; flex-direction: column; gap: 4px; }
  .campo-detalhe--full { grid-column: span 1; }

  label {
    font-size: var(--text-xs); color: var(--text-muted); font-weight: 500;
  }

  .label-check {
    display: flex; align-items: center; gap: var(--space-2);
    font-size: var(--text-xs); color: var(--text-secondary);
    cursor: pointer; grid-column: span 2;
  }

  .input-detalhe, select.input-detalhe {
    border: 1px solid var(--border); border-radius: var(--radius-md);
    padding: 6px 10px; font-size: var(--text-sm);
    font-family: var(--font-body); color: var(--text-primary);
    background: var(--bg-secondary); outline: none;
    transition: border-color var(--transition-fast); width: 100%;
  }
  .input-detalhe:focus { border-color: var(--text-primary); background: var(--bg); }
  .input-detalhe:disabled { opacity: 0.5; cursor: not-allowed; }

  .input-desc {
    border: 1px solid var(--border); border-radius: var(--radius-md);
    padding: var(--space-3); font-size: var(--text-sm);
    font-family: var(--font-body); color: var(--text-primary);
    background: var(--bg-secondary); outline: none; resize: vertical;
    min-height: 60px; transition: border-color var(--transition-fast); width: 100%;
  }
  .input-desc:focus { border-color: var(--text-primary); background: var(--bg); }

  .aviso-tarefa {
    font-size: var(--text-xs); color: var(--text-muted);
    background: var(--bg-secondary); border-radius: var(--radius-md);
    padding: var(--space-3); line-height: 1.5;
  }

  .modal-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--space-3) var(--space-5); border-top: 1px solid var(--border); gap: var(--space-3);
  }
  .footer-esquerda { display: flex; align-items: center; }
  .footer-direita  { display: flex; align-items: center; gap: var(--space-2); }

  .hint { font-size: var(--text-xs); color: var(--text-disabled); }

  .btn-deletar {
    background: none; border: none; cursor: pointer;
    font-size: var(--text-xs); color: var(--status-danger);
    font-family: var(--font-body); font-weight: 500;
    padding: 6px 10px; border-radius: var(--radius-md);
    transition: all var(--transition-fast); opacity: 0.7;
  }
  .btn-deletar:hover { opacity: 1; background: #fef2f2; }

  .btn-cancelar {
    background: none; border: 1px solid var(--border); color: var(--text-secondary);
    border-radius: var(--radius-md); padding: 7px 14px;
    font-size: var(--text-sm); font-family: var(--font-body); cursor: pointer;
    transition: all var(--transition-fast);
  }
  .btn-cancelar:hover { background: var(--bg-hover); }

  .btn-salvar {
    color: var(--bg); border: none; border-radius: var(--radius-md);
    padding: 7px 16px; font-size: var(--text-sm);
    font-family: var(--font-body); font-weight: 500; cursor: pointer;
    transition: opacity var(--transition-fast);
  }
  .btn-salvar:hover:not(:disabled) { opacity: 0.85; }
  .btn-salvar:disabled { opacity: 0.35; cursor: not-allowed; }
</style>
```

---

## atualizar stores/ui.js

```javascript
// src/lib/stores/ui.js — versao fase 4
import { writable } from 'svelte/store';

export const sidebarCollapsed = writable(false);
export const activeModal      = writable(null);
export const tarefaEditando   = writable(null);
export const eventoEditando   = writable(null); // novo
export const painelVisivel    = writable(true); // novo
```

## ativar calendario na sidebar

```javascript
// Sidebar.svelte — mudar active para true no calendario:
{ id: 'calendario', label: 'calendario', icon: Calendar, active: true },
```

---

## estrutura de pastas — novos arquivos da fase 4

```
src/
├── lib/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.svelte        ← novo
│   │   │   └── PainelLateral.svelte   ← novo
│   │   └── calendario/                ← pasta nova
│   │       ├── GridSemanal.svelte
│   │       ├── GridMensal.svelte
│   │       ├── MiniCalendario.svelte
│   │       ├── ProximosEventos.svelte
│   │       └── ModalEvento.svelte
│   ├── stores/
│   │   └── calendario.js              ← novo
│   └── db/
│       └── queries/
│           └── eventos.js             ← novo
└── routes/
    └── Calendario.svelte              ← novo
```

---

## criterios de conclusao da fase 4

**correcao do erro ao salvar**
- [ ] o console exibe o erro real ao inves da mensagem generica
- [ ] tarefa com area_id nulo salva sem erro de foreign key
- [ ] tarefa com area selecionada salva sem erro de tipo
- [ ] o modal nao abre se o banco ainda nao inicializou
- [ ] a tela de loading aparece enquanto o banco carrega

**layout**
- [ ] paginas nao tem mais max-width fixo — conteudo usa o espaco disponivel
- [ ] painel lateral de 320px aparece no dashboard e nas tarefas
- [ ] painel some automaticamente em janelas menores que 1100px
- [ ] mini calendario aparece no painel lateral com mes atual
- [ ] proximos eventos aparecem no painel lateral abaixo do mini calendario
- [ ] modulo de calendario nao exibe o painel lateral (tem seu proprio layout)

**modal de tarefas refinado**
- [ ] header tem fundo bg-secondary separando contexto do conteudo
- [ ] campo de titulo tem linha inferior sutil no lugar de borda completa
- [ ] chip de prioridade muda de cor quando prioridade e alta ou critica
- [ ] chip de area mostra a cor da area quando selecionada
- [ ] botao salvar usa a cor da area selecionada
- [ ] secao de detalhes expande com transicao suave (sem salto)

**calendario — view propria**
- [ ] sidebar navega para o calendario ao clicar
- [ ] toggle semana/mes alterna entre os dois grids
- [ ] grid semanal exibe os 7 dias da semana atual com horas
- [ ] grid mensal exibe os 42 dias (6 semanas) do mes atual
- [ ] dia de hoje tem destaque visual em ambos os grids
- [ ] navegar para periodo anterior e proximo funciona
- [ ] botao "hoje" volta para a semana/mes atual
- [ ] clicar numa celula vazia abre o modal pre-preenchido com data e hora
- [ ] eventos aparecem posicionados corretamente no grid semanal
- [ ] eventos aparecem como chips no grid mensal (max 3 + contador)
- [ ] clicar num evento abre o modal de edicao preenchido
- [ ] criar evento salva e aparece imediatamente no grid
- [ ] deletar evento remove e atualiza o grid

**calendario — tarefas como eventos**
- [ ] tarefa com hora_prevista aparece automaticamente no calendario
- [ ] tarefa-evento tem indicador visual distinto (prefixo ou estilo diferente)
- [ ] clicar numa tarefa-evento abre o modal com aviso de que e uma tarefa
- [ ] tarefa-evento nao pode ser editada diretamente no modal de evento

**mini calendario no painel lateral**
- [ ] mini calendario exibe o mes atual corretamente
- [ ] clicar em um dia atualiza a dataReferencia do calendario
- [ ] navegar entre meses no mini calendario funciona
- [ ] dia selecionado tem destaque visual

**geral**
- [ ] todo texto visivel em letras minusculas
- [ ] nenhum valor hard-coded nos componentes

---

## o que nao entra na fase 4

- arrastar eventos para mudar horario no grid
- eventos de dia inteiro com exibicao dedicada no topo do grid
- recorrencia de eventos
- sincronizacao com google calendar
- notificacoes de eventos proximos
- selecao multipla de dias no mini calendario
- modulos de metas, habitos, financas

---

## ordem de implementacao sugerida

1. expor e corrigir o erro de salvar tarefa — testar antes de continuar
2. adicionar `migration_004_eventos` ao `migrations.js`
3. criar `src/lib/db/queries/eventos.js`
4. criar `src/lib/stores/calendario.js`
5. atualizar `src/lib/utils/dates.js` com funcoes de calendario
6. atualizar `src/lib/stores/ui.js` com `eventoEditando` e `painelVisivel`
7. criar `AppShell.svelte` com layout de duas colunas
8. criar `PainelLateral.svelte`
9. criar `MiniCalendario.svelte`
10. criar `ProximosEventos.svelte`
11. atualizar `App.svelte` para usar `AppShell`
12. aplicar refinamentos visuais no `ModalTarefa.svelte`
13. criar `GridSemanal.svelte`
14. criar `GridMensal.svelte`
15. criar `ModalEvento.svelte`
16. criar `src/routes/Calendario.svelte`
17. ativar rota no `App.svelte` e item na `Sidebar.svelte`
18. testar fluxo completo: criar evento > ver no grid > editar > deletar
19. testar tarefas com hora aparecendo automaticamente no calendario
20. verificar checklist completo

---

nexus — fase 4 | referencia de desenvolvimento
proxima fase: fase 5 — modulo de metas com hierarquia temporal e progresso calculado