import { Card, CardContent } from '@/ui/components/components/ui';
import { CheckCircle2, AlertCircle, AlertTriangle, Settings, TrendingDown, TrendingUp } from 'lucide-react';
import { HoverCard } from '@/ui/components/desktop';
import { cn } from '@nexus/shared';
import type { BudgetOverview as BudgetOverviewType } from '../../types/budget.types';

interface BudgetOverviewProps {
  overview: BudgetOverviewType;
}

export function BudgetOverview({ overview }: BudgetOverviewProps) {
  const getStatusInfo = () => {
    switch (overview.status) {
      case 'within_budget':
        return {
          icon: CheckCircle2,
          label: 'Dentro do Orçamento',
          description: 'Seus gastos estão sob controle',
          color: 'text-green-600',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
        };
      case 'near_limit':
        return {
          icon: AlertTriangle,
          label: 'Próximo do Limite',
          description: 'Atenção: você está próximo do limite orçado',
          color: 'text-amber-600',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
        };
      case 'exceeded':
        return {
          icon: AlertCircle,
          label: 'Orçamento Estourado',
          description: 'Seus gastos ultrapassaram o orçamento',
          color: 'text-red-600',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
        };
      default:
        return {
          icon: Settings,
          label: 'Não Configurado',
          description: 'Configure seu orçamento para começar',
          color: 'text-gray-600',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30',
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <HoverCard
        trigger={
          <Card className={cn('cursor-help transition-all hover:shadow-md border-l-4', statusInfo.borderColor)}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('p-2 rounded-lg', statusInfo.bgColor)}>
                  <StatusIcon className={cn('h-5 w-5', statusInfo.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className={cn('text-sm font-semibold', statusInfo.color)}>
                    {statusInfo.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        }
        content={
          <div className="space-y-2">
            <h4 className="font-semibold">Status do Orçamento</h4>
            <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
          </div>
        }
      />

      <Card className="border-l-4 border-l-primary/30 hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground mb-1">Total Orçado</p>
          <p className="text-2xl font-bold text-primary">
            R$ {overview.totalBudgeted.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500/30 hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground mb-1">Total Gasto</p>
          <p className="text-2xl font-bold text-red-600">
            R$ {overview.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="mt-2">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  overview.percentageUsed >= 100 ? 'bg-red-500' :
                  overview.percentageUsed >= 90 ? 'bg-amber-500' :
                  'bg-green-500'
                )}
                style={{ width: `${Math.min(overview.percentageUsed, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview.percentageUsed.toFixed(1)}% utilizado
            </p>
          </div>
        </CardContent>
      </Card>

      <HoverCard
        trigger={
          <Card className={cn(
            'border-l-4 cursor-help transition-all hover:shadow-md',
            overview.remaining >= 0 ? 'border-l-green-500/30' : 'border-l-red-500/30'
          )}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">
                  {overview.remaining >= 0 ? 'Saldo Restante' : 'Excedente'}
                </p>
                {overview.remaining >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <p className={cn(
                'text-2xl font-bold',
                overview.remaining >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {overview.remaining >= 0 ? '' : '-'}R$ {Math.abs(overview.remaining).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
        }
        content={
          <div className="space-y-2">
            <h4 className="font-semibold">
              {overview.remaining >= 0 ? 'Margem Disponível' : 'Valor Excedido'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {overview.remaining >= 0
                ? 'Você ainda tem este valor disponível no orçamento'
                : 'Seus gastos ultrapassaram o orçamento neste valor'}
            </p>
          </div>
        }
      />
    </div>
  );
}
