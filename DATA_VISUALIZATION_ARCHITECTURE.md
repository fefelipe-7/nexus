# Arquitetura de Visualização de Dados - Nexus

## 📊 Análise da Situação Atual

### Componentes Existentes
Atualmente temos visualizações customizadas em:
- **TimelineChart** (Desktop) - Gráfico de barras temporal
- **TimelineCard** (Mobile) - Versão mobile do timeline
- **CategoriesBreakdown** - Barra de progresso horizontal + grid
- **CategoriesCard** - Barras de progresso verticais

### Problemas Identificados
1. **Código duplicado** - Lógica de cálculo de altura/largura repetida
2. **Sem padronização** - Cada componente implementa sua própria lógica
3. **Difícil manutenção** - Mudanças precisam ser replicadas
4. **Sem reutilização** - Componentes muito específicos
5. **Falta de filtros** - Sistema de filtros não existe
6. **Sem análise avançada** - Métricas e comparações são ad-hoc

## 🎯 Objetivos da Infraestrutura

### 1. Componentes de Gráficos Reutilizáveis
Criar biblioteca de gráficos base que podem ser usados em qualquer módulo:
- **BarChart** - Gráfico de barras (vertical/horizontal)
- **LineChart** - Gráfico de linhas
- **AreaChart** - Gráfico de área
- **PieChart** - Gráfico de pizza
- **DonutChart** - Gráfico de rosca
- **ProgressBar** - Barra de progresso
- **SparkLine** - Mini gráfico de linha
- **HeatMap** - Mapa de calor

### 2. Sistema de Filtros Avançados
Componentes de filtro reutilizáveis:
- **DateRangePicker** - Seletor de período
- **MultiSelect** - Seleção múltipla
- **SearchFilter** - Busca com autocomplete
- **CategoryFilter** - Filtro por categorias
- **RangeSlider** - Slider de valores
- **QuickFilters** - Filtros rápidos (hoje, semana, mês)

### 3. Componentes de Análise
Componentes para exibir métricas e análises:
- **StatCard** - Card de estatística
- **MetricComparison** - Comparação entre períodos
- **TrendIndicator** - Indicador de tendência
- **PercentageChange** - Mudança percentual
- **Ranking** - Lista ranqueada
- **Distribution** - Distribuição de valores

### 4. Utilitários de Dados
Funções helper para processamento:
- **dataAggregation** - Agregação de dados
- **dataTransform** - Transformação de dados
- **dataFilter** - Filtragem de dados
- **dataSort** - Ordenação de dados
- **dataGroup** - Agrupamento de dados
- **dataCalculations** - Cálculos estatísticos

## 🏗️ Estrutura de Arquivos

```
src/
├── ui/
│   └── components/
│       ├── charts/              # Componentes de gráficos
│       │   ├── base/            # Componentes base
│       │   │   ├── Chart.tsx    # Wrapper base
│       │   │   ├── Axis.tsx     # Eixos
│       │   │   ├── Grid.tsx     # Grid
│       │   │   ├── Legend.tsx   # Legenda
│       │   │   ├── Tooltip.tsx  # Tooltip
│       │   │   └── index.ts
│       │   ├── BarChart.tsx
│       │   ├── LineChart.tsx
│       │   ├── AreaChart.tsx
│       │   ├── PieChart.tsx
│       │   ├── DonutChart.tsx
│       │   ├── ProgressBar.tsx
│       │   ├── SparkLine.tsx
│       │   ├── HeatMap.tsx
│       │   └── index.ts
│       │
│       ├── filters/             # Componentes de filtro
│       │   ├── DateRangePicker.tsx
│       │   ├── MultiSelect.tsx
│       │   ├── SearchFilter.tsx
│       │   ├── CategoryFilter.tsx
│       │   ├── RangeSlider.tsx
│       │   ├── QuickFilters.tsx
│       │   ├── FilterBar.tsx    # Container de filtros
│       │   └── index.ts
│       │
│       └── analytics/           # Componentes de análise
│           ├── StatCard.tsx
│           ├── MetricComparison.tsx
│           ├── TrendIndicator.tsx
│           ├── PercentageChange.tsx
│           ├── Ranking.tsx
│           ├── Distribution.tsx
│           └── index.ts
│
└── utils/
    └── data/                    # Utilitários de dados
        ├── aggregation.ts
        ├── transform.ts
        ├── filter.ts
        ├── sort.ts
        ├── group.ts
        ├── calculations.ts
        ├── formatters.ts        # Formatação de dados
        └── index.ts
```

## 📐 Design Principles

### 1. Responsividade
- Todos os gráficos devem ter versões mobile e desktop
- Adaptação automática ao tamanho do container
- Touch-friendly no mobile

### 2. Acessibilidade
- Suporte a teclado
- ARIA labels
- Alto contraste
- Alternativas textuais

### 3. Performance
- Virtualização para grandes datasets
- Lazy loading
- Memoização de cálculos
- Debounce em filtros

