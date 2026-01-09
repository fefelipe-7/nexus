import { Card, CardContent } from '@/ui/components/components/ui';
import { CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@nexus/shared';
import { formatCurrency } from '@/utils/data';
import { ProgressBar } from '@/ui/components/charts';
import type { CreditHealth } from '../../types/cards.types';

interface CreditHealthCardProps {
  health: CreditHealth;
}

export function CreditHealthCard({ health }: CreditHealthCardProps) {
  const getStatusConfig = () => {
    switch (health.status) {
      case 'normal':
        return {
          label: 'Saudável',
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
        };
      case 'attention':
        return {
          label: 'Atenção',
          icon: AlertTriangle,
          color: 'text-amber-600',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
        };
      case 'critical':
        return {
          label: 'Crítico',
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <Card className={cn('border-l-4', config.borderColor)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Saúde do Crédito</span>
          </div>
          <div className={cn('flex items-center gap-1 px-2 py-1 rounded-full', config.bgColor)}>
            <StatusIcon className={cn('h-4 w-4', config.color)} />
            <span className={cn('text-xs font-semibold', config.color)}>{config.label}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs text-muted-foreground">Limite Total</span>
              <span className="text-lg font-bold">{formatCurrency(health.totalLimit)}</span>
            </div>
            <ProgressBar
              value={health.usagePercentage}
              max={100}
              label="Uso do Limite"
              showValue
              color={health.status === 'critical' ? 'red' : health.status === 'attention' ? 'amber' : 'blue'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Disponível</p>
              <p className="text-sm font-semibold text-green-600">
                {formatCurrency(health.totalAvailable)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Em Uso</p>
              <p className="text-sm font-semibold text-red-600">
                {formatCurrency(health.totalUsed)}
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2">
            {health.activeCards} de {health.totalCards} cartões ativos
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
