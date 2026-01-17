import { cn } from '@nexus/shared';
import { ChevronRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { FinancialGoal } from '../../types/goals.types';
import { GOAL_STATUS_LABELS, GOAL_STATUS_COLORS } from '../../types/goals.types';

interface GoalListItemProps {
    goal: FinancialGoal;
    onClick?: () => void;
}

export function GoalListItem({ goal, onClick }: GoalListItemProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            notation: 'compact',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
    const isBehind = goal.status === 'behind' || goal.status === 'critical';
    const isCompleted = goal.status === 'completed';

    // Calculate days left
    let daysLeftLabel = '';
    if (goal.deadline) {
        const daysLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) {
            daysLeftLabel = 'Vencido';
        } else if (daysLeft === 0) {
            daysLeftLabel = 'Hoje';
        } else if (daysLeft <= 30) {
            daysLeftLabel = `${daysLeft}d`;
        } else if (daysLeft <= 365) {
            daysLeftLabel = `${Math.ceil(daysLeft / 30)}m`;
        } else {
            daysLeftLabel = `${Math.ceil(daysLeft / 365)}a`;
        }
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 p-4 transition-all",
                "active:bg-accent/50 hover:bg-accent/30",
                isCompleted && "opacity-60"
            )}
        >
            {/* Icon */}
            <div
                className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                style={{ backgroundColor: `${goal.color}15` }}
            >
                {goal.icon}
                {isBehind && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center">
                        <AlertTriangle className="h-2.5 w-2.5 text-amber-500" />
                    </span>
                )}
                {isCompleted && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-2.5 w-2.5 text-green-500" />
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{goal.name}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{
                            backgroundColor: `${GOAL_STATUS_COLORS[goal.status]}15`,
                            color: GOAL_STATUS_COLORS[goal.status]
                        }}
                    >
                        {GOAL_STATUS_LABELS[goal.status]}
                    </span>
                    {goal.deadline && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                            <span className="flex items-center gap-0.5">
                                <Clock className="h-3 w-3" />
                                {daysLeftLabel}
                            </span>
                        </>
                    )}
                </div>
                {/* Progress Bar */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all"
                            style={{
                                width: `${Math.min(progressPercentage, 100)}%`,
                                backgroundColor: goal.color
                            }}
                        />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: goal.color }}>
                        {progressPercentage.toFixed(0)}%
                    </span>
                </div>
            </div>

            {/* Amount */}
            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <p className="text-sm font-bold">{formatCurrency(goal.currentAmount)}</p>
                <p className="text-xs text-muted-foreground">
                    de {formatCurrency(goal.targetAmount)}
                </p>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </button>
    );
}
