import { Card, CardContent } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2, Activity } from 'lucide-react';
import { HoverCard } from '@/ui/components/desktop';
import { cn } from '@nexus/shared';
import type { FlowSummary } from '../../types/cashflow.types';

interface FlowOverviewProps {
  summary: FlowSummary;
}

export function FlowOverview({ summary }: FlowOverviewProps) {
  const getHealthInfo = () => {
    switch (summary.health) {
      case 'positive':
        return {
          icon: CheckCircle2,
          label: 'Fluxo Positivo',
          description: 'Suas finanças estão saudáveis e equilibradas',
          color: 'text-green-600',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
        };
      case 'stable':
        return {
          icon: Minus,
          label: 'Fluxo Estável',
          description: 'Entradas e saídas estão equilibradas',
          color: 'text-blue-600',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
        };
      case 'tight':
        return {
          icon: AlertCircle,
          label: 'Fluxo Apertado',
          description: 'Atenção: margem de segurança reduzida',
          color: 'text-amber-600',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
        };
      default:
        return {
          icon: AlertCircle,
          label: 'Fluxo Desequilibrado',
          description: 'Saídas superiores às entradas',
          color: 'text-red-600',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
        };
    }
  };

  const getTrendIcon = () => {
    switch (summary.trend.direction) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendLabel = () => {
    switch (summary.trend.direction) {
      case 'up':
        return 'Melhor que o período anterior';
      case 'down':
        return 'Pior que o período anterior';
      default:
        return 'Sem mudanças significativas';
    }
  };

  const healthInfo = getHealthInfo();
  const HealthIcon = healthInfo.icon;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <HoverCard
        trigger={
          <Card className={cn('cursor-help transition-all hover:shadow-md', healthInfo.borderColor, 'border-l-4')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('p-2 rounded-lg', healthInfo.bgColor)}>
                  <HealthIcon className={cn('h-5 w-5', healthInfo.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className={cn('text-sm font-semibold', healthInfo.color)}>
                    {healthInfo.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        }
        content={
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Saúde Financeira</h4>
            </div>
            <p className="text-sm text-muted-foreground">{healthInfo.description}</p>
          </div>
        }
      />

      <Card className="border-l-4 border-l-green-500/30 hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground mb-1">Entradas</p>
          <p className="text-2xl font-bold text-green-600">
            R$ {summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500/30 hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground mb-1">Saídas</p>
          <p className="text-2xl font-bold text-red-600">
            R$ {summary.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      <HoverCard
        trigger={
          <Card className={cn(
            'border-l-4 cursor-help transition-all hover:shadow-md',
            summary.netFlow >= 0 ? 'border-l-green-500/30' : 'border-l-red-500/30'
          )}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">Resultado</p>
                {getTrendIcon()}
              </div>
              <p className={cn(
                'text-2xl font-bold',
                summary.netFlow >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {summary.netFlow >= 0 ? '+' : ''}R$ {summary.netFlow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
        }
        content={
          <div className="space-y-2">
            <h4 className="font-semibold">Tendência</h4>
            <p className="text-sm text-muted-foreground">{getTrendLabel()}</p>
            <p className="text-sm font-medium">
              {summary.trend.direction === 'up' ? '+' : summary.trend.direction === 'down' ? '-' : ''}
              {summary.trend.percentage}% vs período anterior
            </p>
          </div>
        }
      />
    </div>
  );
}
