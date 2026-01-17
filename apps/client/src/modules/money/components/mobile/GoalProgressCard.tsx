import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { InvestmentGoal } from '../../types/investments.types';

interface GoalProgressCardProps {
    goals: InvestmentGoal[];
}

export function GoalProgressCard({ goals }: GoalProgressCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    if (goals.length === 0) return null;

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Metas de Investimento</h3>
            </div>

            <div className="space-y-4">
                {goals.map((goal) => {
                    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
                    const remaining = goal.targetAmount - goal.currentAmount;

                    let timeLabel = '';
                    if (goal.deadline) {
                        const months = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30));
                        timeLabel = months > 0 ? `${months} meses restantes` : 'Prazo vencido';
                    }

                    return (
                        <div key={goal.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{goal.icon}</span>
                                    <div>
                                        <p className="text-sm font-medium">{goal.name}</p>
                                        {timeLabel && (
                                            <p className="text-xs text-muted-foreground">{timeLabel}</p>
                                        )}
                                    </div>
                                </div>
                                <span className="text-sm font-semibold" style={{ color: goal.color }}>
                                    {percentage.toFixed(0)}%
                                </span>
                            </div>

                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${Math.min(percentage, 100)}%`,
                                        backgroundColor: goal.color
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{formatCurrency(goal.currentAmount)}</span>
                                <span>Faltam {formatCurrency(remaining)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
