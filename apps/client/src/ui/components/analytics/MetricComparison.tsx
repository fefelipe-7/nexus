import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { TrendIndicator } from './TrendIndicator';
import { cn } from '@nexus/shared';
import { formatCurrency, formatNumber, formatPercentage, percentageChange } from '@/utils/data';
import type { TrendDirection } from './TrendIndicator';

export type MetricFormat = 'number' | 'currency' | 'percentage';

interface MetricData {
  label: string;
  current: number;
  previous: number;
  format?: MetricFormat;
}

interface MetricComparisonProps {
  title?: string;
  metrics: MetricData[];
  periodLabel?: { current: string; previous: string };
  className?: string;
}

export function MetricComparison({
  title = 'Comparação de Períodos',
  metrics,
  periodLabel = { current: 'Atual', previous: 'Anterior' },
  className,
}: MetricComparisonProps) {
  const formatValue = (value: number, format: MetricFormat = 'number'): string => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      default:
        return formatNumber(value);
    }
  };

  const getTrendDirection = (current: number, previous: number): TrendDirection => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => {
          const change = percentageChange(metric.previous, metric.current);
          const direction = getTrendDirection(metric.current, metric.previous);

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{metric.label}</span>
                <TrendIndicator direction={direction} value={change} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">{periodLabel.current}</p>
                  <p className="text-lg font-bold text-primary">
                    {formatValue(metric.current, metric.format)}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">{periodLabel.previous}</p>
                  <p className="text-lg font-semibold text-muted-foreground">
                    {formatValue(metric.previous, metric.format)}
                  </p>
                </div>
              </div>

              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    direction === 'up' ? 'bg-green-500' : direction === 'down' ? 'bg-red-500' : 'bg-gray-500'
                  )}
                  style={{
                    width: `${Math.min(Math.abs(change), 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
