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
        label="Status Financeiro"
        value={getHealthLabel()}
        icon={Activity}
        color={getHealthColor()}
        format="custom"
        variant="gradient"
        iconGradient
        glassEffect
        hoverEffect="lift"
        size="md"
      />

      <StatCard
        label="Entradas do Período"
        value={summary.totalIncome}
        format="currency"
        icon={TrendingUp}
        color="green"
        variant="gradient"
        glassEffect
        hoverEffect="lift"
        animateValue
      />

      <StatCard
        label="Saídas do Período"
        value={summary.totalExpenses}
        format="currency"
        icon={TrendingDown}
        color="red"
        variant="gradient"
        glassEffect
        hoverEffect="lift"
        animateValue
      />

      <StatCard
        label="Resultado Líquido"
        value={summary.netFlow}
        format="currency"
        trend={{
          direction: getTrendDirection(),
          value: summary.trend.percentage,
          label: 'vs período anterior',
          animated: true,
        }}
        icon={DollarSign}
        color="blue"
        variant="gradient"
        gradient="from-blue-500/20 via-purple-500/10 to-transparent"
        glassEffect
        glowEffect
        iconGradient
        hoverEffect="lift"
        animateValue
      />
    </div>
  );
}
