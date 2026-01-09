# Arquitetura Mobile/Desktop - Nexus

## 📋 Visão Geral

Este documento descreve a nova arquitetura implementada no Nexus para diferenciar a experiência entre dispositivos móveis e desktop, proporcionando interfaces nativas e otimizadas para cada plataforma.

## 🎯 Filosofia de Design

### Mobile: "Glanceable & Action-First"
- Foco em velocidade e informação rápida
- Navegação por contexto
- Gestos nativos (swipe, pull-to-refresh)
- Informação progressiva

### Desktop: "Comprehensive & Multi-tasking"
- Visão panorâmica com múltiplos contextos
- Navegação exploratória
- Densidade de informação otimizada
- Workflows complexos

## 🏗️ Estrutura de Arquivos

```
src/
├── hooks/
│   ├── useDeviceDetection.ts      # Detecção inteligente de dispositivo
│   ├── useToast.ts                # Gerenciamento de toasts (mobile)
│   └── useNotification.ts         # Gerenciamento de notificações (desktop)
│
├── ui/
│   ├── layouts/
│   │   ├── ResponsiveLayout.tsx   # Orquestrador principal
│   │   ├── MobileLayout/
│   │   │   ├── MobileLayout.tsx
│   │   │   ├── MobileHeader.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── FAB.tsx
│   │   │   └── MobileDrawer.tsx
│   │   └── DesktopLayout/
│   │       ├── DesktopLayout.tsx
│   │       ├── Sidebar.tsx
│   │       ├── TopBar.tsx
│   │       └── CommandPalette.tsx
│   │
│   └── components/
│       ├── mobile/
│       │   ├── BottomSheet.tsx
│       │   ├── SwipeableCard.tsx
│       │   ├── PullToRefresh.tsx
│       │   └── Accordion.tsx
│       ├── desktop/
│       │   ├── HoverCard.tsx
│       │   ├── SplitPane.tsx
│       │   ├── DataTable.tsx
│       │   └── ContextMenu.tsx
│       └── feedback/
│           ├── Toast.tsx          # Mobile
│           └── Notification.tsx   # Desktop
│
├── utils/
│   ├── haptic.ts                  # Feedback tátil (mobile)
│   └── animations.ts              # Biblioteca de animações
│
└── modules/
    └── overview/
        └── components/
            ├── mobile/
            │   ├── IndicatorCard.tsx
            │   └── DailySummary.tsx
            └── desktop/
                ├── IndicatorGrid.tsx
                └── DailyOverview.tsx
```

## 🔧 Componentes Principais

### 1. Hook de Detecção de Dispositivo

**`useDeviceDetection()`**
```typescript
const { 
  isMobile,      // < 768px
  isTablet,      // 768px - 1024px
  isDesktop,     // > 1024px
  isTouchDevice,
  hasHoverCapability,
  orientation,
  viewport
} = useDeviceDetection();
```

### 2. Layouts

#### ResponsiveLayout
Orquestrador que decide qual layout renderizar baseado no dispositivo.

#### MobileLayout
- **BottomNav**: Navegação inferior fixa (4 itens principais)
- **MobileHeader**: Cabeçalho minimalista com menu hamburger
- **FAB**: Floating Action Button para ações rápidas
- **MobileDrawer**: Menu lateral com todos os módulos

#### DesktopLayout
- **Sidebar**: Barra lateral colapsável com todos os módulos
- **TopBar**: Barra superior com busca e notificações
- **CommandPalette**: Paleta de comandos (Ctrl+K)

### 3. Componentes Mobile

#### BottomSheet
Modal que desliza de baixo para cima, ideal para ações e detalhes.

```typescript
<BottomSheet 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Detalhes"
>
  {/* Conteúdo */}
</BottomSheet>
```

#### SwipeableCard
Card com gestos de swipe para ações rápidas.

```typescript
<SwipeableCard
  onSwipeLeft={() => handleDelete()}
  onSwipeRight={() => handleComplete()}
  leftAction={{ icon: Trash2, label: 'Excluir' }}
  rightAction={{ icon: Check, label: 'Concluir' }}
>
  {/* Conteúdo do card */}
</SwipeableCard>
```

#### PullToRefresh
Componente de pull-to-refresh nativo.

```typescript
<PullToRefresh onRefresh={async () => await fetchData()}>
  {/* Lista de conteúdo */}
</PullToRefresh>
```

#### Accordion
Acordeão para conteúdo expansível.

```typescript
<Accordion>
  <AccordionItem title="Seção 1" icon={Icon}>
    {/* Conteúdo */}
  </AccordionItem>
</Accordion>
```

### 4. Componentes Desktop

