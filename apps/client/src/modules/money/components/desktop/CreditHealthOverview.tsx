import { CreditCard, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';
import { StatCard } from '@/ui/components/analytics';
import type { CreditHealth } from '../../types/cards.types';

interface CreditHealthOverviewProps {
  health: CreditHealth;
}

export function CreditHealthOverview({ health }: CreditHealthOverviewProps) {
  const getStatusLabel = () => {
    switch (health.status) {
      case 'normal': return 'Saudável';
      case 'attention': return 'Atenção';
      case 'critical': return 'Crítico';
    }
  };

  const getStatusColor = () => {
    switch (health.status) {
      case 'normal': return 'green';
      case 'attention': return 'amber';
      case 'critical': return 'red';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard
        label="Situação do Crédito"
        value={getStatusLabel()}
        icon={health.status === 'normal' ? CheckCircle : AlertTriangle}
        color={getStatusColor()}
        format="custom"
        variant="bordered"
      />

      <StatCard
        label="Limite Total"
        value={health.totalLimit}
        format="currency"
        icon={CreditCard}
        color="blue"
        variant="bordered"
      />

      <StatCard
        label="Disponível"
        value={health.totalAvailable}
        format="currency"
        icon={TrendingDown}
        color="green"
        variant="bordered"
      />

      <StatCard
        label="Uso do Limite"
        value={`${health.usagePercentage}%`}
        format="custom"
        icon={CreditCard}
        color={getStatusColor()}
        variant="bordered"
        trend={{
          direction: health.usagePercentage > 70 ? 'up' : health.usagePercentage < 30 ? 'down' : 'stable',
          value: health.usagePercentage,
          label: `${health.activeCards} cartões ativos`,
        }}
      />
    </div>
  );
}
