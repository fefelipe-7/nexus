import { StatCard } from '@/ui/components/analytics';
import type { LucideIcon } from 'lucide-react';

interface Indicator {
  domain: string;
  label: string;
  status: string;
  trend: string;
  icon: LucideIcon;
  value: string;
}

interface IndicatorGridProps {
  indicators: Indicator[];
}

export function IndicatorGrid({ indicators }: IndicatorGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'green';
      case 'attention': return 'amber';
      case 'critical': return 'red';
      default: return 'blue';
    }
  };

  const getTrendDirection = (trend: string): 'up' | 'down' | 'stable' => {
    switch (trend) {
      case 'up': return 'up';
      case 'down': return 'down';
      default: return 'stable';
    }
  };

  const getTrendValue = (trend: string): number => {
    switch (trend) {
      case 'up': return 5;
      case 'down': return -5;
      default: return 0;
    }
  };

  return (
    <div className="grid gap-3 grid-cols-2">
      {indicators.map((indicator) => (
        <StatCard
          key={indicator.domain}
          label={indicator.label}
          value={indicator.value}
          format="custom"
          icon={indicator.icon}
          color={getStatusColor(indicator.status)}
          trend={{
            direction: getTrendDirection(indicator.trend),
            value: getTrendValue(indicator.trend),
          }}
          variant="bordered"
          size="sm"
        />
      ))}
    </div>
  );
}
