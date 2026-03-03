# nexus — fase 2: dashboard vivo

documento de referencia completo para construcao da fase 2 do app nexus.
este arquivo assume que a fase 1 foi concluida e todos os seus criterios foram atendidos.

---

## objetivo da fase 2

transformar o dashboard de placeholder em tela funcional com dados reais.

ao final desta fase, abrir o nexus pela manha ja deve responder a pergunta central do app:

> **"o que eu preciso saber e fazer agora?"**

isso e alcancado com tres elementos trabalhando juntos: o bloco diretivo que te orienta, as tarefas que alimentam os dados, e a navegacao temporal que muda o contexto da tela inteira.

---

## o que entra na fase 2

1. crud completo de tarefas (a fonte de dados principal)
2. bloco diretivo (analisa e fala diretamente com o usuario)
3. cards do dashboard (tarefas por enquanto, outros modulos aparecem vazios)
4. navegacao temporal com dados reais (dia, semana, mes, trimestre, semestre, ano)
5. estados vazios com utilidade
6. utilitarios de data (base reutilizavel para todos os modulos futuros)

---

## convencoes — lembrete obrigatorio

as mesmas da fase 1. nao mudam nunca:

- **todo texto visivel ao usuario em letras minusculas, sem excecao**
- nada hard-coded nos componentes — tudo via variaveis css
- sql em snake_case, js/svelte em camelCase

---

## schema do banco — fase 2

a fase 2 adiciona a tabela de tarefas ao banco. ela e projetada para crescer nas fases seguintes sem precisar de migracao destrutiva.

### migration_003_tarefas

```sql
create table if not exists tarefas (
  id              integer primary key autoincrement,

  -- conteudo
  titulo          text    not null,
  descricao       text,

  -- classificacao
  area_id         integer references areas_de_vida(id) on delete set null,
  prioridade      text    not null default 'media'
                  check(prioridade in ('critica', 'alta', 'media', 'baixa')),
  status          text    not null default 'pendente'
                  check(status in ('pendente', 'em_progresso', 'concluida', 'cancelada')),

  -- tempo
  data_prevista   text,   -- ISO 8601: 'YYYY-MM-DD'
  hora_prevista   text,   -- 'HH:MM', opcional
  data_conclusao  text,   -- preenchido automaticamente ao concluir

  -- conexoes futuras (nulos por enquanto, usados nas fases seguintes)
  meta_id         integer references metas(id) on delete set null,
  valor           real,   -- custo ou receita vinculada

  -- recorrencia (implementada em fase futura, colunas ja existem)
  recorrente      integer not null default 0,
  recorrencia_tipo text   check(recorrencia_tipo in ('diaria','semanal','mensal') or recorrencia_tipo is null),

  -- metadados
  criado_em       text    not null default (datetime('now')),
  atualizado_em   text    not null default (datetime('now'))
);

-- indices para as queries mais comuns
create index if not exists idx_tarefas_data     on tarefas(data_prevista);
create index if not exists idx_tarefas_status   on tarefas(status);
create index if not exists idx_tarefas_area     on tarefas(area_id);
create index if not exists idx_tarefas_prioridade on tarefas(prioridade);
```

adicionar ao `migrations.js` apos `migration_002_config`:

```javascript
async function migration_003_tarefas(db) {
  await db.execute(`
    create table if not exists tarefas (
      id               integer primary key autoincrement,
      titulo           text    not null,
      descricao        text,
      area_id          integer references areas_de_vida(id) on delete set null,
      prioridade       text    not null default 'media'
                       check(prioridade in ('critica', 'alta', 'media', 'baixa')),
      status           text    not null default 'pendente'
                       check(status in ('pendente', 'em_progresso', 'concluida', 'cancelada')),
      data_prevista    text,
      hora_prevista    text,
      data_conclusao   text,
      meta_id          integer,
      valor            real,
      recorrente       integer not null default 0,
      recorrencia_tipo text,
      criado_em        text    not null default (datetime('now')),
      atualizado_em    text    not null default (datetime('now'))
    )
  `);

  await db.execute(`create index if not exists idx_tarefas_data      on tarefas(data_prevista)`);
  await db.execute(`create index if not exists idx_tarefas_status    on tarefas(status)`);
  await db.execute(`create index if not exists idx_tarefas_area      on tarefas(area_id)`);
  await db.execute(`create index if not exists idx_tarefas_prioridade on tarefas(prioridade)`);
}
```

---

## queries de tarefas

todas as queries ficam em `src/lib/db/queries/tarefas.js`.
nenhum componente acessa o banco diretamente — sempre via este arquivo.

