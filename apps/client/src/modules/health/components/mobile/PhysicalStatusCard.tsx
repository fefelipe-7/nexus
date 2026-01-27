import { Card, CardContent } from '@/ui/components/components/ui';
import { Activity, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { PhysicalHealthSummary } from '../../types/physical-health.types';

interface PhysicalStatusCardProps {
  summary: PhysicalHealthSummary;
}

export function PhysicalStatusCard({ summary }: PhysicalStatusCardProps) {
  const getStatusInfo = () => {
    switch (summary.overallStatus) {
      case 'good':
        return {
          icon: CheckCircle2,
          label: 'Corpo Funcional',
          color: 'text-green-600',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
        };
      case 'attention':
        return {
          icon: AlertTriangle,
          label: 'Ajustes Necessários',
          color: 'text-amber-600',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
        };
      default:
        return {
          icon: AlertCircle,
          label: 'Atenção Urgente',
          color: 'text-red-600',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
        };
    }
  };

  const getTrendIcon = () => {
    switch (summary.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const formatLastCheckIn = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Há poucos minutos';
    if (hours < 24) return `Há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Há ${days}d`;
  };

  return (
    <div className="space-y-3">
      <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border', statusInfo.bgColor, statusInfo.borderColor)}>
        <StatusIcon className={cn('h-5 w-5', statusInfo.color)} />
        <span className={cn('text-sm font-medium', statusInfo.color)}>
          {statusInfo.label}
        </span>
      </div>

      <Card className="bg-gradient-to-br from-red-500/10 via-rose-500/5 to-orange-500/5">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Energia Física</p>
                <p className="text-xl font-bold text-foreground">
                  {summary.physicalEnergy}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
            </div>
          </div>

          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                summary.physicalEnergy >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                summary.physicalEnergy >= 40 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                'bg-gradient-to-r from-red-500 to-rose-500'
              )}
              style={{ width: `${summary.physicalEnergy}%` }}
            />
          </div>

          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Última atualização: {formatLastCheckIn(summary.lastCheckIn)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
