import { Card, CardContent } from '@/ui/components/components/ui';
import { Activity, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { HoverCard } from '@/ui/components/desktop';
import { cn } from '@nexus/shared';
import type { PhysicalHealthSummary } from '../../types/physical-health.types';

interface PhysicalHealthOverviewProps {
  summary: PhysicalHealthSummary;
}

export function PhysicalHealthOverview({ summary }: PhysicalHealthOverviewProps) {
  const getStatusInfo = () => {
    switch (summary.overallStatus) {
      case 'good':
        return {
          icon: CheckCircle2,
          label: 'Corpo Funcional',
          description: 'Seu corpo está sustentando bem sua rotina',
          color: 'text-green-600',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
        };
      case 'attention':
        return {
          icon: AlertTriangle,
          label: 'Ajustes Necessários',
          description: 'Alguns aspectos precisam de atenção',
          color: 'text-amber-600',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
        };
      default:
        return {
          icon: AlertCircle,
          label: 'Atenção Urgente',
          description: 'Seu corpo precisa de cuidados imediatos',
          color: 'text-red-600',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
        };
    }
  };

  const getTrendIcon = () => {
    switch (summary.trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendLabel = () => {
    switch (summary.trend) {
      case 'up':
        return 'Melhor que o período anterior';
      case 'down':
        return 'Pior que o período anterior';
      default:
        return 'Estável em relação ao período anterior';
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <HoverCard
        trigger={
          <Card className={cn('cursor-help transition-all hover:shadow-md border-l-4', statusInfo.borderColor)}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={cn('p-3 rounded-lg', statusInfo.bgColor)}>
                  <StatusIcon className={cn('h-6 w-6', statusInfo.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status Geral</p>
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
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Saúde Física</h4>
            </div>
            <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
          </div>
        }
      />

      <Card className="border-l-4 border-l-red-500/30 hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20">
              <Activity className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Energia Física</p>
              <p className="text-2xl font-bold">{summary.physicalEnergy}%</p>
            </div>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
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
        </CardContent>
      </Card>

      <HoverCard
        trigger={
          <Card className="border-l-4 border-l-blue-500/30 cursor-help transition-all hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Tendência</p>
                {getTrendIcon()}
              </div>
              <p className="text-sm font-semibold">{getTrendLabel()}</p>
            </CardContent>
          </Card>
        }
        content={
          <div className="space-y-2">
            <h4 className="font-semibold">Tendência Recente</h4>
            <p className="text-sm text-muted-foreground">
              Comparação com o período anterior baseada em energia, movimento e recuperação.
            </p>
          </div>
        }
      />
    </div>
  );
}