```javascript
// src/lib/db/queries/tarefas.js
import { getDb } from '../client.js';

// ── leitura ───────────────────────────────────────────────────────────────────

// busca tarefas de um dia especifico
export async function getTarefasDoDia(data) {
  const db = getDb();
  return db.select(`
    select t.*, a.nome as area_nome, a.cor as area_cor
    from tarefas t
    left join areas_de_vida a on t.area_id = a.id
    where t.data_prevista = ?
    and t.status != 'cancelada'
    order by
      case t.prioridade
        when 'critica' then 1
        when 'alta'    then 2
        when 'media'   then 3
        when 'baixa'   then 4
      end,
      t.hora_prevista asc nulls last,
      t.criado_em asc
  `, [data]);
}

// busca tarefas de um intervalo de datas
export async function getTarefasDoIntervalo(dataInicio, dataFim) {
  const db = getDb();
  return db.select(`
    select t.*, a.nome as area_nome, a.cor as area_cor
    from tarefas t
    left join areas_de_vida a on t.area_id = a.id
    where t.data_prevista between ? and ?
    and t.status != 'cancelada'
    order by t.data_prevista asc,
      case t.prioridade
        when 'critica' then 1
        when 'alta'    then 2
        when 'media'   then 3
        when 'baixa'   then 4
      end
  `, [dataInicio, dataFim]);
}

// busca tarefas atrasadas (data passada, nao concluidas)
export async function getTarefasAtrasadas(hoje) {
  const db = getDb();
  return db.select(`
    select t.*, a.nome as area_nome, a.cor as area_cor
    from tarefas t
    left join areas_de_vida a on t.area_id = a.id
    where t.data_prevista < ?
    and t.status in ('pendente', 'em_progresso')
    order by t.data_prevista asc
  `, [hoje]);
}

// estatisticas para o bloco diretivo
export async function getEstatisticasDoDia(data) {
  const db = getDb();
  const [stats] = await db.select(`
    select
      count(*) as total,
      sum(case when status = 'concluida' then 1 else 0 end) as concluidas,
      sum(case when status in ('pendente','em_progresso') then 1 else 0 end) as pendentes,
      sum(case when prioridade in ('critica','alta') and status != 'concluida' then 1 else 0 end) as alta_prioridade
    from tarefas
    where data_prevista = ?
    and status != 'cancelada'
  `, [data]);
  return stats;
}

// ── escrita ───────────────────────────────────────────────────────────────────

export async function criarTarefa(tarefa) {
  const db = getDb();
  const result = await db.execute(`
    insert into tarefas (titulo, descricao, area_id, prioridade, data_prevista, hora_prevista)
    values (?, ?, ?, ?, ?, ?)
  `, [
    tarefa.titulo,
    tarefa.descricao ?? null,
    tarefa.areaId    ?? null,
    tarefa.prioridade ?? 'media',
    tarefa.dataPrevista ?? null,
    tarefa.horaPrevista ?? null,
  ]);
  return result.lastInsertId;
}

export async function atualizarTarefa(id, campos) {
  const db = getDb();
  const sets = [];
  const valores = [];

  if (campos.titulo       !== undefined) { sets.push('titulo = ?');        valores.push(campos.titulo); }
  if (campos.descricao    !== undefined) { sets.push('descricao = ?');     valores.push(campos.descricao); }
  if (campos.areaId       !== undefined) { sets.push('area_id = ?');       valores.push(campos.areaId); }
  if (campos.prioridade   !== undefined) { sets.push('prioridade = ?');    valores.push(campos.prioridade); }
  if (campos.status       !== undefined) { sets.push('status = ?');        valores.push(campos.status); }
  if (campos.dataPrevista !== undefined) { sets.push('data_prevista = ?'); valores.push(campos.dataPrevista); }
  if (campos.horaPrevista !== undefined) { sets.push('hora_prevista = ?'); valores.push(campos.horaPrevista); }

  sets.push("atualizado_em = datetime('now')");
  valores.push(id);

  await db.execute(
    `update tarefas set ${sets.join(', ')} where id = ?`,
    valores
  );
}

export async function concluirTarefa(id) {
  const db = getDb();
  await db.execute(`
    update tarefas
    set status = 'concluida',
        data_conclusao = date('now'),
        atualizado_em = datetime('now')
    where id = ?
  `, [id]);
}

export async function reabrirTarefa(id) {
  const db = getDb();
  await db.execute(`
    update tarefas
    set status = 'pendente',
        data_conclusao = null,
        atualizado_em = datetime('now')
    where id = ?
  `, [id]);
}

export async function deletarTarefa(id) {
  const db = getDb();
  await db.execute('delete from tarefas where id = ?', [id]);
}
```

---

## utilitarios de data

este arquivo e a base de toda logica temporal do nexus.
e reutilizado por todos os modulos nas fases seguintes.

