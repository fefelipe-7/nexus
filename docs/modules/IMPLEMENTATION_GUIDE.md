# Guia de Implementação de Módulos

## Como Adicionar um Novo Submódulo

### 1. Criar o Componente

Crie o arquivo do componente em `apps/client/src/modules/{module}/screens/{Submodule}.tsx`:

```tsx
import { ModuleHeader } from '@/ui/components/ModuleHeader';
import { MODULES } from '@/config/modules.config';

export function MySubmodule() {
  const module = MODULES.{MODULE_ID};
  const submodule = module.submodules.find(s => s.id === 'my-submodule');

  return (
    <div className="space-y-6">
      <ModuleHeader
        title={submodule?.name || 'Título'}
        description={submodule?.description}
        icon={submodule?.icon || module.icon}
        color={module.color}
      />
      
      {/* Seu conteúdo aqui */}
    </div>
  );
}
```

### 2. Exportar o Componente

Adicione a exportação em `apps/client/src/modules/{module}/index.ts`:

```tsx
export { MySubmodule } from './screens/MySubmodule';
```

### 3. Atualizar o Roteamento

Em `apps/client/src/app/bootstrap/App.tsx`, importe o componente e atualize a rota:

```tsx
import { MySubmodule } from '@/modules/{module}';

// Dentro do map de submódulos, substitua o SubmodulePlaceholder:
{module.submodules.map((submodule) => {
  // Adicione condição para seu submódulo
  const SubmoduleComponent = submodule.id === 'my-submodule' 
    ? MySubmodule 
    : SubmodulePlaceholder;
    
  return (
    <Route
      key={submodule.id}
      path={submodule.path.replace(module.path + '/', '')}
      element={<SubmoduleComponent {...props} />}
    />
  );
})}
```

### 4. Adicionar Lógica de Negócio

Crie hooks, stores ou serviços conforme necessário:

```
modules/{module}/
├── screens/
│   └── MySubmodule.tsx
├── hooks/
│   └── useMySubmodule.ts
├── components/
│   └── MySubmoduleCard.tsx
└── index.ts
```

## Como Adicionar um Novo Módulo Completo

### 1. Atualizar Types

Em `apps/client/src/types/modules.types.ts`, adicione o ID do módulo:

```tsx
export type ModuleId = 
  | 'overview'
  | 'money'
  // ... outros
  | 'my-new-module';
```

### 2. Adicionar Configuração

Em `apps/client/src/config/modules.config.ts`:

```tsx
import { MyIcon } from 'lucide-react';

export const MODULES: ModuleConfig = {
  // ... outros módulos
  
  MY_NEW_MODULE: {
    id: 'my-new-module',
    name: 'Meu Novo Módulo',
    icon: MyIcon,
    path: '/my-new-module',
    color: 'blue',
    description: 'Descrição do módulo',
    submodules: [
      { id: 'sub1', name: 'Submódulo 1', path: '/my-new-module/sub1' },
      { id: 'sub2', name: 'Submódulo 2', path: '/my-new-module/sub2' },
    ]
  },
};
```

### 3. Criar Estrutura de Pastas

```
apps/client/src/modules/my-new-module/
├── screens/
│   └── MyNewModule.tsx
├── components/
├── hooks/
└── index.ts
```

### 4. Criar Componente Principal

```tsx
// apps/client/src/modules/my-new-module/screens/MyNewModule.tsx
import { Link } from 'react-router-dom';
import { MODULES } from '@/config/modules.config';
import { Card, CardHeader, CardTitle } from '@nexus/ui';

export function MyNewModule() {
  const module = MODULES.MY_NEW_MODULE;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{module.name}</h1>
        <p className="text-muted-foreground mt-2">{module.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {module.submodules.map((submodule) => {
          const Icon = submodule.icon || module.icon;
          return (
            <Link key={submodule.id} to={submodule.path}>
              <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <CardTitle className="text-lg">{submodule.name}</CardTitle>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

### 5. Exportar

```tsx
// apps/client/src/modules/my-new-module/index.ts
export { MyNewModule } from './screens/MyNewModule';
```

### 6. Registrar no App

Em `apps/client/src/app/bootstrap/App.tsx`:

```tsx
import { MyNewModule } from '@/modules/my-new-module';

const moduleComponents: Record<string, React.ComponentType> = {
  // ... outros
  'my-new-module': MyNewModule,
};
```

## Padrões de Código

### Nomenclatura
- **Módulos**: kebab-case para IDs e paths (`work-study`)
- **Componentes**: PascalCase (`WorkStudy.tsx`)
- **Arquivos**: PascalCase para componentes, camelCase para utilitários

### Estrutura de Componentes
```tsx
// 1. Imports
import { ... } from 'react';
import { ... } from 'react-router-dom';
import { ... } from '@/config/...';
import { ... } from '@nexus/ui';

// 2. Types/Interfaces
interface MyComponentProps {
  // ...
}

// 3. Component
export function MyComponent({ props }: MyComponentProps) {
  // 3.1. Hooks
  const navigate = useNavigate();
  const { data } = useMyData();
  
  // 3.2. State
  const [state, setState] = useState();
  
  // 3.3. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 3.4. Handlers
  const handleClick = () => {
    // ...
  };
  
  // 3.5. Render
  return (
    // JSX
  );
}
```

### Cores dos Módulos

Cores disponíveis (Tailwind):
- `blue`, `green`, `purple`, `orange`, `red`, `pink`
- `indigo`, `yellow`, `cyan`, `teal`, `rose`, `violet`

## Integração com Dados

### 1. Criar Schema no Supabase
```sql
-- supabase/migrations/00X_module_schema.sql
CREATE TABLE my_module_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  -- campos específicos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Criar Hook de Dados
```tsx
// modules/my-module/hooks/useMyModuleData.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useMyModuleData() {
  return useQuery({
    queryKey: ['my-module-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('my_module_data')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });
}
```

### 3. Usar no Componente
```tsx
import { useMyModuleData } from '../hooks/useMyModuleData';

export function MySubmodule() {
  const { data, isLoading, error } = useMyModuleData();
  
  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  
  return (
    // Renderizar dados
  );
}
```

## Checklist de Implementação

- [ ] Tipos TypeScript atualizados
- [ ] Configuração do módulo adicionada
- [ ] Estrutura de pastas criada
- [ ] Componente principal implementado
- [ ] Submódulos implementados
- [ ] Roteamento configurado
- [ ] Navegação testada
- [ ] Breadcrumbs funcionando
- [ ] Integração com dados (se aplicável)
- [ ] Testes adicionados
- [ ] Documentação atualizada
