import { Card, CardContent } from '@/ui/components/components/ui';
import {
    ChevronRight,
    Target,
    Layers,
    Lock,
    AlertCircle,
    Activity,
    Heart, Wallet, Briefcase, Users, Brain, Palmtree, Sparkles
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { ActionPlan } from '../../types/action-plans.types';
import { LifeArea } from '../../types/life-goals.types';

interface ActionPlanCardProps {
    plan: ActionPlan;
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

export function ActionPlanCard({ plan, area, onClick }: ActionPlanCardProps) {
    const AreaIcon = area?.icon ? (areaIconMap[area.icon] || Target) : Target;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'on_track': return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
            case 'blocked': return 'text-rose-600 bg-rose-500/10 border-rose-500/20';
            case 'needs_attention': return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
            default: return 'text-muted-foreground bg-muted border-transparent';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'on_track': return 'No Ritmo';
            case 'blocked': return 'Bloqueado';
            case 'needs_attention': return 'Atenção';
            case 'completed': return 'Finalizado';
            default: return 'Inativo';
        }
    };

    const totalSteps = plan.steps.length;
    const completedSteps = plan.steps.filter(s => s.status === 'completed').length;

    return (
        <Card
            className={cn(
                "overflow-hidden border-border/40 shadow-none hover:bg-muted/30 transition-colors cursor-pointer",
                plan.status === 'blocked' && "bg-rose-500/[0.01]"
            )}
            onClick={onClick}
        >
            <CardContent className="p-4 sm:p-5">
                <div className="flex gap-4">
                    <div className={cn(
                        "p-3 rounded-xl h-fit border shadow-sm",
                        "bg-background border-border/50"
                    )}>
                        <AreaIcon className="h-5 w-5" style={{ color: area?.color }} />
                    </div>

                    <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border",
                                    getStatusColor(plan.status)
                                )}>
                                    {getStatusLabel(plan.status)}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                    {plan.complexity === 'complex' ? 'Complexo' : plan.complexity === 'medium' ? 'Médio' : 'Simples'}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                {plan.status === 'blocked' && (
                                    <Lock className="h-3 w-3 text-rose-500 animate-pulse" />
                                )}
                                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                    {plan.areaId}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-foreground leading-tight truncate">
                                {plan.title}
                            </h3>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Layers className="h-3 w-3" />
                                <span className="text-[10px] font-medium tracking-tight">
                                    {completedSteps}/{totalSteps} etapas concluídas
                                </span>
                            </div>
                        </div>

                        {/* Progress Visualization */}
                        <div className="flex items-center gap-3 pt-1">
                            <div className="flex-1 h-1.5 bg-muted/60 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-700",
                                        plan.status === 'blocked' ? "bg-rose-500" :
                                            plan.status === 'on_track' ? "bg-emerald-500" : "bg-amber-500"
                                    )}
                                    style={{ width: `${plan.progress}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-foreground/70 min-w-[24px] text-right">
                                {plan.progress}%
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center self-center px-1">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