```javascript
// src/lib/utils/dates.js

// retorna hoje no formato ISO 'YYYY-MM-DD'
export function hoje() {
  return new Date().toISOString().slice(0, 10);
}

// formata uma data ISO para exibicao
// ex: '2026-03-01' -> 'domingo, 1 de marco'
export function formatarData(iso, opcoes = {}) {
  if (!iso) return '';
  const [ano, mes, dia] = iso.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);

  if (opcoes.curto) {
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  }
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
}

// retorna o label amigavel para uma data em relacao a hoje
// ex: 'hoje', 'amanha', 'ontem', '15 de marco'
export function labelRelativo(iso) {
  if (!iso) return '';
  const h = hoje();
  if (iso === h) return 'hoje';

  const [ah, mh, dh] = h.split('-').map(Number);
  const [ai, mi, di] = iso.split('-').map(Number);
  const diffMs = new Date(ai, mi-1, di) - new Date(ah, mh-1, dh);
  const diffDias = Math.round(diffMs / 86400000);

  if (diffDias === 1)  return 'amanha';
  if (diffDias === -1) return 'ontem';
  if (diffDias > 1 && diffDias <= 6) {
    return new Date(ai, mi-1, di).toLocaleDateString('pt-BR', { weekday: 'long' });
  }
  return formatarData(iso, { curto: true });
}

// retorna o intervalo ISO de datas para cada tab temporal
// base: data ISO de referencia (geralmente hoje)
export function getIntervalo(tab, base) {
  const [ano, mes, dia] = base.split('-').map(Number);
  const ref = new Date(ano, mes - 1, dia);

  switch (tab) {
    case 'dia':
      return { inicio: base, fim: base };

    case 'semana': {
      const diaSemana = ref.getDay(); // 0 = domingo
      const inicioSemana = new Date(ref);
      inicioSemana.setDate(ref.getDate() - diaSemana);
      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(inicioSemana.getDate() + 6);
      return {
        inicio: toISO(inicioSemana),
        fim:    toISO(fimSemana)
      };
    }

    case 'mes': {
      const inicioMes = new Date(ano, mes - 1, 1);
      const fimMes    = new Date(ano, mes, 0);
      return {
        inicio: toISO(inicioMes),
        fim:    toISO(fimMes)
      };
    }

    case 'trimestre': {
      const trimestre   = Math.floor((mes - 1) / 3);
      const inicioTrim  = new Date(ano, trimestre * 3, 1);
      const fimTrim     = new Date(ano, trimestre * 3 + 3, 0);
      return {
        inicio: toISO(inicioTrim),
        fim:    toISO(fimTrim)
      };
    }

    case 'semestre': {
      const semestre   = mes <= 6 ? 0 : 1;
      const inicioSem  = new Date(ano, semestre * 6, 1);
      const fimSem     = new Date(ano, semestre * 6 + 6, 0);
      return {
        inicio: toISO(inicioSem),
        fim:    toISO(fimSem)
      };
    }

    case 'ano':
      return {
        inicio: `${ano}-01-01`,
        fim:    `${ano}-12-31`
      };

    default:
      return { inicio: base, fim: base };
  }
}

// retorna o titulo do periodo para exibicao no dashboard
export function tituloPeriodo(tab, base) {
  const [ano, mes] = base.split('-').map(Number);
  const meses = ['janeiro','fevereiro','marco','abril','maio','junho',
                 'julho','agosto','setembro','outubro','novembro','dezembro'];

  switch (tab) {
    case 'dia':       return formatarData(base);
    case 'semana':    return `semana de ${formatarData(base, { curto: true })}`;
    case 'mes':       return `${meses[mes - 1]} de ${ano}`;
    case 'trimestre': return `${Math.floor((mes-1)/3)+1}o trimestre de ${ano}`;
    case 'semestre':  return `${mes <= 6 ? '1o' : '2o'} semestre de ${ano}`;
    case 'ano':       return `${ano}`;
    default:          return '';
  }
}

// helper interno
function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// retorna a saudacao correta baseada na hora atual
export function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return 'bom dia';
  if (hora < 18) return 'boa tarde';
  return 'boa noite';
}
```

---

## stores da fase 2

### store de tarefas

```javascript
// src/lib/stores/tarefas.js
import { writable, derived, get } from 'svelte/store';
import { activeTab } from './navigation.js';
import {
  getTarefasDoDia,
  getTarefasDoIntervalo,
  getTarefasAtrasadas,
  getEstatisticasDoDia,
} from '$lib/db/queries/tarefas.js';
import { hoje, getIntervalo } from '$lib/utils/dates.js';

export const tarefas        = writable([]);
export const tarefasAtrasadas = writable([]);
export const estatisticasDia  = writable(null);
export const carregando       = writable(false);

// carrega tarefas com base na tab temporal ativa
export async function carregarTarefas(tab) {
  carregando.set(true);
  try {
    const h = hoje();
    const { inicio, fim } = getIntervalo(tab, h);

    if (tab === 'dia') {
      const [lista, atrasadas, stats] = await Promise.all([
        getTarefasDoDia(h),
        getTarefasAtrasadas(h),
        getEstatisticasDoDia(h),
      ]);
      tarefas.set(lista);
      tarefasAtrasadas.set(atrasadas);
      estatisticasDia.set(stats);
    } else {
      const lista = await getTarefasDoIntervalo(inicio, fim);
      tarefas.set(lista);
      tarefasAtrasadas.set([]);
      estatisticasDia.set(null);
    }
  } finally {
    carregando.set(false);
  }
}
```

### store de ui expandida

```javascript
// src/lib/stores/ui.js — versao fase 2 (substitui o da fase 1)
import { writable } from 'svelte/store';

export const sidebarCollapsed = writable(false);
export const activeModal      = writable(null); // null | 'novaTarefa' | 'editarTarefa'
export const tarefaEditando   = writable(null); // objeto da tarefa sendo editada, ou null
```

---

## estrutura do dashboard — fase 2

```
┌──────────────────────────────────────────────────────────┐
│ [saudacao + titulo do periodo]     [botao nova tarefa]   │
│                                                          │
│ [tabs: dia | semana | mes | trimestre | semestre | ano]  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │  bloco diretivo                                      │ │
│ │  texto direto analisando o estado atual              │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌───────────────────┐  ┌───────────────────┐            │
│ │  card: tarefas    │  │  card: metas       │            │
│ │  (dados reais)    │  │  (estado vazio)    │            │
│ └───────────────────┘  └───────────────────┘            │
│                                                          │
│ ┌───────────────────┐  ┌───────────────────┐            │
│ │  card: habitos    │  │  card: financas    │            │
│ │  (estado vazio)   │  │  (estado vazio)    │            │
│ └───────────────────┘  └───────────────────┘            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

o grid de cards usa `display: grid` com `grid-template-columns: repeat(2, 1fr)`.
na tab "dia" os cards aparecem em 2 colunas.
nas tabs "mes" em diante o card de tarefas expande para largura total (colspan 2).

---

## componentes da fase 2

### src/routes/Dashboard.svelte

```svelte
<script>
  import { onMount } from 'svelte';
  import { activeTab } from '$lib/stores/navigation.js';
  import { tarefas, tarefasAtrasadas, estatisticasDia, carregando, carregarTarefas } from '$lib/stores/tarefas.js';
  import { activeModal } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';
  import { carregarAreas } from '$lib/db/queries/areas.js';
  import { saudacao, tituloPeriodo, hoje } from '$lib/utils/dates.js';

  import TemporalTabs from '$lib/components/layout/TemporalTabs.svelte';
  import BlocoDisretivo from '$lib/components/dashboard/BlocoDisretivo.svelte';
  import CardTarefas from '$lib/components/dashboard/CardTarefas.svelte';
  import CardVazio from '$lib/components/dashboard/CardVazio.svelte';
  import ModalTarefa from '$lib/components/tarefas/ModalTarefa.svelte';

  onMount(async () => {
    await carregarAreas();
    await carregarTarefas($activeTab);
  });

  // recarrega sempre que a tab muda
  $: carregarTarefas($activeTab);

  $: titulo = tituloPeriodo($activeTab, hoje());
  $: greeting = saudacao();
