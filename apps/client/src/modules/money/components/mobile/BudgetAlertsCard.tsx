import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Bell, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { BudgetAlert } from '../../types/budget.types';

interface BudgetAlertsCardProps {
  alerts: BudgetAlert[];
}

export function BudgetAlertsCard({ alerts }: BudgetAlertsCardProps) {
  if (alerts.length === 0) {
    return null;
  }

  const getSeverityInfo = (severity: BudgetAlert['severity']) => {
    switch (severity) {
      case 'high':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
        };
      default:
        return {
          icon: Info,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
    }
  };

  return (
    <Card className="border-amber-200 bg-amber-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-amber-700">
          <Bell className="h-4 w-4" />
          Alertas de Orçamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const severityInfo = getSeverityInfo(alert.severity);
          const SeverityIcon = severityInfo.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                'p-3 rounded-lg border',
                severityInfo.bgColor,
                severityInfo.borderColor
              )}
            >
              <div className="flex items-start gap-3">
                <SeverityIcon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', severityInfo.color)} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">{alert.message}</p>
                  {alert.percentage && (
                    <p className="text-xs text-muted-foreground">
                      {alert.percentage.toFixed(1)}% do orçamento utilizado
                    </p>
                  )}
                  {alert.amount && (
                    <p className="text-xs font-semibold text-red-600">
                      Excedente: R$ {alert.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
