import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Bell, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { BudgetAlert } from '../../types/budget.types';

interface BudgetAlertsProps {
  alerts: BudgetAlert[];
  onDismissAlert?: (alertId: string) => void;
}

export function BudgetAlerts({ alerts, onDismissAlert }: BudgetAlertsProps) {
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700">
          <Bell className="h-5 w-5" />
          Destaques e Alertas
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
                'group p-4 rounded-lg border transition-all hover:shadow-sm',
                severityInfo.bgColor,
                severityInfo.borderColor
              )}
            >
              <div className="flex items-start gap-3">
                <SeverityIcon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', severityInfo.color)} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{alert.message}</p>
                      {alert.categoryName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Categoria: {alert.categoryName}
                        </p>
                      )}
                    </div>
                    {onDismissAlert && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onDismissAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    {alert.percentage && (
                      <span className="font-medium text-muted-foreground">
                        {alert.percentage.toFixed(1)}% utilizado
                      </span>
                    )}
                    {alert.amount && (
                      <span className="font-semibold text-red-600">
                        Excedente: R$ {alert.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
