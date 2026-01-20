import { Card, CardContent } from '@/ui/components/components/ui';
import {
    ChevronRight,
    Target,
    Calendar,
    AlertCircle,
    CheckCircle2,
    Layers,
    Heart, Wallet, Briefcase, Users, Brain, Palmtree, Sparkles,
    AlertTriangle,
    History
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { ShortTermGoal } from '../../types/short-term-goals.types';
import { LifeArea } from '../../types/life-goals.types';

interface ShortTermGoalCardProps {
    goal: ShortTermGoal;
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

export function ShortTermGoalCard({ goal, area, onClick }: ShortTermGoalCardProps) {
    const AreaIcon = area?.icon ? (areaIconMap[area.icon] || Target) : Target;

    const getDaysRemaining = (deadline: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(deadline);
        target.setHours(0, 0, 0, 0);
        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysRemaining = getDaysRemaining(goal.deadline);
    const isOverdue = daysRemaining < 0 && goal.status !== 'completed';

    return (
        <Card
            className={cn(
                "overflow-hidden border-border/40 shadow-none hover:bg-muted/30 transition-colors cursor-pointer",
                goal.isAtRisk && "border-rose-500/20 bg-rose-500/[0.01]"
            )}
            onClick={onClick}
        >
            <CardContent className="p-4 sm:p-5">
                <div className="flex gap-4">
                    <div className={cn(
                        "p-3 rounded-xl h-fit border shadow-sm",
                        goal.status === 'completed' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-background border-border/50"
                    )}>
                        {goal.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                            <AreaIcon className="h-5 w-5" style={{ color: area?.color }} />
                        )}
                    </div>

                    <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md",
                                    goal.priority === 'high' ? "text-rose-600 bg-rose-500/10" :
                                        goal.priority === 'medium' ? "text-amber-600 bg-amber-500/10" :
                                            "text-blue-600 bg-blue-500/10"
                                )}>
                                    {goal.priority === 'high' ? 'Crítica' : goal.priority === 'medium' ? 'Média' : 'Baixa'}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                                    {area?.name}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 overflow-hidden">
                                {goal.isAtRisk && (
                                    <AlertTriangle className="h-3 w-3 text-rose-500 animate-pulse shrink-0" />
                                )}
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-tighter truncate",
                                    isOverdue ? "text-rose-500" :
                                        daysRemaining <= 3 ? "text-amber-500" : "text-muted-foreground"
                                )}>
                                    {goal.status === 'completed' ? 'Concluída' :
                                        isOverdue ? 'Atrasada' :
                                            `${daysRemaining} dias`}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className={cn(
                                "text-base font-bold text-foreground leading-tight truncate",
                                goal.status === 'completed' && "line-through opacity-60"
                            )}>
                                {goal.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Layers className="h-3 w-3 text-muted-foreground" />
                                <span className="text-[10px] font-medium text-muted-foreground truncate">
                                    {goal.milestones.filter(m => m.isCompleted).length}/{goal.milestones.length} marcos concluídos
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-1">
                            <div className="flex-1 h-1.5 bg-muted/60 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-700 rounded-full",
                                        goal.status === 'completed' ? "bg-emerald-500" :
                                            goal.isAtRisk ? "bg-rose-500" : "bg-blue-500"
                                    )}
                                    style={{ width: `${goal.progress}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-foreground/70">
                                {goal.progress}%
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center self-center px-1">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                </div>

                {goal.isAtRisk && goal.riskReason && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-start gap-2">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                        <p className="text-[10px] font-medium text-rose-600/80 leading-relaxed italic">
                            {goal.riskReason}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
