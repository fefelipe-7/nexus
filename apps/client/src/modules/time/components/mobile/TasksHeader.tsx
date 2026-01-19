import { Card } from '@/ui/components/components/ui';
import { CheckCircle, AlertTriangle, Clock, Play, Pause, ListTodo } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { TasksSummary, Task } from '../../types/tasks.types';
import { PRIORITY_COLORS } from '../../types/tasks.types';

interface TasksHeaderProps {
    summary: TasksSummary;
}

export function TasksHeader({ summary }: TasksHeaderProps) {
    return (
        <Card className="overflow-hidden">
            <div className="p-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                {/* Main Stats */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Tarefas Ativas
                        </p>
                        <p className="text-3xl font-bold tracking-tight mt-1">
                            {summary.totalActive}
                        </p>
                    </div>
                    {summary.currentFocus && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-500/10">
                            <Play className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-xs font-semibold text-amber-500">Em foco</span>
                        </div>
                    )}
                </div>

                {/* Current Focus */}
                {summary.currentFocus && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
                        <p className="text-xs text-amber-600 mb-1">Trabalhando em:</p>
                        <p className="text-sm font-semibold truncate">{summary.currentFocus.title}</p>
                        {summary.currentFocus.subtasks.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {summary.currentFocus.subtasks.filter(s => s.completed).length}/{summary.currentFocus.subtasks.length} subtarefas
                            </p>
                        )}
                    </div>
                )}

                {/* Insight */}
                {!summary.currentFocus && (
                    <div className={cn(
                        "p-3 rounded-xl mb-4",
                        summary.insight.type === 'warning' && "bg-amber-500/10 border border-amber-500/20",
                        summary.insight.type === 'success' && "bg-green-500/10 border border-green-500/20",
                        summary.insight.type === 'info' && "bg-blue-500/10 border border-blue-500/20",
                        summary.insight.type === 'suggestion' && "bg-purple-500/10 border border-purple-500/20"
                    )}>
                        <p className="text-sm">{summary.insight.message}</p>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-2">
                    <div className="bg-background/60 rounded-xl p-2.5 text-center">
                        <ListTodo className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                        <p className="text-sm font-bold">{summary.todoCount}</p>
                        <p className="text-[9px] text-muted-foreground">A fazer</p>
                    </div>
                    <div className="bg-background/60 rounded-xl p-2.5 text-center">
                        <Play className="h-4 w-4 mx-auto text-amber-500 mb-1" />
                        <p className="text-sm font-bold">{summary.inProgressCount}</p>
                        <p className="text-[9px] text-muted-foreground">Em andamento</p>
                    </div>
                    <div className="bg-background/60 rounded-xl p-2.5 text-center">
                        <CheckCircle className="h-4 w-4 mx-auto text-green-500 mb-1" />
                        <p className="text-sm font-bold">{summary.completedToday}</p>
                        <p className="text-[9px] text-muted-foreground">Hoje</p>
                    </div>
                    <div className={cn(
                        "rounded-xl p-2.5 text-center",
                        summary.noPriorityCount > 0 ? "bg-amber-500/10" : "bg-background/60"
                    )}>
                        <AlertTriangle className={cn(
                            "h-4 w-4 mx-auto mb-1",
                            summary.noPriorityCount > 0 ? "text-amber-500" : "text-muted-foreground"
                        )} />
                        <p className="text-sm font-bold">{summary.noPriorityCount}</p>
                        <p className="text-[9px] text-muted-foreground">Sem prior.</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
