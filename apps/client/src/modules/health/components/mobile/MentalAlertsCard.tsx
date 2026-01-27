import { Card, CardContent } from '@/ui/components/components/ui';
import { AlertCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { MentalAlert } from '../../types/mental-health.types';

interface MentalAlertsCardProps {
  alerts: MentalAlert[];
}

export function MentalAlertsCard({ alerts }: MentalAlertsCardProps) {
  if (alerts.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-muted/20">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-green-500/10">
              <Info className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-green-600">Tudo tranquilo!</p>
            <p className="text-xs text-muted-foreground">Sem alertas no momento</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityInfo = (severity: MentalAlert['severity']) => {
    switch (severity) {
      case 'high':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          color: 'text-amber-600',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
        };
      default:
        return {
          icon: Info,
          color: 'text-blue-600',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
        };
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
        Alertas Emocionais ({alerts.length})
      </h3>
      
      {alerts.map((alert) => {
        const severityInfo = getSeverityInfo(alert.severity);
        const AlertIcon = severityInfo.icon;

        return (
          <Card
            key={alert.id}
            className={cn('border-l-4 active:scale-[0.98] transition-all', severityInfo.borderColor)}
          >
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className={cn('p-2 rounded-lg', severityInfo.bgColor)}>
                  <AlertIcon className={cn('h-4 w-4', severityInfo.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{alert.message}</p>
                  {alert.suggestion && (
                    <div className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-blue-500/5 border border-blue-500/20">
                      <Lightbulb className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-600">{alert.suggestion}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
