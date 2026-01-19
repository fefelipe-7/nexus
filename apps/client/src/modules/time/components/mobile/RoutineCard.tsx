import { cn } from '@nexus/shared';
import { ChevronRight, ChevronDown, Play, Pause, Clock, Check, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { Routine, TodayRoutine } from '../../types/routines.types';
import { PERIOD_LABELS, PERIOD_ICONS, FREQUENCY_LABELS, ITEM_TYPE_ICONS, EXECUTION_STATUS_COLORS } from '../../types/routines.types';

interface RoutineCardProps {
    routine: Routine;
    todayExecution?: TodayRoutine;
    onClick?: () => void;
    onStart?: () => void;
}

export function RoutineCard({ routine, todayExecution, onClick, onStart }: RoutineCardProps) {
    const [expanded, setExpanded] = useState(false);

    const isPaused = routine.status === 'paused';
    const isExecuted = todayExecution?.execution?.status === 'completed';
    const isInProgress = todayExecution?.execution?.status === 'in_progress';

    const formatDuration = (mins: number) => {
        if (mins < 60) return `${mins}min`;
        const hours = Math.floor(mins / 60);
        const remaining = mins % 60;
        return remaining > 0 ? `${hours}h${remaining}` : `${hours}h`;
    };

    return (
        <div className={cn(
            "overflow-hidden transition-all rounded-xl border",
            isPaused && "opacity-50",
            isExecuted && "border-green-500/30 bg-green-500/5"
        )}>
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-4 flex items-center gap-3"
            >
                {/* Icon */}
                <div
                    className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0",
                        isExecuted ? "bg-green-500/20" : "bg-muted/50"
                    )}
                    style={!isExecuted ? { backgroundColor: `${routine.color}15` } : undefined}
                >
                    {isExecuted ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                        routine.icon
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                        <p className={cn(
                            "text-sm font-semibold truncate",
                            isPaused && "text-muted-foreground"
                        )}>
                            {routine.name}
                        </p>
                        {isPaused && (
                            <Pause className="h-3 w-3 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <span>{PERIOD_ICONS[routine.period]}</span>
                        <span>{PERIOD_LABELS[routine.period]}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(routine.totalDuration)}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{routine.items.length} itens</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                        <p className={cn(
                            "text-sm font-semibold",
                            routine.averageExecutionRate >= 70 && "text-green-500",
                            routine.averageExecutionRate >= 50 && routine.averageExecutionRate < 70 && "text-amber-500",
                            routine.averageExecutionRate < 50 && "text-red-500"
                        )}>
                            {routine.averageExecutionRate}%
                        </p>
                    </div>
                    {expanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
            </button>

            {/* Expanded Items */}
            {expanded && (
                <div className="border-t px-4 py-3 space-y-2">
                    {routine.items.map((item, index) => {
                        const isItemCompleted = todayExecution?.execution?.completedItems.includes(item.id);

                        return (
                            <div
                                key={item.id}
                                className={cn(
                                    "flex items-center gap-3 py-2",
                                    index !== routine.items.length - 1 && "border-b border-dashed"
                                )}
                            >
                                <div className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center text-sm flex-shrink-0">
                                    {isItemCompleted ? (
                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                    ) : (
                                        <span className="text-muted-foreground text-xs">{index + 1}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "text-sm",
                                        isItemCompleted && "text-muted-foreground line-through"
                                    )}>
                                        {item.title}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 text-xs text-muted-foreground">
                                    <span>{ITEM_TYPE_ICONS[item.type]}</span>
                                    <span>{item.duration}min</span>
                                    {item.isOptional && (
                                        <span className="text-[10px] text-amber-500">(opcional)</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Start Button */}
                    {!isExecuted && !isPaused && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onStart?.(); }}
                            className="w-full mt-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                        >
                            <Play className="h-4 w-4" />
                            {isInProgress ? 'Continuar' : 'Iniciar Rotina'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
