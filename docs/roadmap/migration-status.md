# Status da Migração para Arquitetura Modular

## ✅ Concluído

### Estrutura de Diretórios
- [x] Criada estrutura completa de apps/, packages/, services/, infra/, docs/, scripts/
- [x] Subdiretórios criados conforme arquitetura proposta
- [x] Arquivos copiados para nova estrutura

### Packages
- [x] **@nexus/core** criado com:
  - Entidades de domínio (State, Action, Event, Goal, Routine, Knowledge, Reflection)
  - Estrutura para use-cases
  - Interfaces de repositórios (ports)
  - package.json e tsconfig.json configurados

- [x] **@nexus/shared** criado com:
  - Utils (cn, formatters)
  - Types compartilhados (BaseEntity, Status, Priority)
  - Constants (APP_NAME, STORAGE_KEYS, DATE_FORMATS)
  - Error classes customizadas
  - package.json e tsconfig.json configurados

### Apps
- [x] **@nexus/client** configurado com:
  - Estrutura modular (app/, ui/, screens/, state/, data/, ai/, config/)
  - package.json com workspaces
  - tsconfig.json com path aliases
  - vite.config.ts com aliases para packages

### Configuração
- [x] package.json raiz configurado para monorepo com npm workspaces
- [x] Scripts de dev, build, preview configurados
- [x] Documentação de arquitetura criada

### Arquivos Migrados
- [x] Componentes UI → apps/client/src/ui/components/
- [x] Páginas → apps/client/src/screens/domains/pages/
- [x] Store → apps/client/src/state/stores/
- [x] Temas → apps/client/src/ui/themes/
- [x] Utils → packages/shared/src/utils/
- [x] DB → apps/client/src/data/local/
- [x] Supabase/Backend → apps/client/src/data/adapters/
- [x] Translations → packages/shared/src/constants/
- [x] App.tsx → apps/client/src/app/bootstrap/
- [x] main.tsx, index.css → apps/client/src/
- [x] Configs → apps/client/ (vite, tailwind, postcss)
- [x] Docs → docs/context/
- [x] Infra → infra/database/, infra/env/

### Ajustes de Imports
- [x] App.tsx atualizado com novos paths
- [x] main.tsx atualizado
- [x] vite.config.ts com aliases

## ⚠️ Pendente

### Ajustes de Imports (Crítico)
- [ ] Atualizar imports em todos os componentes UI
  - Layout.tsx
  - ThemeSelector.tsx
  - Componentes shadcn/ui (Button, Card, Input, etc)
- [ ] Atualizar imports em todas as páginas/screens
  - Dashboard.tsx
  - StateTracker.tsx
  - Actions.tsx
  - Events.tsx
  - Goals.tsx
  - Routines.tsx
  - Knowledge.tsx
  - Reflections.tsx
- [ ] Atualizar imports nos stores (themeStore.ts)

### Instalação de Dependências
- [ ] Limpar node_modules antigo
- [ ] Reinstalar dependências com `npm install`
- [ ] Verificar se workspaces foram configurados corretamente

### Testes
- [ ] Testar build: `npm run build`
- [ ] Testar dev server: `npm run dev`
- [ ] Verificar se todos os imports estão corretos
- [ ] Testar funcionalidade de cada página
- [ ] Testar sistema de temas
- [ ] Testar integração com Dexie/Supabase

### Limpeza
- [ ] Remover pasta src/ antiga (após confirmar que tudo funciona)
- [ ] Remover arquivos duplicados
- [ ] Atualizar .gitignore se necessário

### Documentação
- [ ] Criar guia de desenvolvimento em docs/
- [ ] Documentar convenções de código
- [ ] Criar exemplos de uso dos packages

## 🚀 Próximos Passos Recomendados

1. **Limpar e Reinstalar**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Ajustar Imports Manualmente**
   - Começar pelos componentes mais usados
   - Usar find & replace com cuidado
   - Testar incrementalmente

3. **Testar Build**
   ```bash
   npm run build
   ```

4. **Testar Dev Server**
   ```bash
   npm run dev
   ```

5. **Commit Incremental**
   - Fazer commits pequenos conforme ajusta os imports
   - Testar após cada commit

## 📝 Notas Importantes

### Path Aliases Configurados
- `@/` → `apps/client/src/`
- `@nexus/core` → `packages/core/src`
- `@nexus/shared` → `packages/shared/src`

### Padrão de Imports
```typescript
// Componentes UI
import { Button } from '@/ui/components/ui/button';
import { Layout } from '@/ui/components/Layout';

// Screens
import { Dashboard } from '@/screens/domains/pages/Dashboard';

// State
import { useThemeStore } from '@/state/stores/themeStore';

// Data
import { db } from '@/data/local/db';
import { supabase } from '@/data/adapters/supabase';

// Packages
import { cn } from '@nexus/shared';
import { Action, Goal } from '@nexus/core';
```

### Estrutura de Workspaces
```
nexus/
├─ package.json (root - gerencia workspaces)
├─ apps/client/package.json (@nexus/client)
├─ packages/core/package.json (@nexus/core)
└─ packages/shared/package.json (@nexus/shared)
```

## ⚡ Comandos Úteis

```bash
# Instalar dependências em todos os workspaces
npm install

# Rodar dev apenas no client
npm run dev

# Build de todos os workspaces
npm run build

# Adicionar dependência ao client
npm install <package> --workspace=@nexus/client

# Adicionar dependência ao core
npm install <package> --workspace=@nexus/core
```
