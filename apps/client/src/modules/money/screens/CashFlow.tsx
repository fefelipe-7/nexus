import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockCashFlowData } from '../data/mockCashFlowData';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, TrendingUp } from 'lucide-react';

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Fluxo de Dinheiro</h1>
        <p className="text-muted-foreground">
          Sua narrativa financeira: entenda para onde seu dinheiro está indo e de onde está vindo
        </p>
      </div>

      <FlowOverview summary={data.summary} />

      <div className="grid gap-6 lg:grid-cols-3">
        <TimelineChart timeline={data.timeline} />
        <CategoriesBreakdown categories={data.categories} />
      </div>

      <RecurringCommitments commitments={data.recurringCommitments} />

      <div className="grid gap-6 lg:grid-cols-1">
        <FutureProjection futureFlow={data.futureFlow} />
      </div>
    </div>
  );
}
