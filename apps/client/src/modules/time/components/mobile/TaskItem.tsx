import { cn } from '@nexus/shared';
import { ChevronRight, ChevronDown, CheckCircle, Circle, Clock, Link, Play, Pause } from 'lucide-react';
import { useState } from 'react';
import type { Task } from '../../types/tasks.types';
import { PRIORITY_COLORS, PRIORITY_LABELS, EFFORT_ICONS, LIFE_AREA_COLORS } from '../../types/tasks.types';

interface TaskItemProps {
    task: Task;
    onClick?: () => void;
    onToggleComplete?: () => void;
    compact?: boolean;
}

export function TaskItem({ task, onClick, onToggleComplete, compact }: TaskItemProps) {
    const [expanded, setExpanded] = useState(false);

    const isCompleted = task.status === 'completed';
    const isInProgress = task.status === 'in_progress';
    const isPaused = task.status === 'paused';
    const hasSubtasks = task.subtasks.length > 0;
    const completedSubtasks = task.subtasks.filter(s => s.completed).length;

    const formatDate = (date: Date) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (date.toDateString() === today.toDateString()) return 'Hoje';
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
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
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleComplete?.(); }}
                    className="flex-shrink-0"
                >
                    {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                </button>
                <span className={cn(
                    "text-sm truncate",
                    isCompleted && "line-through text-muted-foreground"
                )}>
                    {task.title}
                </span>
            </button>
        );
    }

    return (
        <div className={cn(
            "w-full transition-all",
            isCompleted && "opacity-60"
        )}>
            <button
                onClick={onClick}
                className={cn(
                    "w-full flex items-center gap-3 p-3 transition-all",
                    "hover:bg-accent/30 active:bg-accent/50",
                    isInProgress && "bg-amber-500/5",
                    isPaused && "bg-purple-500/5"
                )}
            >
                {/* Checkbox */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleComplete?.(); }}
                    className="flex-shrink-0"
                >
                    {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : isInProgress ? (
                        <Play className="h-5 w-5 text-amber-500" />
                    ) : isPaused ? (
                        <Pause className="h-5 w-5 text-purple-500" />
                    ) : (
                        <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                        <p className={cn(
                            "text-sm font-medium truncate",
                            isCompleted && "line-through text-muted-foreground"
                        )}>
                            {task.title}
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 flex-wrap">
                        {/* Priority */}
                        {task.priority !== 'none' && (
                            <span
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                                style={{
                                    backgroundColor: `${PRIORITY_COLORS[task.priority]}15`,
                                    color: PRIORITY_COLORS[task.priority]
                                }}
                            >
                                {PRIORITY_LABELS[task.priority]}
                            </span>
                        )}
                        {/* Effort */}
                        {task.effort && (
                            <span className="text-[10px]">{EFFORT_ICONS[task.effort]}</span>
                        )}
                        {/* Due date */}
                        {task.dueDate && (
                            <span className="flex items-center gap-0.5">
                                <Clock className="h-3 w-3" />
                                {formatDate(task.dueDate)}
                            </span>
                        )}
                        {/* Subtasks */}
                        {hasSubtasks && (
                            <span className="text-[10px]">
                                {completedSubtasks}/{task.subtasks.length}
                            </span>
                        )}
                        {/* Links */}
                        {(task.linkedProjectId || task.linkedGoalId) && (
                            <Link className="h-3 w-3 text-primary" />
                        )}
                        {/* Postponed */}
                        {task.postponedCount > 0 && (
                            <span className="text-amber-500 text-[10px]">
                                {task.postponedCount}x adiada
                            </span>
                        )}
                    </div>
                </div>

                {/* Expand / Navigate */}
                {hasSubtasks ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                        className="p-1"
                    >
                        {expanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                    </button>
                ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
            </button>

            {/* Subtasks */}
            {expanded && hasSubtasks && (
                <div className="pl-10 pr-3 pb-2 space-y-1">
                    {task.subtasks.map(subtask => (
                        <div
                            key={subtask.id}
                            className="flex items-center gap-2 py-1"
                        >
                            {subtask.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={cn(
                                "text-sm",
                                subtask.completed && "line-through text-muted-foreground"
                            )}>
                                {subtask.title}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
