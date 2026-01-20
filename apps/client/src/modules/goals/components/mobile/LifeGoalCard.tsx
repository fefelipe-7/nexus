import { Card, CardContent } from '@/ui/components/components/ui';
import { ChevronRight, Target, Calendar, Info, Heart, Wallet, Briefcase, Users, Brain, Palmtree, Sparkles } from 'lucide-react';
import { cn } from '@nexus/shared';
import { LifeGoal, LifeArea } from '../../types/life-goals.types';

interface LifeGoalCardProps {
    goal: LifeGoal;
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

export function LifeGoalCard({ goal, area, onClick }: LifeGoalCardProps) {
    const AreaIcon = area?.icon ? (areaIconMap[area.icon] || Target) : Target;

    return (
        <Card
            className="overflow-hidden border-border/40 shadow-none hover:bg-muted/30 transition-colors cursor-pointer"
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
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                                {area?.name}
                            </span>
                            {goal.status === 'building' && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md">
                                    Rascunho
                                </span>
                            )}
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
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-[11px] font-medium text-muted-foreground">
                                    {goal.horizon}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Info className="h-3 w-3 text-muted-foreground" />
                                <span className="text-[11px] font-medium text-muted-foreground">
                                    Clareza: {goal.clarityDegree}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center self-center px-1">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                </div>

                {/* Subtle dual-progress bar at the bottom */}
                <div className="mt-4 flex gap-1.5 h-1 w-full opacity-60">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${goal.clarity}%` }}
                    />
                    <div
                        className="h-full bg-muted rounded-full flex-1"
                    >
                        <div
                            className="h-full bg-blue-400 rounded-full transition-all duration-500"
                            style={{ width: `${goal.progessPerception}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
