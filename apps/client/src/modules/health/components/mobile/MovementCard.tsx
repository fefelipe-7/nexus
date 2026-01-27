import { Card, CardContent } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Minus, Flame, Trophy, Calendar } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { MovementData } from '../../types/physical-health.types';

interface MovementCardProps {
  movement: MovementData;
}

export function MovementCard({ movement }: MovementCardProps) {
  const progressPercentage = (movement.weeklyActive / movement.weeklyGoal) * 100;
  const isOnTrack = movement.weeklyActive >= movement.weeklyGoal;

  const getTrendIcon = () => {
    switch (movement.weeklyVolume.trend) {
      case 'up':
        return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
      default:
        return <Minus className="h-3.5 w-3.5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Movimento & Atividade</h3>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Weekly Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground">Dias ativos esta semana</p>
              <p className="text-lg font-bold">
                {movement.weeklyActive} / {movement.weeklyGoal} dias
              </p>
            </div>
            <span className={cn(
              'text-xs font-medium',
              isOnTrack ? 'text-green-600' : 'text-amber-600'
            )}>
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                isOnTrack ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
              )}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-3.5 w-3.5 text-orange-600" />
              <p className="text-xs text-muted-foreground">Sequência Atual</p>
            </div>
            <p className="text-xl font-bold">
              {movement.currentStreak}
              <span className="text-xs text-muted-foreground ml-1">dias</span>
            </p>
          </div>

          <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/10 to-amber-500/10">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-3.5 w-3.5 text-yellow-600" />
              <p className="text-xs text-muted-foreground">Melhor Seq.</p>
            </div>
            <p className="text-xl font-bold">
              {movement.longestStreak}
              <span className="text-xs text-muted-foreground ml-1">dias</span>
            </p>
          </div>
        </div>

        {/* Weekly Volume */}
        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Volume semanal</p>
              <p className="text-sm font-medium">
                {movement.weeklyVolume.current}h <span className="text-xs text-muted-foreground">/ {movement.weeklyVolume.average}h média</span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
