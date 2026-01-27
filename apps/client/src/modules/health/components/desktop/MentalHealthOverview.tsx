import { Card, CardContent } from '@/ui/components/components/ui';
import { Brain, Smile, Zap, Battery, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { HoverCard } from '@/ui/components/desktop';
import { cn } from '@nexus/shared';
import type { MentalHealthSummary } from '../../types/mental-health.types';

interface MentalHealthOverviewProps {
  summary: MentalHealthSummary;
}

export function MentalHealthOverview({ summary }: MentalHealthOverviewProps) {
  const getStatusInfo = () => {
    switch (summary.overallStatus) {
      case 'stable':
        return {
          icon: CheckCircle2,
          label: 'Estado Estável',
          description: 'Seu estado emocional está equilibrado',
          color: 'text-green-600',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
        };
      case 'attention':
        return {
          icon: AlertTriangle,
          label: 'Necessita Atenção',
          description: 'Alguns aspectos emocionais precisam de cuidado',
          color: 'text-amber-600',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
        };
      default:
        return {
          icon: AlertCircle,
          label: 'Sobrecarga Detectada',
          description: 'Seu estado mental indica sobrecarga significativa',
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

  const indicators = [
    { icon: Smile, label: 'Humor Médio', value: summary.indicators.averageMood, color: 'blue' },
    { icon: Zap, label: 'Estresse', value: summary.indicators.stressLevel, color: 'orange', inverted: true },
    { icon: Brain, label: 'Clareza Mental', value: summary.indicators.mentalClarity, color: 'purple' },
    { icon: Battery, label: 'Energia Emocional', value: summary.indicators.emotionalEnergy, color: 'green' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
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
              <Brain className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Saúde Mental</h4>
            </div>
            <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
          </div>
        }
      />

      {indicators.map((item) => {
        const Icon = item.icon;
        const borderColor = `border-${item.color}-500/30`;
        
        return (
          <Card key={item.label} className={cn('border-l-4 hover:shadow-md transition-shadow', borderColor)}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-lg bg-${item.color}-500/10`}>
                  <Icon className={`h-6 w-6 text-${item.color}-600`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold">{item.value}%</p>
                </div>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    item.inverted
                      ? item.value >= 70 ? `bg-red-500` : item.value >= 50 ? `bg-amber-500` : `bg-green-500`
                      : item.value >= 70 ? `bg-green-500` : item.value >= 40 ? `bg-amber-500` : `bg-red-500`
                  )}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
