# nexus — fase 3: tarefas completas

documento de referencia completo para construcao da fase 3 do app nexus.
este arquivo assume que as fases 1 e 2 foram concluidas e todos os seus criterios foram atendidos.

---

## objetivo da fase 3

tres entregas independentes que juntas fazem o nexus se sentir um app maduro:

1. **comportamento de janela igual ao notion** — tamanho e posicao persistem entre sessoes
2. **modal corrigido e melhorado** — nasce centralizado, sem salto visual
3. **modulo de tarefas completo** — pagina propria com filtros, busca, agrupamento e acoes rapidas

---

## convencoes — lembrete obrigatorio

as mesmas das fases anteriores. nao mudam nunca:

- **todo texto visivel ao usuario em letras minusculas, sem excecao**
- nada hard-coded nos componentes — tudo via variaveis css
- sql em snake_case, js/svelte em camelCase

---

## entrega 1 — comportamento de janela

### o problema atual

a janela abre sempre com 1280x800 centralizada, independente do que o usuario fez na sessao anterior. isso quebra o fluxo de trabalho — o usuario redimensiona, reposiciona, fecha, reabre e tudo voltou ao inicio.

### como o notion resolve

o notion salva tamanho e posicao da janela localmente toda vez que o usuario a move ou redimensiona. na proxima abertura, a janela restaura exatamente onde estava. se os valores salvos forem invalidos (monitor desconectado, resolucao mudou), ele cai para um padrao seguro.

### implementacao no tauri

o tauri expoe eventos de janela que permitem capturar redimensionamento e movimento. os valores sao salvos na tabela `config` do sqlite que ja existe desde a fase 1.

#### valores padrao inteligentes

o tamanho padrao do nexus nao e fixo em pixels — e calculado com base no monitor disponivel, igual ao notion:

```
largura padrao  = 75% da largura do monitor (minimo 900px, maximo 1440px)
altura padrao   = 85% da altura do monitor  (minimo 600px, maximo 960px)
posicao padrao  = centralizada no monitor principal
```

isso garante que em qualquer resolucao — desde um notebook 1366x768 ate um ultrawide 3440x1440 — a janela abre num tamanho confortavel e legivel.

#### schema — novas entradas na tabela config

nao e necessaria uma migration nova. a tabela `config` ja existe e aceita chaves arbitrarias. adicionar no seed de `migration_002_config`:

```javascript
// adicionar aos defaults existentes em migration_002_config:
['window_width',  '0'],   // 0 = usar calculo automatico
['window_height', '0'],   // 0 = usar calculo automatico
['window_x',      ''],    // vazio = centralizar
['window_y',      ''],    // vazio = centralizar
['window_maximized', '0'],
```

#### codigo rust — src-tauri/src/main.rs

```rust
use tauri::{Manager, PhysicalPosition, PhysicalSize};

#[tauri::command]
async fn salvar_estado_janela(
    app: tauri::AppHandle,
    width: u32,
    height: u32,
    x: i32,
    y: i32,
    maximized: bool,
) -> Result<(), String> {
    // salva no sqlite via plugin-sql
    // a implementacao real usa o mesmo db da aplicacao
    // por simplicidade, usar tauri store plugin ou
    // passar para o frontend salvar via js
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            // restaurar tamanho e posicao ao iniciar
            // o frontend cuida disso via js apos carregar o db
            // (mais simples e ja tem acesso ao sqlite)

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![salvar_estado_janela])
        .run(tauri::generate_context!())
        .expect("erro ao iniciar o nexus");
}
```

#### codigo javascript — src/lib/utils/window.js

toda a logica de persistencia de janela fica aqui.
o frontend acessa a api do tauri para ler tamanho do monitor e ajustar a janela.

```javascript
// src/lib/utils/window.js
import { getCurrentWindow } from '@tauri-apps/api/window';
import { primaryMonitor } from '@tauri-apps/api/window';
import { getDb } from '$lib/db/client.js';

const CHAVES = {
  width:     'window_width',
  height:    'window_height',
  x:         'window_x',
  y:         'window_y',
  maximized: 'window_maximized',
};

// calcula o tamanho padrao baseado no monitor
async function calcularTamanhopadrao() {
  try {
    const monitor = await primaryMonitor();
    if (!monitor) return { width: 1280, height: 800 };

    const { width: mw, height: mh } = monitor.size;

    const width  = Math.min(Math.max(Math.round(mw * 0.75), 900),  1440);
    const height = Math.min(Math.max(Math.round(mh * 0.85), 600),  960);

    return { width, height };
  } catch {
    return { width: 1280, height: 800 };
  }
}

// lê os valores salvos do banco
async function lerEstadoSalvo() {
  const db = getDb();
  try {
    const rows = await db.select(
      `select chave, valor from config where chave in (?, ?, ?, ?, ?)`,
      Object.values(CHAVES)
    );
    const mapa = {};
    for (const row of rows) mapa[row.chave] = row.valor;
    return mapa;
  } catch {
    return {};
  }
}

// salva o estado atual no banco
async function salvarEstado(campos) {
  const db = getDb();
  for (const [chave, valor] of Object.entries(campos)) {
    await db.execute(
      `update config set valor = ?, updated_at = datetime('now') where chave = ?`,
      [String(valor), chave]
    );
  }
}

// aplica o estado salvo (ou padrao) na janela
// chamado uma vez no onMount do App.svelte
export async function restaurarJanela() {
  const win    = getCurrentWindow();
  const salvo  = await lerEstadoSalvo();
  const padrao = await calcularTamanhopadrao();

  const w = parseInt(salvo[CHAVES.width])  || padrao.width;
  const h = parseInt(salvo[CHAVES.height]) || padrao.height;
  const maximized = salvo[CHAVES.maximized] === '1';

  if (maximized) {
    await win.maximize();
    return;
  }

  // valida se as dimensoes salvas fazem sentido
  const widthValido  = w >= 900  && w <= 3840;
  const heightValido = h >= 600  && h <= 2160;

  const finalW = widthValido  ? w : padrao.width;
  const finalH = heightValido ? h : padrao.height;

  await win.setSize({ type: 'Physical', width: finalW, height: finalH });

  // posicao
  const x = parseInt(salvo[CHAVES.x]);
  const y = parseInt(salvo[CHAVES.y]);
  const posicaoValida = !isNaN(x) && !isNaN(y) && x >= 0 && y >= 0;

  if (posicaoValida) {
    await win.setPosition({ type: 'Physical', x, y });
  } else {
    await win.center();
  }
}

// inicia o listener que persiste mudancas
// chamado uma vez no onMount do App.svelte, apos restaurarJanela
export async function iniciarPersistenciaJanela() {
  const win = getCurrentWindow();

  let debounceTimer = null;

  async function persistir() {
    try {
      const maximized = await win.isMaximized();

      if (maximized) {
        await salvarEstado({ [CHAVES.maximized]: '1' });
        return;
      }

      const { width, height } = await win.innerSize();
      const { x, y }          = await win.outerPosition();

      await salvarEstado({
        [CHAVES.width]:     width,
        [CHAVES.height]:    height,
        [CHAVES.x]:         x,
        [CHAVES.y]:         y,
        [CHAVES.maximized]: '0',
      });
    } catch {
      // silencioso — nao travar o app por falha de persistencia
    }
  }

  function agendarPersistencia() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(persistir, 500); // debounce 500ms
  }

  // escuta redimensionamento e movimento
  await win.onResized(agendarPersistencia);
  await win.onMoved(agendarPersistencia);
}
```

