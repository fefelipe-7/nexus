import { Card, CardContent } from '@/ui/components/components/ui';
import { ChevronRight, Target, Calendar, Info, Heart, Wallet, Briefcase, Users, Brain, Palmtree, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@nexus/shared';
import { YearlyGoal } from '../../types/yearly-goals.types';
import { LifeArea } from '../../types/life-goals.types';

interface YearlyGoalCardProps {
    goal: YearlyGoal;
    area?: LifeArea;
    onClick?: () => void;
}

const areaIconMap: Record<string, any> = {
    heart: Heart,
    wallet: Wallet,
    briefcase: Briefcase,
    users: Users,
    brain: Brain,
    palmtree: Palmtree,
    sparkles: Sparkles,
};

export function YearlyGoalCard({ goal, area, onClick }: YearlyGoalCardProps) {
    const AreaIcon = area?.icon ? (areaIconMap[area.icon] || Target) : Target;

    return (
        <Card
            className={cn(
                "overflow-hidden border-border/40 shadow-none hover:bg-muted/30 transition-colors cursor-pointer",
                goal.status === 'completed' && "opacity-75 bg-muted/10"
            )}
            onClick={onClick}
        >
            <CardContent className="p-4 sm:p-5">
                <div className="flex gap-4">
                    <div className={cn(
                        "p-3 rounded-xl h-fit",
                        "bg-background border border-border/50 shadow-sm"
                    )}>
                        <AreaIcon className="h-5 w-5" style={{ color: area?.color }} />
                    </div>

                    <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                                    {goal.period}
                                </span>
                                {goal.importance === 'high' && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <AlertTriangle className="h-2.5 w-2.5" />
                                        Crítico
                                    </span>
                                )}
                            </div>

                            <span className={cn(
                                "text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded border",
                                goal.status === 'active' ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                                    goal.status === 'completed' ? "text-blue-600 bg-blue-50 border-blue-100" :
                                        "text-muted-foreground bg-muted border-border"
                            )}>
                                {goal.status === 'completed' ? 'Finalizado' : goal.status}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-foreground leading-tight truncate">
                                {goal.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                                "{goal.description}"
                            </p>
                        </div>

                        <div className="flex items-center gap-4 pt-1">
                            <div className="flex items-center gap-1.5">
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                                <span className="text-[11px] font-medium text-muted-foreground">
                                    Consistência: <strong>{goal.perceivedConsistency}%</strong>
                                </span>
                            </div>
                            {goal.activeMetaIds.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <Target className="h-3 w-3 text-blue-500" />
                                    <span className="text-[11px] font-medium text-muted-foreground">
                                        {goal.activeMetaIds.length} metas
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center self-center px-1">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                </div>

                {/* Consistency bar */}
                <div className="mt-4 h-1 w-full bg-muted/60 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full transition-all duration-500",
                            goal.perceivedConsistency > 75 ? "bg-emerald-500" :
                                goal.perceivedConsistency > 40 ? "bg-blue-500" : "bg-amber-500"
                        )}
                        style={{ width: `${goal.perceivedConsistency}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
