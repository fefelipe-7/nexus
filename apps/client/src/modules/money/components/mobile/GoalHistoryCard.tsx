import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { GoalHistory } from '../../types/reports.types';

interface GoalHistoryCardProps {
    goals: GoalHistory[];
}

export function GoalHistoryCard({ goals }: GoalHistoryCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const completedGoals = goals.filter(g => g.status === 'completed');
    const abandonedGoals = goals.filter(g => g.status === 'abandoned');

    // Calculate average delay
    const goalsWithDelay = completedGoals.filter(g => g.actualDuration && g.actualDuration > g.plannedDuration);
    const avgDelay = goalsWithDelay.length > 0
        ? goalsWithDelay.reduce((sum, g) => sum + ((g.actualDuration || 0) - g.plannedDuration), 0) / goalsWithDelay.length
        : 0;

    // Auto contribution success rate
    const autoContribGoals = goals.filter(g => g.hadAutoContribution && g.status !== 'active');
    const autoContribSuccess = autoContribGoals.length > 0
        ? (autoContribGoals.filter(g => g.status === 'completed').length / autoContribGoals.length) * 100
        : 0;

    return (
        <Card className="p-4">
            <h3 className="text-sm font-semibold mb-4">Histórico de Metas</h3>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-green-500/10 rounded-lg">
                    <p className="text-lg font-bold text-green-500">{completedGoals.length}</p>
                    <p className="text-[10px] text-muted-foreground">Concluídas</p>
                </div>
                <div className="text-center p-2 bg-red-500/10 rounded-lg">
                    <p className="text-lg font-bold text-red-500">{abandonedGoals.length}</p>
                    <p className="text-[10px] text-muted-foreground">Abandonadas</p>
                </div>
                <div className="text-center p-2 bg-amber-500/10 rounded-lg">
                    <p className="text-lg font-bold text-amber-500">{Math.round(avgDelay)}d</p>
                    <p className="text-[10px] text-muted-foreground">Atraso médio</p>
                </div>
            </div>

            {/* Insight */}
            {autoContribSuccess > 0 && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg mb-4">
                    <p className="text-xs">
                        <span className="font-medium text-primary">{autoContribSuccess.toFixed(0)}%</span> das metas com aporte automático foram concluídas
                    </p>
                </div>
            )}

            {/* Goal list */}
            <div className="space-y-2">
                {goals.map(goal => {
                    const delayDays = goal.actualDuration ? goal.actualDuration - goal.plannedDuration : 0;

                    return (
                        <div
                            key={goal.id}
                            className={cn(
                                "flex items-center gap-3 p-2 rounded-lg",
                                goal.status === 'completed' && "bg-green-500/5",
                                goal.status === 'abandoned' && "bg-red-500/5",
                                goal.status === 'active' && "bg-muted/30"
                            )}
                        >
                            <span className="text-xl">{goal.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{goal.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatCurrency(goal.targetAmount)}
                                    {goal.hadAutoContribution && ' • Auto'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={cn(
                                    "text-xs font-medium",
                                    goal.status === 'completed' && "text-green-500",
                                    goal.status === 'abandoned' && "text-red-500",
                                    goal.status === 'active' && "text-primary"
                                )}>
                                    {goal.status === 'completed' && '✓ Concluída'}
                                    {goal.status === 'abandoned' && '✗ Abandonada'}
                                    {goal.status === 'active' && 'Em andamento'}
                                </p>
                                {delayDays > 0 && goal.status === 'completed' && (
                                    <p className="text-[10px] text-amber-500">+{delayDays}d do previsto</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