#### integracao no App.svelte

```svelte
<!-- src/App.svelte — adicionar ao onMount existente -->
<script>
  import { restaurarJanela, iniciarPersistenciaJanela } from '$lib/utils/window.js';
  // ... imports existentes

  onMount(async () => {
    await initDb();
    await restaurarJanela();          // aplica tamanho/posicao salvo
    await iniciarPersistenciaJanela(); // começa a escutar mudancas
  });
</script>
```

#### tauri.conf.json — ajustes necessarios

```json
{
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "nexus",
        "width": 1280,
        "height": 800,
        "minWidth": 900,
        "minHeight": 600,
        "resizable": true,
        "decorations": true,
        "center": true,
        "visible": false
      }
    ]
  }
}
```

o campo `"visible": false` e importante — a janela nasce invisivel, o js aplica o tamanho e posicao corretos, e so entao a torna visivel. isso elimina o flash de posicao errada que aconteceria se a janela aparecesse antes do js rodar.

para mostrar a janela apos restaurar:

```javascript
// em restaurarJanela(), ao final:
const win = getCurrentWindow();
await win.show();
```

---

## entrega 2 — modal corrigido

### o problema

o modal atual usa `transform: translate(-50%, -50%)` com uma animacao `slideUp` que move o elemento de baixo para cima enquanto ele tambem esta sendo centralizado. isso causa o efeito de "nascer em qualquer lugar e se ajustar" — o elemento aparece deslocado por um frame antes de encontrar sua posicao final.

### a causa raiz

```css
/* o problema esta aqui — a animacao move Y enquanto o translate ja esta ativo */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }  /* conflito com translate(-50%,-50%) */
  to   { opacity: 1; transform: translateY(0); }     /* perde o centramelizacao */
}
```

quando o `transform` da animacao sobrescreve o `transform` do posicionamento, o modal perde a centralizacao por alguns frames.

### a correcao

separar posicionamento de animacao. o modal usa um wrapper para posicionamento fixo e o conteudo interno para a animacao:

```svelte
<!-- estrutura corrigida -->
<div class="modal-wrapper">      <!-- cuida SOMENTE do posicionamento -->
  <div class="modal-conteudo">   <!-- cuida SOMENTE da animacao e visual -->
    ...
  </div>
</div>
```

