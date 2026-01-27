import { Card, CardContent } from '@/ui/components/components/ui';
import { AlertTriangle, Clock, Brain, Users, TrendingUp, HelpCircle } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { StressData } from '../../types/mental-health.types';

interface StressSourcesCardProps {
  stress: StressData;
}

export function StressSourcesCard({ stress }: StressSourcesCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'deadlines':
        return Clock;
      case 'decisions':
        return Brain;
      case 'conflicts':
        return Users;
      case 'workload':
        return TrendingUp;
      default:
        return HelpCircle;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      deadlines: 'Prazos',
      decisions: 'Decisões',
      conflicts: 'Conflitos',
      workload: 'Carga',
      uncertainty: 'Incerteza',
      other: 'Outro',
    };
    return labels[category] || category;
  };

  const getStressLevelColor = () => {
    switch (stress.currentLevel) {
      case 'critical':
        return { text: 'text-red-600', bg: 'bg-red-500/10', bar: 'bg-red-500' };
      case 'high':
        return { text: 'text-orange-600', bg: 'bg-orange-500/10', bar: 'bg-orange-500' };
      case 'moderate':
        return { text: 'text-amber-600', bg: 'bg-amber-500/10', bar: 'bg-amber-500' };
      default:
        return { text: 'text-green-600', bg: 'bg-green-500/10', bar: 'bg-green-500' };
    }
  };

  const colors = getStressLevelColor();

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Fontes de Estresse</h3>
          <div className={cn('px-2.5 py-1 rounded-full flex items-center gap-1.5', colors.bg)}>
            <AlertTriangle className={cn('h-3.5 w-3.5', colors.text)} />
            <span className={cn('text-xs font-medium capitalize', colors.text)}>
              {stress.currentLevel === 'critical' ? 'Crítico' : 
               stress.currentLevel === 'high' ? 'Alto' :
               stress.currentLevel === 'moderate' ? 'Moderado' : 'Baixo'}
            </span>
          </div>
        </div>

        {/* Overall Stress */}
        <div className={cn('p-3 rounded-lg', colors.bg)}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Sobrecarga Percebida</p>
            <span className={cn('text-sm font-bold', colors.text)}>{stress.perceivedOverload}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', colors.bar)}
              style={{ width: `${stress.perceivedOverload}%` }}
            />
          </div>
        </div>

        {/* Stress Sources */}
        {stress.sources.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Principais fontes:</p>
            {stress.sources.slice(0, 3).map((source) => {
              const Icon = getCategoryIcon(source.category);
              const intensity = source.intensity * 10; // Convert 1-10 to percentage

              return (
                <div
                  key={source.id}
                  className="p-2.5 rounded-lg bg-muted/30"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className="p-1.5 rounded bg-muted">
                      <Icon className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{getCategoryLabel(source.category)}</span>
                        {source.duration === 'chronic' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700">
                            Crônico
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{source.description}</p>
                    </div>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${intensity}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma fonte de estresse identificada
          </p>
        )}
      </CardContent>
    </Card>
  );
}