</script>

<div class="dashboard">
  <header class="dashboard-header">
    <div class="dashboard-title">
      <span class="eyebrow">{greeting}</span>
      <h1>{titulo}</h1>
    </div>
    <div class="dashboard-actions">
      <TemporalTabs />
      <button class="btn-primary" on:click={() => activeModal.set('novaTarefa')}>
        <span>+</span> nova tarefa
      </button>
    </div>
  </header>

  {#if $carregando}
    <div class="loading">carregando...</div>
  {:else}
    <BlocoDisretivo
      tarefas={$tarefas}
      atrasadas={$tarefasAtrasadas}
      stats={$estatisticasDia}
      tab={$activeTab}
    />

    <div class="cards-grid">
      <CardTarefas
        tarefas={$tarefas}
        atrasadas={$tarefasAtrasadas}
        tab={$activeTab}
      />
      <CardVazio modulo="metas"    icone="o" descricao="suas metas aparecem aqui" />
      <CardVazio modulo="habitos"  icone="~" descricao="seu progresso diario aparece aqui" />
      <CardVazio modulo="financas" icone="$" descricao="seu saldo e gastos aparecem aqui" />
    </div>
  {/if}
</div>

{#if $activeModal === 'novaTarefa' || $activeModal === 'editarTarefa'}
  <ModalTarefa on:fechar={() => activeModal.set(null)} on:salvo={() => carregarTarefas($activeTab)} />
{/if}

<style>
  .dashboard {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: var(--space-8);
    width: 100%;
    gap: var(--space-6);
  }

  .dashboard-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-4);
  }

  .dashboard-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-shrink: 0;
  }

  .eyebrow {
    display: block;
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin-bottom: var(--space-1);
    font-weight: 500;
  }

  h1 {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: 8px 14px;
    background: var(--text-primary);
    color: var(--bg);
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-family: var(--font-body);
    font-weight: 500;
    cursor: pointer;
    transition: opacity var(--transition-fast);
    white-space: nowrap;
  }
  .btn-primary:hover { opacity: 0.85; }

  .loading {
    font-size: var(--text-sm);
    color: var(--text-muted);
    padding: var(--space-8) 0;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
</style>
```

---

### src/lib/components/dashboard/BlocoDisretivo.svelte

o bloco diretivo e o elemento mais importante do dashboard.
ele nao mostra dados — ele **interpreta** os dados e fala diretamente com o usuario.

logica de geracao do texto (sem ia, regras simples):

```
se tem atrasadas > 0:
  → "voce tem {n} tarefa(s) atrasada(s). resolva isso antes de comecar o dia."

se alta_prioridade > 0 e concluidas == 0:
  → "nenhuma tarefa concluida ainda. {n} sao de alta prioridade."

se concluidas == total e total > 0:
  → "todas as tarefas do dia concluidas. voce pode planejar amanha."

se pendentes > 0 e concluidas > 0:
  → "{concluidas} de {total} tarefas concluidas. faltam {pendentes}."

se total == 0:
  → "nenhuma tarefa para hoje. adicione o que precisa ser feito."
```

```svelte
<!-- src/lib/components/dashboard/BlocoDisretivo.svelte -->
<script>
  export let tarefas   = [];
  export let atrasadas = [];
  export let stats     = null;
  export let tab       = 'dia';

  function gerarMensagem() {
    if (tab !== 'dia' || !stats) {
      const total = tarefas.length;
      const concluidas = tarefas.filter(t => t.status === 'concluida').length;
      const pendentes = total - concluidas;
      if (total === 0) return 'nenhuma tarefa neste periodo. adicione o que precisa ser feito.';
      if (pendentes === 0) return `todas as ${total} tarefas do periodo foram concluidas.`;
      return `${pendentes} tarefa${pendentes > 1 ? 's' : ''} pendente${pendentes > 1 ? 's' : ''} neste periodo. ${concluidas} ja ${concluidas === 1 ? 'foi concluida' : 'foram concluidas'}.`;
    }

    const { total, concluidas, pendentes, alta_prioridade } = stats;

    if (atrasadas.length > 0) {
      const n = atrasadas.length;
      return `voce tem ${n} tarefa${n > 1 ? 's' : ''} atrasada${n > 1 ? 's' : ''} de dias anteriores. resolva isso antes de comecar.`;
    }

    if (total === 0) {
      return 'nenhuma tarefa para hoje. adicione o que precisa ser feito.';
    }

    if (concluidas === total) {
      return 'todas as tarefas do dia foram concluidas. voce pode planejar amanha.';
    }

    if (concluidas === 0 && alta_prioridade > 0) {
      return `nenhuma tarefa concluida ainda. ${alta_prioridade} ${alta_prioridade === 1 ? 'e' : 'sao'} de alta prioridade — comece por ${alta_prioridade === 1 ? 'ela' : 'elas'}.`;
    }

    return `${concluidas} de ${total} ${total === 1 ? 'tarefa concluida' : 'tarefas concluidas'}. faltam ${pendentes}.`;
  }

  $: mensagem = gerarMensagem();
  $: temAtrasadas = atrasadas.length > 0;
  $: todasConcluidas = stats && stats.concluidas === stats.total && stats.total > 0;
</script>

<div class="bloco-diretivo" class:alerta={temAtrasadas} class:ok={todasConcluidas}>
  <div class="bloco-icone">
    {#if temAtrasadas}!
    {:else if todasConcluidas}✓
    {:else}→
    {/if}
  </div>
  <p class="bloco-texto">{mensagem}</p>
</div>

<style>
  .bloco-diretivo {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
    border-radius: var(--radius-lg);
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    transition: background var(--transition-base), border-color var(--transition-base);
  }

  .bloco-diretivo.alerta {
    background: #fff8f0;
    border-color: #fde8cc;
  }

  .bloco-diretivo.ok {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }

  .bloco-icone {
    font-size: var(--text-base);
    font-weight: 700;
    color: var(--text-muted);
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }

  .alerta .bloco-icone { color: #c2570a; }
  .ok .bloco-icone     { color: var(--status-ok); }

  .bloco-texto {
    font-size: var(--text-base);
    color: var(--text-primary);
    line-height: 1.5;
    font-weight: 400;
  }
</style>
```

---

### src/lib/components/dashboard/CardTarefas.svelte

```svelte
<!-- src/lib/components/dashboard/CardTarefas.svelte -->
<script>
  import { concluirTarefa, reabrirTarefa, deletarTarefa } from '$lib/db/queries/tarefas.js';
  import { activeModal, tarefaEditando } from '$lib/stores/ui.js';
  import { labelRelativo } from '$lib/utils/dates.js';
  import { createEventDispatcher } from 'svelte';

  export let tarefas   = [];
  export let atrasadas = [];
  export let tab       = 'dia';

  const dispatch = createEventDispatcher();

  const PRIORIDADE_COR = {
    critica: '#ef4444',
    alta:    '#f59e0b',
    media:   '#6b6b6b',
    baixa:   '#d4d2cc',
  };

  async function toggleConcluir(tarefa) {
    if (tarefa.status === 'concluida') {
      await reabrirTarefa(tarefa.id);
    } else {
      await concluirTarefa(tarefa.id);
    }
    dispatch('atualizar');
  }

  async function remover(id) {
    await deletarTarefa(id);
    dispatch('atualizar');
  }

  function editar(tarefa) {
    tarefaEditando.set(tarefa);
    activeModal.set('editarTarefa');
  }

  // na tab dia mostra atrasadas separadas antes das de hoje
  $: mostraAtrasadas = tab === 'dia' && atrasadas.length > 0;
  $: totalVisiveis = tarefas.length + atrasadas.length;
</script>

<div class="card card-tarefas">
  <div class="card-header">
    <h2 class="card-titulo">tarefas</h2>
    <span class="card-contador">
      {tarefas.filter(t => t.status !== 'concluida').length} pendentes
    </span>
  </div>

  {#if totalVisiveis === 0}
    <div class="card-vazio">
      <span class="vazio-icone">✓</span>
      <p>nenhuma tarefa para este periodo</p>
      <button class="btn-vazio" on:click={() => activeModal.set('novaTarefa')}>
        + adicionar tarefa
      </button>
    </div>

  {:else}
    {#if mostraAtrasadas}
      <div class="secao-label secao-label--alerta">atrasadas</div>
      {#each atrasadas as tarefa (tarefa.id)}
        <div class="tarefa-item tarefa-item--atrasada">
          <button class="tarefa-check" on:click={() => toggleConcluir(tarefa)}>
            <span class="check-box" />
          </button>
          <div class="tarefa-corpo" on:click={() => editar(tarefa)} on:keydown={() => {}}>
            <span class="tarefa-titulo">{tarefa.titulo}</span>
            <div class="tarefa-meta">
              <span class="tarefa-data atrasada">{labelRelativo(tarefa.data_prevista)}</span>
              {#if tarefa.area_nome}
                <span class="tarefa-area" style="color: {tarefa.area_cor}">{tarefa.area_nome}</span>
              {/if}
            </div>
          </div>
          <div class="tarefa-prioridade" style="background: {PRIORIDADE_COR[tarefa.prioridade]}" title={tarefa.prioridade} />
        </div>
      {/each}
    {/if}

    {#if tarefas.length > 0 && mostraAtrasadas}
      <div class="secao-label">hoje</div>
    {/if}

    {#each tarefas as tarefa (tarefa.id)}
      <div class="tarefa-item" class:concluida={tarefa.status === 'concluida'}>
        <button class="tarefa-check" on:click={() => toggleConcluir(tarefa)}>
          <span class="check-box" class:checked={tarefa.status === 'concluida'}>
            {#if tarefa.status === 'concluida'}✓{/if}
          </span>
        </button>
        <div class="tarefa-corpo" on:click={() => editar(tarefa)} on:keydown={() => {}}>
          <span class="tarefa-titulo">{tarefa.titulo}</span>
          <div class="tarefa-meta">
            {#if tarefa.hora_prevista}
              <span class="tarefa-hora">{tarefa.hora_prevista}</span>
            {/if}
            {#if tarefa.data_prevista && tab !== 'dia'}
              <span class="tarefa-data">{labelRelativo(tarefa.data_prevista)}</span>
            {/if}
            {#if tarefa.area_nome}
              <span class="tarefa-area" style="color: {tarefa.area_cor}">{tarefa.area_nome}</span>
            {/if}
          </div>
        </div>
        <div class="tarefa-prioridade" style="background: {PRIORIDADE_COR[tarefa.prioridade]}" title={tarefa.prioridade} />
      </div>
    {/each}
  {/if}

  <div class="card-footer">
    <button class="btn-link" on:click={() => activeModal.set('novaTarefa')}>+ nova tarefa</button>
  </div>
</div>

<style>
  .card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .card-tarefas { grid-column: span 1; }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--border);
  }

  .card-titulo {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .card-contador {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
  }

  .secao-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 600;
    padding: var(--space-3) var(--space-5) var(--space-1);
    letter-spacing: 0.4px;
  }

  .secao-label--alerta { color: #c2570a; }

  .tarefa-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 10px var(--space-5);
    transition: background var(--transition-fast);
    position: relative;
  }

  .tarefa-item:hover { background: var(--bg-hover); }
  .tarefa-item.concluida .tarefa-titulo { text-decoration: line-through; color: var(--text-muted); }
  .tarefa-item--atrasada { background: #fff8f0; }
  .tarefa-item--atrasada:hover { background: #fef0e0; }

  .tarefa-check {
    background: none; border: none; cursor: pointer;
    padding: 0; flex-shrink: 0; display: flex; align-items: center;
  }

  .check-box {
    width: 16px; height: 16px;
    border: 1.5px solid var(--border-strong);
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: var(--bg);
    transition: all var(--transition-fast);
  }

  .check-box.checked {
    background: var(--text-primary);
    border-color: var(--text-primary);
  }

  .tarefa-corpo {
    flex: 1;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .tarefa-titulo {
    font-size: var(--text-sm);
    color: var(--text-primary);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tarefa-meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .tarefa-hora, .tarefa-data, .tarefa-area {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 400;
  }

  .tarefa-data.atrasada { color: #c2570a; font-weight: 500; }

  .tarefa-prioridade {
    width: 6px; height: 6px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  .card-vazio {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    padding: var(--space-10) var(--space-5);
    color: var(--text-muted);
    flex: 1;
  }

  .vazio-icone { font-size: 24px; opacity: 0.3; }

  .btn-vazio {
    background: none; border: 1px solid var(--border); color: var(--text-secondary);
    border-radius: var(--radius-md); padding: 6px 14px;
    font-size: var(--text-sm); font-family: var(--font-body);
    cursor: pointer; transition: all var(--transition-fast);
  }
  .btn-vazio:hover { background: var(--bg-hover); border-color: var(--border-strong); }

  .card-footer {
    padding: var(--space-3) var(--space-5);
    border-top: 1px solid var(--border);
  }

  .btn-link {
    background: none; border: none; cursor: pointer;
    font-size: var(--text-sm); color: var(--text-muted);
    font-family: var(--font-body); padding: 0;
    transition: color var(--transition-fast);
  }
  .btn-link:hover { color: var(--text-primary); }
</style>
```

---

### src/lib/components/dashboard/CardVazio.svelte

usado para modulos que ainda nao tem dados proprios na fase 2.

```svelte
<!-- src/lib/components/dashboard/CardVazio.svelte -->
<script>
  export let modulo     = '';
  export let icone      = 'o';
  export let descricao  = '';
</script>

<div class="card card-vazio-modulo">
  <div class="card-header">
    <h2 class="card-titulo">{modulo}</h2>
  </div>
  <div class="vazio-corpo">
    <span class="vazio-icone">{icone}</span>
    <p class="vazio-desc">{descricao}</p>
    <span class="vazio-fase">disponivel em breve</span>
  </div>
</div>

<style>
  .card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    opacity: 0.6;
  }

  .card-header {
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--border);
  }

  .card-titulo {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .vazio-corpo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-8) var(--space-5);
    color: var(--text-muted);
  }

  .vazio-icone { font-size: 20px; opacity: 0.3; }
  .vazio-desc  { font-size: var(--text-sm); text-align: center; }
  .vazio-fase  { font-size: var(--text-xs); color: var(--text-disabled); }
</style>
```

---

### src/lib/components/tarefas/ModalTarefa.svelte

o modal de criacao e edicao de tarefas.
deve ser rapido de usar: abrir, digitar o titulo, pressionar enter, fechar.
campos avancados ficam visiveis mas opcionais.

```svelte
<!-- src/lib/components/tarefas/ModalTarefa.svelte -->
<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { activeModal, tarefaEditando } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';
  import { criarTarefa, atualizarTarefa } from '$lib/db/queries/tarefas.js';
  import { hoje } from '$lib/utils/dates.js';

  const dispatch = createEventDispatcher();

  let inputTitulo;

  // preenche com dados da tarefa sendo editada, ou valores padrao
  $: editando = $tarefaEditando;

  let titulo       = editando?.titulo       ?? '';
  let descricao    = editando?.descricao    ?? '';
  let areaId       = editando?.area_id      ?? null;
  let prioridade   = editando?.prioridade   ?? 'media';
  let dataPrevista = editando?.data_prevista ?? hoje();
  let horaPrevista = editando?.hora_prevista ?? '';

  let salvando = false;
  let erro     = '';

  onMount(() => {
    inputTitulo?.focus();
  });

  function fechar() {
    tarefaEditando.set(null);
    dispatch('fechar');
  }

  async function salvar() {
    if (!titulo.trim()) {
      erro = 'o titulo e obrigatorio';
      return;
    }
    salvando = true;
    erro = '';
    try {
      if (editando) {
        await atualizarTarefa(editando.id, {
          titulo: titulo.trim(),
          descricao: descricao.trim() || null,
          areaId: areaId || null,
          prioridade,
          dataPrevista: dataPrevista || null,
          horaPrevista: horaPrevista || null,
        });
      } else {
        await criarTarefa({
          titulo: titulo.trim(),
          descricao: descricao.trim() || null,
          areaId: areaId || null,
          prioridade,
          dataPrevista: dataPrevista || null,
          horaPrevista: horaPrevista || null,
        });
      }
      dispatch('salvo');
      fechar();
    } catch (e) {
      erro = 'erro ao salvar. tente novamente.';
    } finally {
      salvando = false;
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') fechar();
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) salvar();
  }

  const PRIORIDADES = [
    { valor: 'critica', label: 'critica'  },
    { valor: 'alta',    label: 'alta'     },
    { valor: 'media',   label: 'media'    },
    { valor: 'baixa',   label: 'baixa'    },
  ];
</script>

<svelte:window on:keydown={onKeydown} />

<!-- backdrop -->
<div class="backdrop" on:click={fechar} on:keydown={() => {}} />

<div class="modal" role="dialog" aria-modal="true">
  <div class="modal-header">
    <h2>{editando ? 'editar tarefa' : 'nova tarefa'}</h2>
    <button class="btn-fechar" on:click={fechar}>×</button>
  </div>

  <div class="modal-corpo">
    <!-- titulo (campo principal — recebe foco automatico) -->
    <div class="campo">
      <input
        bind:this={inputTitulo}
        bind:value={titulo}
        class="input-titulo"
        placeholder="o que precisa ser feito?"
        class:erro={!!erro}
      />
      {#if erro}<span class="msg-erro">{erro}</span>{/if}
    </div>

    <!-- descricao -->
    <div class="campo">
      <textarea
        bind:value={descricao}
        class="input-desc"
        placeholder="detalhes (opcional)"
        rows="2"
      />
    </div>

    <!-- linha de metadados -->
    <div class="campos-linha">
      <!-- data -->
      <div class="campo campo-inline">
        <label>data</label>
        <input type="date" bind:value={dataPrevista} class="input-field" />
      </div>

      <!-- hora -->
      <div class="campo campo-inline">
        <label>hora</label>
        <input type="time" bind:value={horaPrevista} class="input-field" />
      </div>

      <!-- prioridade -->
      <div class="campo campo-inline">
        <label>prioridade</label>
        <select bind:value={prioridade} class="input-field">
          {#each PRIORIDADES as p}
            <option value={p.valor}>{p.label}</option>
          {/each}
        </select>
      </div>

      <!-- area -->
      <div class="campo campo-inline">
        <label>area</label>
        <select bind:value={areaId} class="input-field">
          <option value={null}>sem area</option>
          {#each $areas as area}
            <option value={area.id}>{area.nome}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="modal-footer">
    <span class="hint">cmd+enter para salvar · esc para fechar</span>
    <div class="acoes">
      <button class="btn-cancelar" on:click={fechar}>cancelar</button>
      <button class="btn-salvar" on:click={salvar} disabled={salvando}>
        {salvando ? 'salvando...' : 'salvar'}
      </button>
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.3);
    z-index: 100;
    backdrop-filter: blur(2px);
    animation: fadeIn var(--transition-fast) ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .modal {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 101;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    width: 520px;
    max-width: calc(100vw - var(--space-8));
    display: flex;
    flex-direction: column;
    animation: slideUp 200ms ease;
  }

  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--border);
  }

  .modal-header h2 {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .btn-fechar {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-size: 20px; line-height: 1;
    width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-sm); transition: all var(--transition-fast);
  }
  .btn-fechar:hover { background: var(--bg-hover); color: var(--text-primary); }

  .modal-corpo {
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .campo { display: flex; flex-direction: column; gap: var(--space-1); }

  .input-titulo {
    border: none;
    font-size: var(--text-md);
    font-family: var(--font-body);
    color: var(--text-primary);
    background: transparent;
    outline: none;
    width: 100%;
    font-weight: 500;
  }
  .input-titulo::placeholder { color: var(--text-disabled); font-weight: 400; }
  .input-titulo.erro { color: var(--status-danger); }

  .msg-erro { font-size: var(--text-xs); color: var(--status-danger); }

  .input-desc {
    border: none; border-top: 1px solid var(--border);
    font-size: var(--text-sm); font-family: var(--font-body);
    color: var(--text-secondary); background: transparent;
    outline: none; width: 100%; resize: none;
    padding-top: var(--space-3);
  }
  .input-desc::placeholder { color: var(--text-disabled); }

  .campos-linha {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
    padding-top: var(--space-2);
    border-top: 1px solid var(--border);
  }

  .campo-inline { gap: 4px; }

  label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
  }

  .input-field {
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 6px 10px;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    color: var(--text-primary);
    background: var(--bg-secondary);
    outline: none;
    width: 100%;
    transition: border-color var(--transition-fast);
  }
  .input-field:focus { border-color: var(--text-primary); background: var(--bg); }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-5);
    border-top: 1px solid var(--border);
  }

  .hint { font-size: var(--text-xs); color: var(--text-disabled); }

  .acoes { display: flex; gap: var(--space-2); }

  .btn-cancelar {
    background: none; border: 1px solid var(--border);
    color: var(--text-secondary); border-radius: var(--radius-md);
    padding: 7px 14px; font-size: var(--text-sm);
    font-family: var(--font-body); cursor: pointer;
    transition: all var(--transition-fast);
  }
  .btn-cancelar:hover { background: var(--bg-hover); }

  .btn-salvar {
    background: var(--text-primary); color: var(--bg);
    border: none; border-radius: var(--radius-md);
    padding: 7px 16px; font-size: var(--text-sm);
    font-family: var(--font-body); font-weight: 500;
    cursor: pointer; transition: opacity var(--transition-fast);
  }
  .btn-salvar:hover:not(:disabled) { opacity: 0.85; }
  .btn-salvar:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
```

---

## queries de areas (complementar a fase 1)

```javascript
// src/lib/db/queries/areas.js
import { getDb } from '../client.js';
import { areas } from '$lib/stores/areas.js';

export async function carregarAreas() {
  const db = getDb();
  const lista = await db.select(
    'select * from areas_de_vida where ativa = 1 order by ordem asc'
  );
  areas.set(lista);
  return lista;
}
```

---

## atualizacoes de arquivos existentes

### migrations.js — adicionar migration_003

no final do arquivo `src/lib/db/migrations.js`, adicionar a chamada:

```javascript
// dentro de runMigrations(), apos migration_002_config:
await migration_003_tarefas(db);
```

e adicionar a funcao `migration_003_tarefas` conforme definida acima na secao de schema.

---

## estrutura de pastas — novos arquivos da fase 2

```
src/
├── lib/
│   ├── components/
│   │   ├── dashboard/              ← pasta nova
│   │   │   ├── BlocoDisretivo.svelte
│   │   │   ├── CardTarefas.svelte
│   │   │   └── CardVazio.svelte
│   │   └── tarefas/                ← pasta nova
│   │       └── ModalTarefa.svelte
│   ├── stores/
│   │   └── tarefas.js              ← arquivo novo
│   └── db/
│       └── queries/
│           ├── areas.js            ← arquivo novo (complementar)
│           └── tarefas.js          ← arquivo novo
└── utils/
    └── dates.js                    ← arquivo novo
```

---

## criterios de conclusao da fase 2

a fase 2 esta concluida quando todos os itens abaixo forem verdadeiros:

**dashboard**
- [ ] saudacao muda de acordo com o horario (bom dia / boa tarde / boa noite)
- [ ] titulo do periodo muda corretamente ao trocar de tab
- [ ] bloco diretivo exibe mensagem correta baseada no estado das tarefas
- [ ] bloco diretivo muda de aparencia quando ha atrasadas (tom de alerta)
- [ ] bloco diretivo muda de aparencia quando todas estao concluidas (tom positivo)
- [ ] cards aparecem em grid 2 colunas
- [ ] card de tarefas mostra dados reais
- [ ] cards de modulos futuros aparecem com estado vazio e opacidade reduzida

**tarefas**
- [ ] clicar em "nova tarefa" abre o modal
- [ ] modal foca automaticamente no campo de titulo ao abrir
- [ ] cmd+enter salva a tarefa
- [ ] esc fecha o modal sem salvar
- [ ] tarefa criada aparece imediatamente na lista sem precisar recarregar
- [ ] clicar no checkbox marca a tarefa como concluida (com risco no titulo)
- [ ] clicar novamente reabre a tarefa
- [ ] clicar no corpo da tarefa abre o modal de edicao preenchido
- [ ] tarefa atrasada (data passada, nao concluida) aparece na secao "atrasadas" com cor de alerta
- [ ] deletar tarefa funciona (pode ser via modal de edicao)
- [ ] tarefas sem area aparecem normalmente, sem erro

**navegacao temporal**
- [ ] tab "dia" mostra tarefas de hoje + atrasadas separadas
- [ ] tab "semana" mostra todas as tarefas da semana atual agrupadas
- [ ] tab "mes" mostra tarefas do mes atual
- [ ] tab "trimestre" mostra tarefas do trimestre atual
- [ ] tab "semestre" mostra tarefas do semestre atual
- [ ] tab "ano" mostra tarefas do ano atual
- [ ] bloco diretivo adapta o texto para o periodo selecionado
- [ ] a lista recarrega automaticamente ao trocar de tab (sem recarregar a pagina)

**banco de dados**
- [ ] tabela `tarefas` criada automaticamente na migration_003
- [ ] indices criados corretamente
- [ ] tarefas persistem apos fechar e reabrir o app
- [ ] nao ha erros de sql no console

**qualidade**
- [ ] todo texto visivel na interface em letras minusculas
- [ ] modal fecha ao clicar no backdrop
- [ ] animacao de entrada do modal e suave (nao brusca)
- [ ] estados de loading aparecem durante operacoes no banco
- [ ] nenhum crash ao usar o app com zero tarefas cadastradas

---

## o que nao entra na fase 2

- modulo de tarefas com pagina propria (lista completa, filtros, busca)
- modulo de calendario
- metas, habitos, financas com dados reais
- bloco diretivo com logica de habitos ou financas (sem dados ainda)
- recorrencia de tarefas (colunas ja existem no banco, logica vem depois)
- vincular tarefa a meta (coluna existe, ui vem depois)
- notificacoes
- backup
- dark mode

---

## ordem de implementacao sugerida

1. criar `src/lib/utils/dates.js` com todas as funcoes
2. adicionar `migration_003_tarefas` ao `migrations.js`
3. criar `src/lib/db/queries/areas.js`
4. criar `src/lib/db/queries/tarefas.js`
5. criar `src/lib/stores/tarefas.js`
6. atualizar `src/lib/stores/ui.js` com `tarefaEditando`
7. criar `BlocoDisretivo.svelte`
8. criar `CardVazio.svelte`
9. criar `CardTarefas.svelte`
10. criar `ModalTarefa.svelte`
11. atualizar `Dashboard.svelte` com a estrutura completa
12. testar o fluxo completo: criar > visualizar > concluir > editar > deletar tarefa
13. testar cada tab temporal com dados em datas diferentes
14. verificar checklist completo

---

nexus — fase 2 | referencia de desenvolvimento
proxima fase: fase 3 — modulo de calendario com grid semanal e mensal, eventos e conexao com tarefas