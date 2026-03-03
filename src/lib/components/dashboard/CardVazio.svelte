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