### 4. Customização
- Temas (cores, estilos)
- Configurações flexíveis
- Callbacks para eventos
- Slots para conteúdo customizado

## 🎨 API dos Componentes

### BarChart
```typescript
interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  orientation?: 'vertical' | 'horizontal';
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  onBarClick?: (item: any) => void;
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
}
```

### LineChart
```typescript
interface LineChartProps {
  data: Array<{ x: Date | string | number; y: number }>;
  series?: Array<{ name: string; data: any[]; color?: string }>;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showPoints?: boolean;
  smooth?: boolean;
  area?: boolean;
  onPointClick?: (point: any) => void;
}
```

### DateRangePicker
```typescript
interface DateRangePickerProps {
  value: { start: Date; end: Date };
  onChange: (range: { start: Date; end: Date }) => void;
  presets?: Array<{ label: string; range: { start: Date; end: Date } }>;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
}
```

### StatCard
```typescript
interface StatCardProps {
  label: string;
  value: number | string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    value: number;
    label?: string;
  };
  icon?: React.ComponentType;
  color?: string;
  format?: 'number' | 'currency' | 'percentage' | 'custom';
  formatFn?: (value: any) => string;
  onClick?: () => void;
}
```

## 🔄 Integração com Módulos Existentes

### Módulo Money - CashFlow
**Antes:**
```typescript
// TimelineChart customizado
<TimelineChart timeline={data.timeline} />
```

**Depois:**
```typescript
// Usando BarChart genérico
<BarChart
  data={data.timeline.map(d => ({
    label: formatDate(d.date),
    value: d.income,
    secondaryValue: d.expenses,
  }))}
  stacked
  colors={['green', 'red']}
/>
```

### Módulo Overview - Home
**Antes:**
```typescript
// Indicadores customizados
{indicators.map(indicator => (
  <IndicatorCard {...indicator} />
))}
```

**Depois:**
```typescript
// Usando StatCard genérico
{indicators.map(indicator => (
  <StatCard
    label={indicator.label}
    value={indicator.value}
    trend={indicator.trend}
    icon={indicator.icon}
  />
))}
```

## 📊 Casos de Uso por Módulo

### Money (Dinheiro)
- **BarChart**: Timeline de entradas/saídas
- **PieChart**: Distribuição de categorias
- **LineChart**: Evolução do saldo
- **ProgressBar**: Progresso de metas financeiras
- **DateRangePicker**: Filtro de período
- **StatCard**: Resumo financeiro

### Time (Tempo)
- **HeatMap**: Mapa de calor de produtividade
- **BarChart**: Horas por categoria
- **LineChart**: Tendência de tempo gasto
- **SparkLine**: Mini gráficos de atividades

### Health (Saúde)
- **LineChart**: Evolução de métricas (peso, sono)
- **AreaChart**: Padrões de sono
- **ProgressBar**: Metas de saúde
- **StatCard**: Métricas diárias

### Goals (Metas)
- **ProgressBar**: Progresso de metas
- **Ranking**: Ranking de metas
- **TrendIndicator**: Tendência de progresso
- **MetricComparison**: Comparação de períodos

### Projects (Projetos)
- **BarChart**: Tarefas por status
- **DonutChart**: Distribuição de tempo
- **LineChart**: Progresso ao longo do tempo

## 🚀 Plano de Implementação

### Fase 1: Componentes Base (Prioridade Alta)
1. Chart wrapper base
2. BarChart (vertical/horizontal)
3. LineChart
4. ProgressBar
5. StatCard
6. DateRangePicker
7. QuickFilters

### Fase 2: Componentes Avançados (Prioridade Média)
1. AreaChart
2. PieChart / DonutChart
3. SparkLine
4. MultiSelect
5. CategoryFilter
6. TrendIndicator
7. MetricComparison

### Fase 3: Componentes Especializados (Prioridade Baixa)
1. HeatMap
2. RangeSlider
3. SearchFilter
4. Ranking
5. Distribution

### Fase 4: Refatoração
1. Refatorar Money/CashFlow
2. Refatorar Overview/Home
3. Aplicar em outros módulos conforme necessário

## 🎯 Benefícios Esperados

1. **Redução de código**: -60% de código duplicado
2. **Velocidade de desenvolvimento**: +80% mais rápido criar novas telas
3. **Consistência**: 100% de consistência visual
4. **Manutenibilidade**: Mudanças em um lugar afetam todos
5. **Testabilidade**: Componentes isolados e testáveis
6. **Documentação**: API clara e documentada

## 📝 Próximos Passos

1. ✅ Criar este documento de planejamento
2. ⏳ Implementar componentes base (Fase 1)
3. ⏳ Criar utilitários de dados
4. ⏳ Refatorar CashFlow para usar novos componentes
5. ⏳ Refatorar Home para usar novos componentes
6. ⏳ Documentar exemplos de uso
7. ⏳ Criar storybook (opcional)

---

**Versão**: 1.0.0  
**Data**: Janeiro 2026  
**Status**: Em Planejamento
