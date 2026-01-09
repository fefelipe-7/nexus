import { Card, CardContent } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { FlowSummary } from '../../types/cashflow.types';

interface FlowHeaderProps {
  summary: FlowSummary;
  onPeriodChange?: (period: string) => void;
}

export function FlowHeader({ summary }: FlowHeaderProps) {
  const getHealthInfo = () => {
    switch (summary.health) {
      case 'positive':
        return {
          icon: CheckCircle2,
          label: 'Fluxo Positivo',
          color: 'text-green-600',
          bgColor: 'bg-green-500/10',
        };
      case 'stable':
        return {
          icon: Minus,
          label: 'Fluxo Estável',
          color: 'text-blue-600',
          bgColor: 'bg-blue-500/10',
        };
      case 'tight':
        return {
          icon: AlertCircle,
          label: 'Fluxo Apertado',
          color: 'text-amber-600',
          bgColor: 'bg-amber-500/10',
        };
      default:
        return {
          icon: AlertCircle,
          label: 'Fluxo Desequilibrado',
          color: 'text-red-600',
          bgColor: 'bg-red-500/10',
        };
    }
  };

  const getTrendIcon = () => {
    switch (summary.trend.direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const healthInfo = getHealthInfo();
  const HealthIcon = healthInfo.icon;

  return (
    <div className="space-y-3">
      <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg', healthInfo.bgColor)}>
        <HealthIcon className={cn('h-5 w-5', healthInfo.color)} />
        <span className={cn('text-sm font-medium', healthInfo.color)}>
          {healthInfo.label}
        </span>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Entradas</p>
              <p className="text-xl font-bold text-green-600">
                R$ {summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Saídas</p>
              <p className="text-xl font-bold text-red-600">
                R$ {summary.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Resultado</p>
                <p className={cn(
                  'text-2xl font-bold',
                  summary.netFlow >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {summary.netFlow >= 0 ? '+' : ''}R$ {summary.netFlow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {getTrendIcon()}
                <span className={cn(
                  'font-medium',
                  summary.trend.direction === 'up' ? 'text-green-600' : 
                  summary.trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                )}>
                  {summary.trend.percentage}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