#### HoverCard
Card que aparece no hover com informações adicionais.

```typescript
<HoverCard
  trigger={<Button>Hover me</Button>}
  content={<div>Informações detalhadas</div>}
  side="top"
/>
```

#### SplitPane
Painel divisível com resize.

```typescript
<SplitPane
  left={<LeftPanel />}
  right={<RightPanel />}
  defaultSize={50}
/>
```

#### DataTable
Tabela com sorting e interações.

```typescript
<DataTable
  data={items}
  columns={columns}
  keyExtractor={(item) => item.id}
  onRowClick={(item) => handleClick(item)}
/>
```

#### ContextMenu
Menu de contexto (right-click).

```typescript
<ContextMenu items={menuItems}>
  {/* Elemento que terá o menu */}
</ContextMenu>
```

### 5. Sistema de Feedback

#### Toast (Mobile)
Notificações rápidas no topo da tela.

```typescript
const { success, error, warning, info } = useToast();

success('Operação concluída!');
error('Erro ao processar');
```

#### Notification (Desktop)
Notificações ricas no canto superior direito.

```typescript
const { success, error, warning, info } = useNotification();

success('Sucesso', 'Dados salvos com sucesso');
error('Erro', 'Não foi possível salvar os dados');
```

### 6. Haptic Feedback

Feedback tátil para dispositivos móveis.

```typescript
import { triggerHaptic } from '@/utils/haptic';

triggerHaptic('success');  // Padrão de sucesso
triggerHaptic('error');    // Padrão de erro
triggerHaptic('light');    // Toque leve
```

### 7. Animações

Biblioteca de animações específicas por plataforma.

```typescript
import { getAnimationClass, MOBILE_ANIMATIONS, DESKTOP_ANIMATIONS } from '@/utils/animations';

// Mobile
className={MOBILE_ANIMATIONS.tap}  // active:scale-95

// Desktop
className={DESKTOP_ANIMATIONS.hover}  // hover:scale-105
```

## 📱 Exemplo de Uso: Tela Home

A tela Home foi refatorada para demonstrar a diferenciação:

### Mobile
- Cards verticais empilhados (lista)
- Accordion para resumo do dia
- FAB para ação rápida
- Interações com `active:scale`

### Desktop
- Grid 3 colunas
- HoverCard nos indicadores
- Hover states ricos
- Densidade de informação maior

```typescript
export function Home() {
  const { isMobile, isTablet } = useDeviceDetection();
  const isMobileView = isMobile || isTablet;

  return (
    <div>
      {isMobileView ? (
        <MobileVersion />
      ) : (
        <DesktopVersion />
      )}
    </div>
  );
}
```

## 🎨 Padrões de Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Interações

#### Mobile
- `active:scale-98` para feedback tátil
- Swipe gestures
- Pull-to-refresh
- Bottom sheets para modais
- Toast notifications

#### Desktop
- `hover:shadow-lg` para elevação
- `hover:translate-x-1` para movimento
- Context menus (right-click)
- Keyboard shortcuts (Ctrl+K)
- Corner notifications

### Navegação

#### Mobile
- Bottom Navigation (4 itens principais)
- Hamburger menu para módulos secundários
- FAB para ação principal

#### Desktop
- Sidebar persistente (colapsável)
- Command Palette (Ctrl+K)
- Breadcrumbs detalhados

## 🚀 Como Usar

### 1. Criar componente responsivo

```typescript
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export function MyComponent() {
  const { isMobile } = useDeviceDetection();
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

### 2. Usar componentes específicos

```typescript
// Mobile
import { BottomSheet, SwipeableCard } from '@/ui/components/mobile';

// Desktop
import { HoverCard, DataTable } from '@/ui/components/desktop';
```

### 3. Adicionar feedback

```typescript
// Mobile
import { useToast } from '@/hooks/useToast';
const { success } = useToast();

// Desktop
import { useNotification } from '@/hooks/useNotification';
const { success } = useNotification();
```

## ✅ Benefícios

1. **UX Nativa**: Cada plataforma se sente natural
2. **Performance**: Carrega apenas o necessário
3. **Manutenibilidade**: Separação clara de responsabilidades
4. **Escalabilidade**: Fácil adicionar novos padrões
5. **Acessibilidade**: Otimizado para diferentes modos de interação

## 📝 Próximos Passos

- [ ] Adicionar mais telas com versões mobile/desktop
- [ ] Implementar testes para componentes específicos
- [ ] Criar storybook com exemplos
- [ ] Documentar padrões de uso
- [ ] Adicionar mais animações e transições

---

**Versão**: 1.0.0  
**Data**: Janeiro 2026  
**Autor**: Nexus Team
