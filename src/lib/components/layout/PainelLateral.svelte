<script>
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
