import { Card, CardContent } from '@/ui/components/components/ui';
import {
    Activity,
    CheckCircle2,
    AlertCircle,
    Zap,
    TrendingUp,
    Brain
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { GoalConnection } from '../../types/connections.types';

interface GoalHabitLinksProps {
    connections: GoalConnection[];
}

export function GoalHabitLinks({ connections }: GoalHabitLinksProps) {
    return (
        <div className="space-y-6">
            <div className="px-1 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5" />
                    Sustentação por Hábitos
                </h3>
            </div>

            <div className="space-y-6">
                {connections.map((conn) => (
                    <div key={conn.goalId} className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                            <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                conn.areaId === 'finance' ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
                            )}>
                                {conn.level}
                            </span>
                            <h4 className="text-[11px] font-bold text-foreground/80 uppercase tracking-tighter">{conn.goalTitle}</h4>
                        </div>

                        <div className="grid gap-2">
                            {conn.habits.map((habit) => (
                                <Card key={habit.id} className="border-border/40 shadow-none bg-background">
                                    <CardContent className="p-4 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={cn(
                                                "p-2 rounded-lg",
                                                habit.isSustaining ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                                            )}>
                                                {habit.isSustaining ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                            </div>
                                            <div className="grow min-w-0">
                                                <h5 className="text-sm font-bold text-foreground truncate">{habit.title}</h5>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-medium text-muted-foreground">Impacto {habit.impact}</span>
                                                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                                    <span className="text-[10px] font-bold text-foreground/60">{habit.consistency}% Consistência</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className={cn(
                                                "text-[9px] font-bold uppercase",
                                                habit.type === 'direct' ? "text-blue-500" : "text-muted-foreground/60"
                                            )}>
                                                {habit.type}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {conn.habits.length === 0 && (
                                <div className="p-4 rounded-xl border border-dashed border-border/60 flex items-center justify-center gap-2 bg-muted/5">
                                    <Brain className="h-3.5 w-3.5 text-muted-foreground/40" />
                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Nenhum hábito associado</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
