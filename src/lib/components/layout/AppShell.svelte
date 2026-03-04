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
