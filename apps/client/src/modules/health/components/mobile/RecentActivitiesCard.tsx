import { Card, CardContent } from '@/ui/components/components/ui';
import { Dumbbell, Footprints, Trophy, Zap } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { Activity } from '../../types/physical-health.types';

interface RecentActivitiesCardProps {
  activities: Activity[];
}

export function RecentActivitiesCard({ activities }: RecentActivitiesCardProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'workout':
        return Dumbbell;
      case 'sport':
        return Trophy;
      case 'walk':
        return Footprints;
      default:
        return Zap;
    }
  };

  const getIntensityColor = (intensity?: Activity['intensity']) => {
    switch (intensity) {
      case 'high':
        return 'text-red-600';
      case 'moderate':
        return 'text-amber-600';
      case 'light':
        return 'text-green-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <h3 className="text-sm font-semibold">Atividades Recentes</h3>

        {activities.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">Nenhuma atividade registrada</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 active:bg-muted/50 active:scale-[0.98] transition-all"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20">
                    <ActivityIcon className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground">{formatDate(activity.date)}</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">{activity.duration}min</p>
                      {activity.intensity && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className={cn('text-xs font-medium', getIntensityColor(activity.intensity))}>
                            {activity.intensity === 'high' ? 'Alto' : activity.intensity === 'moderate' ? 'Moderado' : 'Leve'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