```css
/* wrapper: so posicionamento, sem animacao, sem transform */
.modal-wrapper {
  position: fixed;
  inset: 0;                      /* ocupa a tela toda */
  display: flex;
  align-items: center;           /* centraliza verticalmente */
  justify-content: center;       /* centraliza horizontalmente */
  z-index: 101;
  pointer-events: none;          /* o wrapper nao captura clicks */
}

/* conteudo: so animacao, sem posicionamento */
.modal-conteudo {
  pointer-events: all;           /* o conteudo captura clicks */
  width: 520px;
  max-width: calc(100vw - var(--space-8));
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  animation: modalEntrar 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* animacao: so opacidade e escala — sem movimento de posicao */
@keyframes modalEntrar {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### ModalTarefa.svelte — versao corrigida e melhorada

alem da correcao de posicionamento, o modal recebe melhorias de ux:

- campo de titulo ocupa toda a largura com fonte maior — e o foco principal
- campos secundarios ficam numa secao colapsavel "detalhes" — nao poluem o primeiro uso
- secao de detalhes abre automaticamente se a tarefa sendo editada ja tem esses campos preenchidos
- animacao de entrada suave sem salto

```svelte
<!-- src/lib/components/tarefas/ModalTarefa.svelte — versao fase 3 -->
<script>
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { activeModal, tarefaEditando } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';
  import { criarTarefa, atualizarTarefa, deletarTarefa } from '$lib/db/queries/tarefas.js';
  import { hoje } from '$lib/utils/dates.js';

  const dispatch = createEventDispatcher();

  let inputTitulo;
  let mostrarDetalhes = false;

  $: editando = $tarefaEditando;

  let titulo       = editando?.titulo        ?? '';
  let descricao    = editando?.descricao     ?? '';
  let areaId       = editando?.area_id       ?? null;
  let prioridade   = editando?.prioridade    ?? 'media';
  let dataPrevista = editando?.data_prevista ?? hoje();
  let horaPrevista = editando?.hora_prevista ?? '';

  // abre detalhes automaticamente se a tarefa editada ja tem campos preenchidos
  $: if (editando) {
    mostrarDetalhes = !!(editando.descricao || editando.area_id || editando.hora_prevista || editando.prioridade !== 'media');
  }

  let salvando  = false;
  let deletando = false;
  let erro      = '';

  onMount(async () => {
    await tick(); // garante que o dom renderizou
    inputTitulo?.focus();
  });

  function fechar() {
    tarefaEditando.set(null);
    dispatch('fechar');
  }

  async function salvar() {
    if (!titulo.trim()) {
      erro = 'o titulo e obrigatorio';
      inputTitulo?.focus();
      return;
    }
    salvando = true;
    erro = '';
    try {
      const dados = {
        titulo:       titulo.trim(),
        descricao:    descricao.trim() || null,
        areaId:       areaId || null,
        prioridade,
        dataPrevista: dataPrevista || null,
        horaPrevista: horaPrevista || null,
      };

      if (editando) {
        await atualizarTarefa(editando.id, dados);
      } else {
        await criarTarefa(dados);
      }

      dispatch('salvo');
      fechar();
    } catch (e) {
      erro = 'erro ao salvar. tente novamente.';
    } finally {
      salvando = false;
    }
  }

  async function remover() {
    if (!editando) return;
    deletando = true;
    try {
      await deletarTarefa(editando.id);
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

  const PRIORIDADES = [
    { valor: 'critica', label: 'critica', cor: '#ef4444' },
    { valor: 'alta',    label: 'alta',    cor: '#f59e0b' },
    { valor: 'media',   label: 'media',   cor: '#9b9b9b' },
    { valor: 'baixa',   label: 'baixa',   cor: '#d4d2cc' },
  ];

  $: corPrioridade = PRIORIDADES.find(p => p.valor === prioridade)?.cor ?? '#9b9b9b';
</script>

<svelte:window on:keydown={onKeydown} />

<!-- backdrop separado do modal para nao interferir no posicionamento -->
<div
  class="backdrop"
  on:click={fechar}
  on:keydown={() => {}}
  role="presentation"
/>

<!-- wrapper cuida so do posicionamento -->
<div class="modal-wrapper" role="dialog" aria-modal="true">

  <!-- conteudo cuida so da animacao e visual -->
  <div class="modal-conteudo">

    <!-- header minimalista -->
    <div class="modal-header">
      <span class="modal-label">{editando ? 'editar tarefa' : 'nova tarefa'}</span>
      <button class="btn-fechar" on:click={fechar} aria-label="fechar">×</button>
    </div>

    <!-- corpo principal -->
    <div class="modal-corpo">

      <!-- titulo — campo principal, grande e dominante -->
      <div class="campo-titulo">
        <input
          bind:this={inputTitulo}
          bind:value={titulo}
          class="input-titulo"
          class:com-erro={!!erro}
          placeholder="o que precisa ser feito?"
          autocomplete="off"
        />
        {#if erro}
          <span class="msg-erro">{erro}</span>
        {/if}
      </div>

      <!-- linha de acoes rapidas — sempre visivel -->
      <div class="acoes-rapidas">

        <!-- data -->
        <div class="chip-campo">
          <span class="chip-icone">📅</span>
          <input
            type="date"
            bind:value={dataPrevista}
            class="chip-input"
          />
        </div>

        <!-- prioridade -->
        <div class="chip-campo">
          <span class="indicador-prioridade" style="background: {corPrioridade}" />
          <select bind:value={prioridade} class="chip-select">
            {#each PRIORIDADES as p}
              <option value={p.valor}>{p.label}</option>
            {/each}
          </select>
        </div>

        <!-- area -->
        <div class="chip-campo">
          <span class="chip-icone">◎</span>
          <select bind:value={areaId} class="chip-select">
            <option value={null}>sem area</option>
            {#each $areas as area}
              <option value={area.id}>{area.nome}</option>
            {/each}
          </select>
        </div>

        <!-- botao para mostrar/esconder detalhes -->
        <button
          class="btn-detalhes"
          on:click={() => mostrarDetalhes = !mostrarDetalhes}
        >
          {mostrarDetalhes ? 'menos' : 'mais detalhes'}
        </button>

      </div>

      <!-- detalhes opcionais — colapsavel -->
      {#if mostrarDetalhes}
        <div class="campos-detalhes">

          <!-- hora -->
          <div class="campo-detalhe">
            <label>hora</label>
            <input type="time" bind:value={horaPrevista} class="input-detalhe" />
          </div>

          <!-- descricao -->
          <div class="campo-detalhe campo-detalhe--full">
            <label>descricao</label>
            <textarea
              bind:value={descricao}
              class="input-desc"
              placeholder="detalhes adicionais (opcional)"
              rows="3"
            />
          </div>

        </div>
      {/if}

    </div>

    <!-- footer -->
    <div class="modal-footer">
      <div class="footer-esquerda">
        {#if editando}
          <button
            class="btn-deletar"
            on:click={remover}
            disabled={deletando}
          >
            {deletando ? 'removendo...' : 'remover tarefa'}
          </button>
        {/if}
      </div>

      <div class="footer-direita">
        <span class="hint">cmd+enter para salvar</span>
        <button class="btn-cancelar" on:click={fechar}>cancelar</button>
        <button
          class="btn-salvar"
          on:click={salvar}
          disabled={salvando || !titulo.trim()}
        >
          {salvando ? 'salvando...' : 'salvar'}
        </button>
      </div>
    </div>

  </div>
</div>

<style>
  /* ── backdrop ──────────────────────────────────────────── */
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    z-index: 100;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    animation: fadeIn 150ms ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── wrapper: so posicionamento ────────────────────────── */
  .modal-wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 101;
    pointer-events: none;
  }

  /* ── conteudo: so animacao e visual ────────────────────── */
  .modal-conteudo {
    pointer-events: all;
    width: 540px;
    max-width: calc(100vw - var(--space-8));
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: modalEntrar 180ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* animacao: so opacidade e escala — sem movimento de posicao */
  @keyframes modalEntrar {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1);    }
  }

  /* ── header ────────────────────────────────────────────── */
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4) var(--space-3) var(--space-5);
    border-bottom: 1px solid var(--border);
  }

  .modal-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .btn-fechar {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 18px;
    line-height: 1;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }
  .btn-fechar:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  /* ── corpo ─────────────────────────────────────────────── */
  .modal-corpo {
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  /* titulo */
  .campo-titulo { display: flex; flex-direction: column; gap: var(--space-1); }

  .input-titulo {
    border: none;
    font-size: var(--text-xl);
    font-family: var(--font-body);
    font-weight: 500;
    color: var(--text-primary);
    background: transparent;
    outline: none;
    width: 100%;
    line-height: 1.3;
  }
  .input-titulo::placeholder {
    color: var(--text-disabled);
    font-weight: 400;
  }
  .input-titulo.com-erro { color: var(--status-danger); }

  .msg-erro {
    font-size: var(--text-xs);
    color: var(--status-danger);
    font-weight: 500;
  }

  /* acoes rapidas */
  .acoes-rapidas {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .chip-campo {
    display: flex;
    align-items: center;
    gap: 5px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 4px 10px;
    cursor: pointer;
    transition: border-color var(--transition-fast);
  }
  .chip-campo:hover { border-color: var(--border-strong); }

  .chip-icone {
    font-size: 13px;
    line-height: 1;
    flex-shrink: 0;
  }

  .indicador-prioridade {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
    transition: background var(--transition-fast);
  }

  .chip-input,
  .chip-select {
    border: none;
    background: transparent;
    font-size: var(--text-xs);
    font-family: var(--font-body);
    color: var(--text-secondary);
    font-weight: 500;
    cursor: pointer;
    outline: none;
    padding: 0;
  }

  .btn-detalhes {
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-family: var(--font-body);
    font-weight: 500;
    padding: 4px 8px;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    margin-left: auto;
  }
  .btn-detalhes:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  /* detalhes */
  .campos-detalhes {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid var(--border);
    animation: expandir 150ms ease;
  }

  @keyframes expandir {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  .campo-detalhe {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .campo-detalhe--full { grid-column: span 2; }

  label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
  }

  .input-detalhe {
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 6px 10px;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    color: var(--text-primary);
    background: var(--bg-secondary);
    outline: none;
    transition: border-color var(--transition-fast);
  }
  .input-detalhe:focus {
    border-color: var(--text-primary);
    background: var(--bg);
  }

  .input-desc {
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-3);
    font-size: var(--text-sm);
    font-family: var(--font-body);
    color: var(--text-primary);
    background: var(--bg-secondary);
    outline: none;
    resize: vertical;
    min-height: 72px;
    transition: border-color var(--transition-fast);
    width: 100%;
  }
  .input-desc:focus {
    border-color: var(--text-primary);
    background: var(--bg);
  }
  .input-desc::placeholder { color: var(--text-disabled); }

  /* ── footer ────────────────────────────────────────────── */
  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-5);
    border-top: 1px solid var(--border);
    gap: var(--space-3);
  }

  .footer-esquerda { display: flex; align-items: center; }
  .footer-direita  { display: flex; align-items: center; gap: var(--space-2); }

  .hint {
    font-size: var(--text-xs);
    color: var(--text-disabled);
  }

  .btn-deletar {
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--text-xs);
    color: var(--status-danger);
    font-family: var(--font-body);
    font-weight: 500;
    padding: 6px 10px;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    opacity: 0.7;
  }
  .btn-deletar:hover { opacity: 1; background: #fef2f2; }
  .btn-deletar:disabled { opacity: 0.3; cursor: not-allowed; }

  .btn-cancelar {
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
  .btn-cancelar:hover { background: var(--bg-hover); }

  .btn-salvar {
    background: var(--text-primary);
    color: var(--bg);
    border: none;
    border-radius: var(--radius-md);
    padding: 7px 16px;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    font-weight: 500;
    cursor: pointer;
    transition: opacity var(--transition-fast);
  }
  .btn-salvar:hover:not(:disabled) { opacity: 0.85; }
  .btn-salvar:disabled { opacity: 0.35; cursor: not-allowed; }
</style>
```

---

## entrega 3 — modulo de tarefas completo

### pagina propria

acessada pela sidebar. url/rota: `tarefas`.

#### estrutura da tela

```
┌──────────────────────────────────────────────────────────┐
│ tarefas                             [+ nova tarefa]      │
│                                                          │
│ [tabs: dia | semana | mes | trimestre | semestre | ano]  │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ [busca]   [area ▾]  [prioridade ▾]  [status ▾]      │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│  atrasadas (3)                                           │
│  ─────────────                                           │
│  [ ] tarefa atrasada 1                      ontem  ●     │
│  [ ] tarefa atrasada 2              segunda-feira  ●     │
│                                                          │
│  hoje — segunda, 3 de marco                             │
│  ───────────────────────────                             │
│  [ ] tarefa de alta prioridade              10:00  ●     │
│  [✓] tarefa concluida                       14:00  ●     │
│  [ ] tarefa sem hora                               ●     │
│                                                          │
│  amanha                                                  │
│  ───────                                                 │
│  [ ] reuniao de equipe                      09:00  ●     │
│                                                          │
│  sem data (5)                                            │
│  ──────────                                              │
│  [ ] estudar rust                                  ●     │
│  [ ] organizar pasta de projetos                   ●     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### schema adicional — nenhum necessario

a tabela `tarefas` ja tem tudo que o modulo precisa. nenhuma migration nova para esta entrega.

### nova query — busca e filtros

adicionar em `src/lib/db/queries/tarefas.js`:

```javascript
// busca com filtros combinados
export async function buscarTarefas({ texto, areaId, prioridade, status, dataInicio, dataFim }) {
  const db = getDb();

  const condicoes = ["t.status != 'cancelada'"];
  const params    = [];

  if (texto) {
    condicoes.push("t.titulo like ?");
    params.push(`%${texto}%`);
  }
  if (areaId) {
    condicoes.push("t.area_id = ?");
    params.push(areaId);
  }
  if (prioridade) {
    condicoes.push("t.prioridade = ?");
    params.push(prioridade);
  }
  if (status) {
    condicoes.push("t.status = ?");
    params.push(status);
  }
  if (dataInicio && dataFim) {
    condicoes.push("(t.data_prevista between ? and ? or t.data_prevista is null)");
    params.push(dataInicio, dataFim);
  }

  const where = condicoes.length ? `where ${condicoes.join(' and ')}` : '';

  return db.select(`
    select t.*, a.nome as area_nome, a.cor as area_cor
    from tarefas t
    left join areas_de_vida a on t.area_id = a.id
    ${where}
    order by
      t.data_prevista asc nulls last,
      case t.prioridade
        when 'critica' then 1
        when 'alta'    then 2
        when 'media'   then 3
        when 'baixa'   then 4
      end,
      t.hora_prevista asc nulls last
  `, params);
}

// query para adiar tarefa
export async function adiarTarefa(id, novaData) {
  const db = getDb();
  await db.execute(`
    update tarefas
    set data_prevista = ?,
        status = case when status = 'concluida' then 'pendente' else status end,
        data_conclusao = null,
        atualizado_em = datetime('now')
    where id = ?
  `, [novaData, id]);
}
```

### src/lib/stores/tarefas.js — versao atualizada

```javascript
// src/lib/stores/tarefas.js — versao fase 3
import { writable } from 'svelte/store';
import {
  getTarefasDoDia,
  getTarefasDoIntervalo,
  getTarefasAtrasadas,
  getEstatisticasDoDia,
  buscarTarefas,
} from '$lib/db/queries/tarefas.js';
import { hoje, getIntervalo } from '$lib/utils/dates.js';

export const tarefas          = writable([]);
export const tarefasAtrasadas = writable([]);
export const tarefasSemData   = writable([]);
export const estatisticasDia  = writable(null);
export const carregando       = writable(false);

// filtros ativos
export const filtroTexto      = writable('');
export const filtroArea       = writable(null);
export const filtroPrioridade = writable(null);
export const filtroStatus     = writable(null);

export async function carregarTarefas(tab, filtros = {}) {
  carregando.set(true);
  try {
    const h              = hoje();
    const { inicio, fim } = getIntervalo(tab, h);
    const temFiltro      = filtros.texto || filtros.areaId || filtros.prioridade || filtros.status;

    if (temFiltro) {
      // com filtros ativos: busca global sem agrupar
      const resultado = await buscarTarefas({ ...filtros, dataInicio: inicio, dataFim: fim });
      tarefas.set(resultado.filter(t => t.data_prevista));
      tarefasSemData.set(resultado.filter(t => !t.data_prevista));
      tarefasAtrasadas.set([]);
      estatisticasDia.set(null);
      return;
    }

    if (tab === 'dia') {
      const [lista, atrasadas, stats, semData] = await Promise.all([
        getTarefasDoDia(h),
        getTarefasAtrasadas(h),
        getEstatisticasDoDia(h),
        buscarTarefas({ dataInicio: null, dataFim: null }),
      ]);
      tarefas.set(lista);
      tarefasAtrasadas.set(atrasadas);
      estatisticasDia.set(stats);
      tarefasSemData.set(semData.filter(t => !t.data_prevista));
    } else {
      const [lista, semData] = await Promise.all([
        getTarefasDoIntervalo(inicio, fim),
        buscarTarefas({ dataInicio: null, dataFim: null }),
      ]);
      tarefas.set(lista);
      tarefasAtrasadas.set([]);
      estatisticasDia.set(null);
      tarefasSemData.set(semData.filter(t => !t.data_prevista));
    }
  } finally {
    carregando.set(false);
  }
}
```

### src/routes/Tarefas.svelte

```svelte
<!-- src/routes/Tarefas.svelte -->
<script>
  import { onMount } from 'svelte';
  import { activeTab } from '$lib/stores/navigation.js';
  import {
    tarefas, tarefasAtrasadas, tarefasSemData,
    carregando, carregarTarefas,
    filtroTexto, filtroArea, filtroPrioridade
  } from '$lib/stores/tarefas.js';
  import { activeModal } from '$lib/stores/ui.js';
  import { areas } from '$lib/stores/areas.js';
  import { hoje, labelRelativo, getIntervalo, tituloPeriodo } from '$lib/utils/dates.js';
  import { concluirTarefa, reabrirTarefa, adiarTarefa } from '$lib/db/queries/tarefas.js';

  import TemporalTabs from '$lib/components/layout/TemporalTabs.svelte';
  import ModalTarefa from '$lib/components/tarefas/ModalTarefa.svelte';
  import ItemTarefa from '$lib/components/tarefas/ItemTarefa.svelte';
  import FiltrosBarra from '$lib/components/tarefas/FiltrosBarra.svelte';

  let buscaLocal = '';
  let debounceTimer;

  onMount(() => {
    carregarTarefas($activeTab);
  });

  $: carregarTarefas($activeTab, {
    texto: $filtroTexto,
    areaId: $filtroArea,
    prioridade: $filtroPrioridade,
  });

  // agrupa tarefas por data para exibicao
  $: grupos = agruparPorData($tarefas, $activeTab);

  function agruparPorData(lista, tab) {
    if (tab === 'dia') return []; // na tab dia nao precisa agrupar, so mostra a lista plana

    const mapa = new Map();
    for (const t of lista) {
      const key = t.data_prevista ?? '__sem_data';
      if (!mapa.has(key)) mapa.set(key, []);
      mapa.get(key).push(t);
    }

    return [...mapa.entries()]
      .sort(([a], [b]) => {
        if (a === '__sem_data') return 1;
        if (b === '__sem_data') return -1;
        return a.localeCompare(b);
      })
      .map(([data, itens]) => ({ data, itens }));
  }

  async function toggleConcluir(tarefa) {
    if (tarefa.status === 'concluida') {
      await reabrirTarefa(tarefa.id);
    } else {
      await concluirTarefa(tarefa.id);
    }
    carregarTarefas($activeTab);
  }

  $: temFiltroAtivo = $filtroTexto || $filtroArea || $filtroPrioridade;
  $: totalPendentes = $tarefas.filter(t => t.status !== 'concluida').length
                    + $tarefasAtrasadas.length;
</script>

<div class="tarefas-page">

  <!-- header -->
  <header class="page-header">
    <div class="page-title">
      <h1>tarefas</h1>
      {#if totalPendentes > 0}
        <span class="badge-contador">{totalPendentes}</span>
      {/if}
    </div>
    <div class="page-actions">
      <TemporalTabs />
      <button class="btn-primary" on:click={() => activeModal.set('novaTarefa')}>
        + nova tarefa
      </button>
    </div>
  </header>

  <!-- filtros -->
  <FiltrosBarra />

  <!-- lista -->
  {#if $carregando}
    <div class="estado-loading">carregando tarefas...</div>

  {:else if totalPendentes === 0 && $tarefas.length === 0 && $tarefasAtrasadas.length === 0 && $tarefasSemData.length === 0}
    <div class="estado-vazio">
      <span class="vazio-icone">✓</span>
      <p>nenhuma tarefa {temFiltroAtivo ? 'encontrada com esses filtros' : 'para este periodo'}</p>
      {#if !temFiltroAtivo}
        <button class="btn-ghost" on:click={() => activeModal.set('novaTarefa')}>
          + adicionar tarefa
        </button>
      {/if}
    </div>

  {:else}

    <!-- atrasadas (so aparece na tab dia) -->
    {#if $tarefasAtrasadas.length > 0 && $activeTab === 'dia'}
      <section class="grupo-tarefas grupo-atrasadas">
        <div class="grupo-header">
          <span class="grupo-titulo alerta">atrasadas</span>
          <span class="grupo-contador">{$tarefasAtrasadas.length}</span>
        </div>
        {#each $tarefasAtrasadas as tarefa (tarefa.id)}
          <ItemTarefa
            {tarefa}
            on:concluir={() => toggleConcluir(tarefa)}
            on:atualizar={() => carregarTarefas($activeTab)}
          />
        {/each}
      </section>
    {/if}

    <!-- tab dia: lista plana com header "hoje" -->
    {#if $activeTab === 'dia'}
      {#if $tarefas.length > 0}
        <section class="grupo-tarefas">
          <div class="grupo-header">
            <span class="grupo-titulo">hoje</span>
            <span class="grupo-contador">
              {$tarefas.filter(t => t.status !== 'concluida').length} pendentes
            </span>
          </div>
          {#each $tarefas as tarefa (tarefa.id)}
            <ItemTarefa
              {tarefa}
              on:concluir={() => toggleConcluir(tarefa)}
              on:atualizar={() => carregarTarefas($activeTab)}
            />
          {/each}
        </section>
      {/if}

    <!-- outras tabs: agrupado por data -->
    {:else}
      {#each grupos as grupo}
        <section class="grupo-tarefas">
          <div class="grupo-header">
            <span class="grupo-titulo">
              {grupo.data === '__sem_data' ? 'sem data' : labelRelativo(grupo.data)}
            </span>
            <span class="grupo-contador">
              {grupo.itens.filter(t => t.status !== 'concluida').length} pendentes
            </span>
          </div>
          {#each grupo.itens as tarefa (tarefa.id)}
            <ItemTarefa
              {tarefa}
              on:concluir={() => toggleConcluir(tarefa)}
              on:atualizar={() => carregarTarefas($activeTab)}
            />
          {/each}
        </section>
      {/each}
    {/if}

    <!-- sem data (todas as tabs) -->
    {#if $tarefasSemData.length > 0 && $activeTab === 'dia'}
      <section class="grupo-tarefas grupo-sem-data">
        <div class="grupo-header">
          <span class="grupo-titulo muted">sem data</span>
          <span class="grupo-contador">{$tarefasSemData.length}</span>
        </div>
        {#each $tarefasSemData as tarefa (tarefa.id)}
          <ItemTarefa
            {tarefa}
            on:concluir={() => toggleConcluir(tarefa)}
            on:atualizar={() => carregarTarefas($activeTab)}
          />
        {/each}
      </section>
    {/if}

  {/if}

</div>

{#if $activeModal === 'novaTarefa' || $activeModal === 'editarTarefa'}
  <ModalTarefa
    on:fechar={() => activeModal.set(null)}
    on:salvo={() => carregarTarefas($activeTab)}
  />
{/if}

<style>
  .tarefas-page {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: var(--space-8);
    width: 100%;
    gap: var(--space-5);
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
  }

  .page-title {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  h1 {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .badge-contador {
    background: var(--bg-active);
    color: var(--text-secondary);
    font-size: var(--text-xs);
    font-weight: 600;
    padding: 3px 8px;
    border-radius: var(--radius-full);
  }

  .page-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-shrink: 0;
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

  /* grupos */
  .grupo-tarefas {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .grupo-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) 0 var(--space-1);
    margin-bottom: var(--space-1);
    border-bottom: 1px solid var(--border);
  }

  .grupo-titulo {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
  }
  .grupo-titulo.alerta { color: #c2570a; }
  .grupo-titulo.muted  { color: var(--text-muted); }

  .grupo-contador {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .grupo-atrasadas .grupo-titulo { color: #c2570a; }

  /* estados */
  .estado-loading,
  .estado-vazio {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    padding: var(--space-12) 0;
    color: var(--text-muted);
    font-size: var(--text-sm);
  }

  .vazio-icone { font-size: 28px; opacity: 0.25; }

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
    margin-top: var(--space-2);
  }
  .btn-ghost:hover { background: var(--bg-hover); }
</style>
```

### src/lib/components/tarefas/ItemTarefa.svelte

o item da lista com hover actions — concluir, adiar, editar sem abrir modal completo.

```svelte
<!-- src/lib/components/tarefas/ItemTarefa.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import { activeModal, tarefaEditando } from '$lib/stores/ui.js';
  import { adiarTarefa } from '$lib/db/queries/tarefas.js';
  import { labelRelativo, hoje } from '$lib/utils/dates.js';

  export let tarefa;

  const dispatch = createEventDispatcher();

  const PRIORIDADE_COR = {
    critica: '#ef4444',
    alta:    '#f59e0b',
    media:   '#d4d2cc',
    baixa:   '#e9e8e4',
  };

  let mostrarAcoes = false;

  function editar() {
    tarefaEditando.set(tarefa);
    activeModal.set('editarTarefa');
  }

  async function adiarParaAmanha() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const amanha = d.toISOString().slice(0, 10);
    await adiarTarefa(tarefa.id, amanha);
    dispatch('atualizar');
  }

  async function adiarParaProximaSemana() {
    const d = new Date();
    const diaSemana = d.getDay();
    const diasAteSegunda = diaSemana === 0 ? 1 : 8 - diaSemana;
    d.setDate(d.getDate() + diasAteSegunda);
    await adiarTarefa(tarefa.id, d.toISOString().slice(0, 10));
    dispatch('atualizar');
  }

  $: atrasada = tarefa.data_prevista && tarefa.data_prevista < hoje() && tarefa.status !== 'concluida';
  $: corPrioridade = PRIORIDADE_COR[tarefa.prioridade] ?? PRIORIDADE_COR.media;
</script>

<div
  class="item-tarefa"
  class:concluida={tarefa.status === 'concluida'}
  class:atrasada
  on:mouseenter={() => mostrarAcoes = true}
  on:mouseleave={() => mostrarAcoes = false}
>
  <!-- checkbox -->
  <button
    class="check-btn"
    on:click={() => dispatch('concluir')}
    aria-label={tarefa.status === 'concluida' ? 'reabrir tarefa' : 'concluir tarefa'}
  >
    <span class="check-box" class:checked={tarefa.status === 'concluida'}>
      {#if tarefa.status === 'concluida'}✓{/if}
    </span>
  </button>

  <!-- corpo clicavel -->
  <div class="item-corpo" on:click={editar} on:keydown={() => {}} role="button" tabindex="0">
    <span class="item-titulo">{tarefa.titulo}</span>
    <div class="item-meta">
      {#if tarefa.hora_prevista}
        <span class="meta-chip">{tarefa.hora_prevista}</span>
      {/if}
      {#if tarefa.data_prevista}
        <span class="meta-chip" class:alerta={atrasada}>
          {labelRelativo(tarefa.data_prevista)}
        </span>
      {/if}
      {#if tarefa.area_nome}
        <span class="meta-chip area" style="color: {tarefa.area_cor}">
          {tarefa.area_nome}
        </span>
      {/if}
    </div>
  </div>

  <!-- indicador de prioridade -->
  <div
    class="prioridade-dot"
    style="background: {corPrioridade}"
    title={tarefa.prioridade}
  />

  <!-- hover actions -->
  {#if mostrarAcoes && tarefa.status !== 'concluida'}
    <div class="hover-acoes">
      <button class="acao-btn" on:click={adiarParaAmanha} title="adiar para amanha">
        amanha
      </button>
      <button class="acao-btn" on:click={adiarParaProximaSemana} title="adiar para proxima semana">
        prox. semana
      </button>
      <button class="acao-btn" on:click={editar} title="editar">
        editar
      </button>
    </div>
  {/if}
</div>

<style>
  .item-tarefa {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 10px var(--space-3);
    border-radius: var(--radius-md);
    position: relative;
    transition: background var(--transition-fast);
    cursor: default;
  }
  .item-tarefa:hover { background: var(--bg-hover); }
  .item-tarefa.atrasada { background: #fff8f0; }
  .item-tarefa.atrasada:hover { background: #fef0e0; }

  .check-btn {
    background: none; border: none; cursor: pointer;
    flex-shrink: 0; display: flex; align-items: center; padding: 0;
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

  .item-corpo {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    cursor: pointer;
    min-width: 0;
  }

  .item-titulo {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color var(--transition-fast);
  }
  .concluida .item-titulo {
    text-decoration: line-through;
    color: var(--text-muted);
  }

  .item-meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .meta-chip {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 400;
  }
  .meta-chip.alerta { color: #c2570a; font-weight: 500; }
  .meta-chip.area   { font-weight: 500; }

  .prioridade-dot {
    width: 6px; height: 6px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
    opacity: 0.7;
    transition: opacity var(--transition-fast);
  }
  .item-tarefa:hover .prioridade-dot { opacity: 1; }

  /* hover actions */
  .hover-acoes {
    display: flex;
    align-items: center;
    gap: 4px;
    position: absolute;
    right: var(--space-3);
    background: var(--bg-hover);
    border-radius: var(--radius-md);
    padding: 2px;
    animation: aparecer 100ms ease;
  }

  @keyframes aparecer {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }

  .acao-btn {
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    border-radius: calc(var(--radius-md) - 2px);
    padding: 3px 8px;
    font-size: var(--text-xs);
    font-family: var(--font-body);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    white-space: nowrap;
  }
  .acao-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--border-strong);
  }
</style>
```

### src/lib/components/tarefas/FiltrosBarra.svelte

```svelte
<!-- src/lib/components/tarefas/FiltrosBarra.svelte -->
<script>
  import { filtroTexto, filtroArea, filtroPrioridade } from '$lib/stores/tarefas.js';
  import { areas } from '$lib/stores/areas.js';

  $: temFiltro = $filtroTexto || $filtroArea || $filtroPrioridade;

  function limpar() {
    filtroTexto.set('');
    filtroArea.set(null);
    filtroPrioridade.set(null);
  }

  const PRIORIDADES = ['critica', 'alta', 'media', 'baixa'];
</script>

<div class="filtros-barra">

  <!-- busca -->
  <div class="busca-campo">
    <span class="busca-icone">○</span>
    <input
      type="text"
      bind:value={$filtroTexto}
      class="busca-input"
      placeholder="buscar tarefas..."
    />
    {#if $filtroTexto}
      <button class="btn-limpar-campo" on:click={() => filtroTexto.set('')}>×</button>
    {/if}
  </div>

  <!-- filtro area -->
  <select bind:value={$filtroArea} class="filtro-select">
    <option value={null}>todas as areas</option>
    {#each $areas as area}
      <option value={area.id}>{area.nome}</option>
    {/each}
  </select>

  <!-- filtro prioridade -->
  <select bind:value={$filtroPrioridade} class="filtro-select">
    <option value={null}>qualquer prioridade</option>
    {#each PRIORIDADES as p}
      <option value={p}>{p}</option>
    {/each}
  </select>

  <!-- limpar filtros -->
  {#if temFiltro}
    <button class="btn-limpar" on:click={limpar}>limpar filtros</button>
  {/if}

</div>

<style>
  .filtros-barra {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .busca-campo {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 6px 12px;
    transition: border-color var(--transition-fast);
    flex: 1;
    min-width: 200px;
  }
  .busca-campo:focus-within {
    border-color: var(--text-primary);
    background: var(--bg);
  }

  .busca-icone {
    font-size: 13px;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .busca-input {
    border: none;
    background: transparent;
    outline: none;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    color: var(--text-primary);
    flex: 1;
  }
  .busca-input::placeholder { color: var(--text-disabled); }

  .btn-limpar-campo {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-size: 16px;
    display: flex; align-items: center;
    transition: color var(--transition-fast);
  }
  .btn-limpar-campo:hover { color: var(--text-primary); }

  .filtro-select {
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 6px 10px;
    font-size: var(--text-sm);
    font-family: var(--font-body);
    color: var(--text-secondary);
    background: var(--bg-secondary);
    outline: none;
    cursor: pointer;
    transition: border-color var(--transition-fast);
  }
  .filtro-select:focus { border-color: var(--text-primary); background: var(--bg); }

  .btn-limpar {
    background: none; border: none; cursor: pointer;
    font-size: var(--text-xs); color: var(--text-muted);
    font-family: var(--font-body); font-weight: 500;
    padding: 6px 10px; border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    margin-left: auto;
  }
  .btn-limpar:hover { background: var(--bg-hover); color: var(--text-primary); }
</style>
```

---

## ativar a rota de tarefas no App.svelte

```svelte
<!-- src/App.svelte — atualizar views -->
<script>
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import Tarefas from './routes/Tarefas.svelte';       // novo
  import { currentRoute } from '$lib/stores/navigation.js';
  import { initDb } from '$lib/db/client.js';
  import { restaurarJanela, iniciarPersistenciaJanela } from '$lib/utils/window.js';
  import { onMount } from 'svelte';

  onMount(async () => {
    await initDb();
    await restaurarJanela();
    await iniciarPersistenciaJanela();
  });

  const views = {
    dashboard: Dashboard,
    tarefas:   Tarefas,              // novo
  };

  $: currentView = views[$currentRoute] ?? Dashboard;
</script>
```

## ativar o item de tarefas na sidebar

no `Sidebar.svelte`, mudar `active: false` para `active: true` no item de tarefas:

```javascript
{ id: 'tarefas', label: 'tarefas', icon: CheckSquare, active: true },  // era false
```

---

## estrutura de pastas — novos arquivos da fase 3

```
src/
├── lib/
│   ├── components/
│   │   └── tarefas/
│   │       ├── ModalTarefa.svelte    ← substitui versao da fase 2
│   │       ├── ItemTarefa.svelte     ← arquivo novo
│   │       └── FiltrosBarra.svelte   ← arquivo novo
│   └── utils/
│       └── window.js                 ← arquivo novo
└── routes/
    └── Tarefas.svelte                ← arquivo novo
```

---

## criterios de conclusao da fase 3

**janela**
- [ ] ao abrir o app pela primeira vez, a janela usa o tamanho calculado (75% x 85% do monitor)
- [ ] ao redimensionar e fechar, a proxima abertura restaura o tamanho exato
- [ ] ao mover e fechar, a proxima abertura restaura a posicao exata
- [ ] ao maximizar e fechar, a proxima abertura abre maximizada
- [ ] em caso de valores invalidos (monitor diferente), cai para o padrao sem crash
- [ ] a janela nao aparece no lugar errado antes de se posicionar (sem flash)

**modal**
- [ ] o modal nasce centralizado na tela sem nenhum salto ou reposicionamento visual
- [ ] a animacao de entrada e suave (escala + opacidade, sem movimento de posicao)
- [ ] campo de titulo recebe foco automaticamente ao abrir
- [ ] secao "mais detalhes" aparece colapsada por padrao em tarefas novas
- [ ] secao "mais detalhes" abre automaticamente ao editar tarefa que ja tem esses campos
- [ ] cmd+enter salva em qualquer campo do modal
- [ ] esc fecha o modal sem salvar
- [ ] botao "remover tarefa" aparece somente ao editar (nunca em nova tarefa)
- [ ] botao salvar fica desabilitado enquanto o titulo esta vazio

**modulo de tarefas**
- [ ] sidebar navega para a pagina de tarefas ao clicar
- [ ] pagina exibe todas as tarefas agrupadas corretamente por data
- [ ] grupo "atrasadas" aparece no topo na tab dia com estilo de alerta
- [ ] grupo "sem data" aparece ao final na tab dia
- [ ] nas tabs semana/mes/trimestre/semestre/ano, tarefas sao agrupadas por dia
- [ ] busca em tempo real filtra a lista ao digitar
- [ ] filtro por area funciona e pode ser combinado com busca
- [ ] filtro por prioridade funciona e pode ser combinado com os outros
- [ ] botao "limpar filtros" aparece somente quando ha filtro ativo
- [ ] hover sobre uma tarefa exibe as acoes rapidas (amanha / prox. semana / editar)
- [ ] "adiar para amanha" move a data da tarefa e recarrega a lista
- [ ] "adiar para proxima semana" move para a proxima segunda e recarrega
- [ ] contador de pendentes no header atualiza apos cada acao
- [ ] estado vazio com mensagem correta quando nao ha tarefas no periodo
- [ ] estado vazio diferente quando ha filtro ativo sem resultados

**geral**
- [ ] todo texto visivel em letras minusculas
- [ ] nenhum valor hard-coded nos componentes

---

## o que nao entra na fase 3

- drag and drop para reordenar tarefas
- selecao multipla e acoes em lote
- modulo de calendario
- vincular tarefa a meta (coluna existe no banco, ui vem depois)
- recorrencia de tarefas
- notificacoes
- backup
- dark mode

---

## ordem de implementacao sugerida

1. criar `src/lib/utils/window.js`
2. atualizar `tauri.conf.json` com `"visible": false`
3. atualizar `App.svelte` com `restaurarJanela` e `iniciarPersistenciaJanela`
4. testar comportamento de janela (redimensionar, mover, fechar, reabrir)
5. substituir `ModalTarefa.svelte` pela versao corrigida da fase 3
6. testar o modal: posicionamento, animacao, foco, detalhes colapsaveis
7. adicionar `adiarTarefa` e `buscarTarefas` em `tarefas.js`
8. atualizar `src/lib/stores/tarefas.js` com stores de filtro e tarefas sem data
9. criar `FiltrosBarra.svelte`
10. criar `ItemTarefa.svelte`
11. criar `src/routes/Tarefas.svelte`
12. ativar rota no `App.svelte` e item na `Sidebar.svelte`
13. testar fluxo completo: criar > listar > filtrar > buscar > adiar > concluir > deletar
14. testar cada tab temporal com dados em datas variadas
15. verificar checklist completo

---

nexus — fase 3 | referencia de desenvolvimento
proxima fase: fase 4 — modulo de calendario com grid visual, eventos e conexao com tarefas