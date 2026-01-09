import { Card, CardContent } from '@/ui/components/components/ui';
import { CheckCircle2, AlertCircle, AlertTriangle, Settings } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { BudgetOverview } from '../../types/budget.types';

interface BudgetOverviewCardProps {
  overview: BudgetOverview;
}

export function BudgetOverviewCard({ overview }: BudgetOverviewCardProps) {
  const getStatusInfo = () => {
    switch (overview.status) {
      case 'within_budget':
        return {
          icon: CheckCircle2,
          label: 'Dentro do Orçamento',
          color: 'text-green-600',
          bgColor: 'bg-green-500/10',
        };
      case 'near_limit':
        return {
          icon: AlertTriangle,
          label: 'Próximo do Limite',
          color: 'text-amber-600',
          bgColor: 'bg-amber-500/10',
        };
      case 'exceeded':
        return {
          icon: AlertCircle,
          label: 'Orçamento Estourado',
          color: 'text-red-600',
          bgColor: 'bg-red-500/10',
        };
      default:
        return {
          icon: Settings,
          label: 'Não Configurado',
          color: 'text-gray-600',
          bgColor: 'bg-gray-500/10',
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-3">
      <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg', statusInfo.bgColor)}>
        <StatusIcon className={cn('h-5 w-5', statusInfo.color)} />
        <span className={cn('text-sm font-medium', statusInfo.color)}>
          {statusInfo.label}
        </span>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Orçado</p>
              <p className="text-xl font-bold text-primary">
                R$ {overview.totalBudgeted.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Gasto</p>
              <p className="text-xl font-bold text-red-600">
                R$ {overview.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Utilizado</p>
              <p className="text-xs font-medium text-muted-foreground">
                {overview.percentageUsed.toFixed(1)}%
              </p>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
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
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-1">
              {overview.remaining >= 0 ? 'Saldo Restante' : 'Excedente'}
            </p>
            <p className={cn(
              'text-2xl font-bold',
              overview.remaining >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {overview.remaining >= 0 ? '' : '-'}R$ {Math.abs(overview.remaining).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
