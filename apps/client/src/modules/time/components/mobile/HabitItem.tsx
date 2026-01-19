import { cn } from '@nexus/shared';
import { Flame, Check, ChevronRight, MoreVertical, Pause } from 'lucide-react';
import type { Habit, HabitCheck } from '../../types/habits.types';
import { LIFE_AREA_LABELS, FREQUENCY_LABELS, CHECK_STATUS_COLORS } from '../../types/habits.types';

interface HabitItemProps {
    habit: Habit;
    todayCheck?: HabitCheck;
    onClick?: () => void;
    onCheck?: () => void;
    showDetails?: boolean;
}

export function HabitItem({ habit, todayCheck, onClick, onCheck, showDetails = true }: HabitItemProps) {
    const isChecked = todayCheck?.status === 'done';
    const isPartial = todayCheck?.status === 'partial';
    const isPaused = habit.status === 'paused';

    return (
        <div className={cn(
            "flex items-center gap-3 p-3 transition-all",
            isPaused && "opacity-50"
        )}>
            {/* Check Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onCheck?.(); }}
                disabled={isPaused}
                className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all text-lg",
                    isChecked && "bg-green-500 text-white",
                    isPartial && "bg-amber-500/20 text-amber-500",
                    !isChecked && !isPartial && "bg-muted/50 hover:bg-muted"
                )}
                style={!isChecked && !isPartial ? { backgroundColor: `${habit.color}15` } : undefined}
            >
                {isChecked ? (
                    <Check className="h-5 w-5" />
                ) : isPaused ? (
                    <Pause className="h-4 w-4 text-muted-foreground" />
                ) : (
                    habit.icon
                )}
            </button>

            {/* Content */}
            <button
                onClick={onClick}
                className="flex-1 min-w-0 text-left"
            >
                <div className="flex items-center gap-2">
                    <p className={cn(
                        "text-sm font-semibold truncate",
                        isPaused && "text-muted-foreground"
                    )}>
                        {habit.title}
                    </p>
                    {habit.currentStreak >= 3 && !isPaused && (
                        <span className="flex items-center gap-0.5 text-amber-500">
                            <Flame className="h-3 w-3" />
                            <span className="text-[10px] font-bold">{habit.currentStreak}</span>
                        </span>
                    )}
                </div>

                {showDetails && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <span>{FREQUENCY_LABELS[habit.frequency]}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span style={{ color: habit.color }}>{LIFE_AREA_LABELS[habit.lifeArea]}</span>
                        {habit.targetPerWeek && (
                            <>
                                <span className="text-muted-foreground/50">•</span>
                                <span>{habit.targetPerWeek}x/sem</span>
                            </>
                        )}
                    </div>
                )}
            </button>

            {/* Consistency */}
            {showDetails && (
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                        <p className={cn(
                            "text-sm font-semibold",
                            habit.consistencyRate >= 70 && "text-green-500",
                            habit.consistencyRate >= 50 && habit.consistencyRate < 70 && "text-amber-500",
                            habit.consistencyRate < 50 && "text-red-500"
                        )}>
                            {habit.consistencyRate}%
                        </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            )}
        </div>
    );
}
