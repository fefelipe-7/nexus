import { cn } from '@nexus/shared';
import { ChevronRight, Clock, AlertTriangle, CheckCircle, RotateCw, Link, Repeat } from 'lucide-react';
import type { Commitment } from '../../types/commitments.types';
import { ORIGIN_COLORS, TYPE_ICONS, STATUS_COLORS, PRIORITY_COLORS, PRIORITY_LABELS } from '../../types/commitments.types';

interface CommitmentItemProps {
    commitment: Commitment;
    onClick?: () => void;
    compact?: boolean;
}

export function CommitmentItem({ commitment, onClick, compact }: CommitmentItemProps) {
    const formatDate = (date: Date) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Hoje';
        if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã';
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    const isOverdue = commitment.status === 'overdue';
    const isCompleted = commitment.status === 'completed';
    const isCritical = commitment.priority === 'critical';

    const statusIcon = () => {
        switch (commitment.status) {
            case 'overdue': return <AlertTriangle className="h-3.5 w-3.5 text-red-500" />;
            case 'completed': return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
            case 'rescheduled': return <RotateCw className="h-3.5 w-3.5 text-amber-500" />;
            default: return null;
        }
    };

    if (compact) {
        return (
            <button
                onClick={onClick}
                className={cn(
                    "w-full flex items-center gap-2 p-2 rounded-lg transition-all",
                    "hover:bg-accent/30 active:bg-accent/50",
                    isCompleted && "opacity-50"
                )}
            >
                <span className="text-lg">{TYPE_ICONS[commitment.type]}</span>
                <div className="flex-1 min-w-0 text-left">
                    <p className={cn("text-sm font-medium truncate", isCompleted && "line-through")}>
                        {commitment.title}
                    </p>
                </div>
                {statusIcon()}
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 p-3 transition-all",
                "hover:bg-accent/30 active:bg-accent/50",
                isCompleted && "opacity-50",
                isOverdue && "bg-red-500/5",
                isCritical && !isOverdue && !isCompleted && "bg-amber-500/5"
            )}
        >
            {/* Icon */}
            <div className={cn(
                "relative w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0",
                isOverdue ? "bg-red-500/10" : isCritical ? "bg-amber-500/10" : "bg-muted/50"
            )}>
                {TYPE_ICONS[commitment.type]}
                {isOverdue && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center">
                        <AlertTriangle className="h-2 w-2 text-white" />
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-start gap-2">
                    <p className={cn(
                        "text-sm font-semibold truncate",
                        isCompleted && "line-through text-muted-foreground"
                    )}>
                        {commitment.title}
                    </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 flex-wrap">
                    {commitment.dueDate && (
                        <span className={cn(
                            "flex items-center gap-0.5",
                            isOverdue && "text-red-500 font-medium"
                        )}>
                            <Clock className="h-3 w-3" />
                            {formatDate(commitment.dueDate)}
                            {commitment.dueTime && ` ${commitment.dueTime}`}
                        </span>
                    )}
                    {!commitment.dueDate && (
                        <span className="text-amber-500">Sem data</span>
                    )}
                    <span
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: ORIGIN_COLORS[commitment.origin] }}
                    />
                    <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{
                            backgroundColor: `${PRIORITY_COLORS[commitment.priority]}15`,
                            color: PRIORITY_COLORS[commitment.priority]
                        }}
                    >
                        {PRIORITY_LABELS[commitment.priority]}
                    </span>
                    {commitment.isRecurring && <Repeat className="h-3 w-3" />}
                    {(commitment.linkedGoalId || commitment.linkedProjectId) && (
                        <Link className="h-3 w-3 text-primary" />
                    )}
                </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                {commitment.rescheduledCount > 0 && !isCompleted && (
                    <span className="text-[10px] text-amber-500 font-medium">
                        {commitment.rescheduledCount}x
                    </span>
                )}
                {statusIcon()}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
        </button>
    );
}
