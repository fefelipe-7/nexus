import { X, Calendar, TrendingUp, Target, Wallet, Clock, AlertTriangle, Edit2, Pause, Play, Trash2, Zap } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { FinancialGoal } from '../../types/goals.types';
import { GOAL_STATUS_LABELS, GOAL_STATUS_COLORS, GOAL_CATEGORY_LABELS } from '../../types/goals.types';

interface GoalDetailSheetProps {
    goal: FinancialGoal | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (goal: FinancialGoal) => void;
    onPause?: (goal: FinancialGoal) => void;
    onSimulate?: (goal: FinancialGoal) => void;
    onDelete?: (goal: FinancialGoal) => void;
}

export function GoalDetailSheet({
    goal,
    isOpen,
    onClose,
    onEdit,
    onPause,
    onSimulate,
    onDelete,
}: GoalDetailSheetProps) {
    if (!isOpen || !goal) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    const isBehind = goal.monthlyContribution < goal.requiredMonthlyContribution;
    const isPaused = goal.status === 'paused';

    // Calculate months left
    let monthsLeft = 0;
    if (goal.deadline) {
        monthsLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30));
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
                <div className="bg-background rounded-t-2xl border-t shadow-xl max-h-[90vh] flex flex-col">
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between px-4 pb-4 border-b">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                                style={{ backgroundColor: `${goal.color}15` }}
                            >
                                {goal.icon}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">{goal.name}</h2>
                                <p className="text-sm text-muted-foreground">{GOAL_CATEGORY_LABELS[goal.category]}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Progress */}
                        <div className="p-4 bg-muted/30 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Progresso</span>
                                <span className="text-sm font-semibold" style={{ color: goal.color }}>
                                    {progressPercentage.toFixed(0)}%
                                </span>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${Math.min(progressPercentage, 100)}%`,
                                        backgroundColor: goal.color
                                    }}
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                <span>Acumulado: {formatCurrency(goal.currentAmount)}</span>
                                <span>Falta: {formatCurrency(remaining)}</span>
                            </div>
                        </div>

                        {/* Contribution Alert */}
                        {isBehind && !isPaused && (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-amber-600">Aporte insuficiente</p>
                                        <p className="text-xs text-amber-600/80 mt-0.5">
                                            Você aporta {formatCurrency(goal.monthlyContribution)}/mês, mas precisa de {formatCurrency(goal.requiredMonthlyContribution)}/mês para atingir no prazo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Details */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Target className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Meta:</span>{' '}
                                    <span className="font-medium">{formatCurrency(goal.targetAmount)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <Wallet className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Aporte atual:</span>{' '}
                                    <span className="font-medium">{formatCurrency(goal.monthlyContribution)}/mês</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Aporte necessário:</span>{' '}
                                    <span className={cn("font-medium", isBehind ? "text-amber-500" : "text-green-500")}>
                                        {formatCurrency(goal.requiredMonthlyContribution)}/mês
                                    </span>
                                </div>
                            </div>

                            {goal.deadline && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1">
                                        <span className="text-muted-foreground">Prazo:</span>{' '}
                                        <span className="font-medium">{formatDate(goal.deadline)}</span>
                                        <span className="text-xs text-muted-foreground ml-1">({monthsLeft} meses)</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <span className="text-muted-foreground">Status:</span>{' '}
                                    <span
                                        className="font-medium"
                                        style={{ color: GOAL_STATUS_COLORS[goal.status] }}
                                    >
                                        {GOAL_STATUS_LABELS[goal.status]}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Milestones */}
                        {goal.milestones && goal.milestones.length > 0 && (
                            <div className="p-4 bg-muted/30 rounded-xl">
                                <p className="text-sm font-medium mb-3">Marcos</p>
                                <div className="flex items-center gap-2">
                                    {goal.milestones.map((milestone, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "flex-1 h-2 rounded-full",
                                                milestone.reached ? "bg-primary" : "bg-muted"
                                            )}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                    {goal.milestones.map((milestone, index) => (
                                        <span key={index}>{milestone.percentage}%</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {goal.notes && (
                            <div className="p-3 bg-muted/30 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Observações</p>
                                <p className="text-sm">{goal.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="border-t p-4 bg-muted/30 space-y-3">
                        <Button
                            className="w-full"
                            onClick={() => onSimulate?.(goal)}
                        >
                            <Zap className="h-4 w-4 mr-2" />
                            Simular Cenários
                        </Button>
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                variant="outline"
                                onClick={() => onEdit?.(goal)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onPause?.(goal)}
                            >
                                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="outline"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => onDelete?.(goal)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
