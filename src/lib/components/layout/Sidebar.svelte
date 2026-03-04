<script>
  import { Home, CheckSquare, Calendar, Target, Flame,
           DollarSign, FileText, Users, Settings, Search,
           ChevronsLeft, ChevronsRight } from 'lucide-svelte';
  import { currentRoute } from '$lib/stores/navigation.js';
  import { sidebarCollapsed } from '$lib/stores/ui.js';

  const navItems = [
    {
      label: 'principal',
      items: [
        { id: 'dashboard',  label: 'dashboard',  icon: Home,        active: true  },
        { id: 'tarefas',    label: 'tarefas',    icon: CheckSquare, active: true  },
        { id: 'calendario', label: 'calendario', icon: Calendar,    active: true  },
      ]
    },
    {
      label: 'vida',
      items: [
        { id: 'metas',    label: 'metas',    icon: Target,     active: false },
        { id: 'habitos',  label: 'habitos',  icon: Flame,      active: false },
        { id: 'financas', label: 'financas', icon: DollarSign, active: false },
      ]
    },
    {
      label: 'registro',
      items: [
        { id: 'notas',   label: 'notas',   icon: FileText, active: false },
        { id: 'pessoas', label: 'pessoas', icon: Users,    active: false },
      ]
    }
  ];

  function navigate(item) {
    if (!item.active) return;
    currentRoute.set(item.id);
  }
</script>

<aside class="sidebar" class:collapsed={$sidebarCollapsed}>
  <div class="sidebar-header">
    {#if !$sidebarCollapsed}
      <div class="sidebar-logo">
        <span class="logo-mark">◈</span>
        <span class="logo-text">nexus</span>
      </div>
    {:else}
      <span class="logo-mark">◈</span>
    {/if}
    <button
      class="collapse-btn"
      on:click={() => sidebarCollapsed.update(v => !v)}
      aria-label="alternar sidebar"
    >
      {#if $sidebarCollapsed}
        <ChevronsRight size={15} />
      {:else}
        <ChevronsLeft size={15} />
      {/if}
    </button>
  </div>

  {#if !$sidebarCollapsed}
    <div class="sidebar-search">
      <Search size={13} />
      <span>buscar...</span>
      <kbd>cmd+F</kbd>
    </div>
  {/if}

  <nav class="sidebar-nav">
    {#each navItems as group}
      {#if !$sidebarCollapsed}
        <span class="nav-group-label">{group.label}</span>
      {/if}
      {#each group.items as item}
        <button
          class="nav-item"
          class:active={$currentRoute === item.id}
          class:disabled={!item.active}
          on:click={() => navigate(item)}
        >
          <svelte:component this={item.icon} size={16} />
          {#if !$sidebarCollapsed}
            <span>{item.label}</span>
          {/if}
        </button>
      {/each}
    {/each}
  </nav>

  <div class="sidebar-footer">
    <button
      class="nav-item"
      class:active={$currentRoute === 'configuracoes'}
      on:click={() => currentRoute.set('configuracoes')}
    >
      <Settings size={16} />
      {#if !$sidebarCollapsed}
        <span>configuracoes</span>
      {/if}
    </button>
  </div>
</aside>

<style>
  .sidebar {
    width: var(--sidebar-width); height: 100vh;
    background: var(--bg-secondary); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; flex-shrink: 0;
    transition: width var(--transition-slow); overflow: hidden;
  }
  .sidebar.collapsed { width: var(--sidebar-collapsed); }

  .sidebar-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--space-4) var(--space-3); height: var(--topbar-height); flex-shrink: 0;
  }
  .sidebar-logo { display: flex; align-items: center; gap: var(--space-2); }
  .logo-mark { font-size: 18px; line-height: 1; }
  .logo-text { font-family: var(--font-display); font-size: var(--text-md); font-weight: 600; letter-spacing: -0.3px; }

  .collapse-btn {
    background: none; border: none; cursor: pointer; color: var(--text-muted);
    padding: var(--space-1); border-radius: var(--radius-sm); display: flex; align-items: center;
    transition: color var(--transition-fast), background var(--transition-fast);
  }
  .collapse-btn:hover { color: var(--text-primary); background: var(--bg-hover); }

  .sidebar-search {
    display: flex; align-items: center; gap: var(--space-2);
    margin: 0 var(--space-3) var(--space-3); padding: var(--space-2) var(--space-3);
    background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-md);
    color: var(--text-muted); font-size: var(--text-sm); cursor: text;
    transition: border-color var(--transition-fast);
  }
  .sidebar-search:hover { border-color: var(--border-strong); }
  .sidebar-search span { flex: 1; }
  kbd { font-size: var(--text-xs); color: var(--text-disabled); font-family: var(--font-body); }

  .sidebar-nav { flex: 1; overflow-y: auto; padding: 0 var(--space-2); display: flex; flex-direction: column; gap: 1px; }

  .nav-group-label {
    display: block; font-size: var(--text-xs); color: var(--text-muted);
    font-weight: 500; padding: var(--space-3) var(--space-2) var(--space-1); letter-spacing: 0.3px;
  }

  .nav-item {
    display: flex; align-items: center; gap: var(--space-2);
    padding: 6px var(--space-2); border-radius: var(--radius-md);
    border: none; background: none; cursor: pointer;
    color: var(--text-secondary); font-size: var(--text-sm);
    font-family: var(--font-body); font-weight: 500;
    width: 100%; text-align: left;
    transition: background var(--transition-fast), color var(--transition-fast); white-space: nowrap;
  }
  .nav-item:hover:not(.disabled) { background: var(--bg-hover); color: var(--text-primary); }
  .nav-item.active { background: var(--bg-active); color: var(--text-primary); }
  .nav-item.disabled { opacity: 0.4; cursor: not-allowed; }

  .sidebar-footer { padding: var(--space-2); border-top: 1px solid var(--border); flex-shrink: 0; }
</style>
