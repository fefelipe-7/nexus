import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockCashFlowData } from '../data/mockCashFlowData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Filter, Download, Calendar } from 'lucide-react';
import { QuickFilters, DateRangePicker } from '@/ui/components/filters';
import { Button } from '@/ui/components/components/ui';

import {
  FlowHeader as MobileFlowHeader,
  TimelineCard,
  CategoriesCard,
  RecurringCard,
  FutureFlowCard,
} from '../components/mobile';

import {
  FlowOverview,
  TimelineChart,
  CategoriesBreakdown,
  RecurringCommitments,
  FutureProjection,
} from '../components/desktop';

export function CashFlow() {
  const { isMobile, isTablet } = useDeviceDetection();
  const isMobileView = isMobile || isTablet;

  const data = mockCashFlowData;

  const handleAddTransaction = () => {
    console.log('Adicionar transação');
  };

  if (isMobileView) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Fluxo de Dinheiro</h1>
          <p className="text-sm text-muted-foreground">
            Entenda para onde seu dinheiro está indo
          </p>
        </div>

        <MobileFlowHeader summary={data.summary} />

        <TimelineCard timeline={data.timeline} />

        <CategoriesCard categories={data.categories} />

        <RecurringCard commitments={data.recurringCommitments} />

        <FutureFlowCard futureFlow={data.futureFlow} />

        <FAB
          onClick={handleAddTransaction}
          icon={Plus}
          label="Registrar"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Filtros e Ações */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Fluxo de Dinheiro</h1>
          <p className="text-muted-foreground">
            Visão completa do seu fluxo financeiro
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker
            value={{
              start: new Date(new Date().setDate(1)),
              end: new Date(),
            }}
            onChange={() => {}}
          />
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <FlowOverview summary={data.summary} />

      {/* Layout Dashboard 3 Colunas */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Coluna Esquerda - Timeline e Insights */}
        <div className="lg:col-span-5 space-y-6">
          <TimelineChart timeline={data.timeline} />
        </div>

        {/* Coluna Central - Categorias e Compromissos */}
        <div className="lg:col-span-4 space-y-6">
          <CategoriesBreakdown categories={data.categories} />
          <RecurringCommitments commitments={data.recurringCommitments} />
        </div>

        {/* Coluna Direita - Projeção e Alertas */}
        <div className="lg:col-span-3 space-y-6">
          <FutureProjection futureFlow={data.futureFlow} />
        </div>
      </div>
    </div>
  );
}
