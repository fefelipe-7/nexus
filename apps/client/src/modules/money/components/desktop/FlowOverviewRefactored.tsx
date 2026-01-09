import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { StatCard } from '@/ui/components/analytics';
import type { FlowSummary } from '../../types/cashflow.types';

interface FlowOverviewProps {
  summary: FlowSummary;
}

export function FlowOverview({ summary }: FlowOverviewProps) {
  const getHealthColor = () => {
    switch (summary.health) {
      case 'positive': return 'green';
      case 'stable': return 'blue';
      case 'tight': return 'amber';
      default: return 'red';
    }
  };

  const getHealthLabel = () => {
    switch (summary.health) {
      case 'positive': return 'Fluxo Positivo';
      case 'stable': return 'Fluxo Estável';
      case 'tight': return 'Fluxo Apertado';
      default: return 'Fluxo Desequilibrado';
    }
  };

  const getTrendDirection = () => {
    if (summary.trend.direction === 'up') return 'up';
    if (summary.trend.direction === 'down') return 'down';
    return 'stable';
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard
        label="Status"
        value={getHealthLabel()}
        icon={Activity}
        color={getHealthColor()}
        format="custom"
        variant="bordered"
      />

      <StatCard
        label="Entradas"
        value={summary.totalIncome}
        format="currency"
        icon={TrendingUp}
        variant="bordered"
      />

      <StatCard
        label="Saídas"
        value={summary.totalExpenses}
        format="currency"
        icon={TrendingDown}
        variant="bordered"
      />

      <StatCard
        label="Resultado"
        value={summary.netFlow}
        format="currency"
        trend={{
          direction: getTrendDirection(),
          value: summary.trend.percentage,
          label: 'vs período anterior',
        }}
        icon={DollarSign}
        variant="bordered"
      />
    </div>
  );
}
