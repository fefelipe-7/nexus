import { Card, CardContent } from '@/ui/components/components/ui';
import { Battery, Moon, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { RecoveryData } from '../../types/physical-health.types';

interface RecoveryCardProps {
  recovery: RecoveryData;
}

export function RecoveryCard({ recovery }: RecoveryCardProps) {
  const getRecoveryStatusInfo = () => {
    switch (recovery.status) {
      case 'recovered':
        return {
          icon: CheckCircle2,
          label: 'Bem Recuperado',
          color: 'text-green-600',
          bgColor: 'bg-green-500/10',
        };
      case 'recovering':
        return {
          icon: Battery,
          label: 'Em Recuperação',
          color: 'text-amber-600',
          bgColor: 'bg-amber-500/10',
        };
      default:
        return {
          icon: AlertTriangle,
          label: 'Risco de Overtraining',
          color: 'text-red-600',
          bgColor: 'bg-red-500/10',
        };
    }
  };

  const statusInfo = getRecoveryStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Recuperação Física</h3>
          <div className={cn('px-2.5 py-1 rounded-full flex items-center gap-1.5', statusInfo.bgColor)}>
            <StatusIcon className={cn('h-3.5 w-3.5', statusInfo.color)} />
            <span className={cn('text-xs font-medium', statusInfo.color)}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Overtraining Warning */}
        {recovery.overtrainingRisk && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-600">Sinais de sobrecarga</p>
                <p className="text-xs text-red-600/80 mt-0.5">
                  Considere reduzir intensidade ou volume nos próximos treinos
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recovery Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Moon className="h-3.5 w-3.5 text-blue-600" />
              <p className="text-xs text-muted-foreground">Sono</p>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-lg font-bold">{recovery.sleepQuality}</p>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full',
                  recovery.sleepQuality >= 70 ? 'bg-green-500' : 
                  recovery.sleepQuality >= 50 ? 'bg-amber-500' : 'bg-red-500'
                )}
                style={{ width: `${recovery.sleepQuality}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-3.5 w-3.5 text-orange-600" />
              <p className="text-xs text-muted-foreground">Fadiga</p>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-lg font-bold">{recovery.fatigue}</p>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full',
                  recovery.fatigue <= 30 ? 'bg-green-500' : 
                  recovery.fatigue <= 60 ? 'bg-amber-500' : 'bg-red-500'
                )}
                style={{ width: `${recovery.fatigue}%` }}
              />
            </div>
          </div>
        </div>

        {/* Rest Days */}
        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Dias de descanso (7d)</span>
            <span className="font-semibold">{recovery.restDays} dias</span>
          </div>
          {recovery.lastRestDay && (
            <p className="text-xs text-muted-foreground mt-1">
              Último descanso: {recovery.lastRestDay.toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
