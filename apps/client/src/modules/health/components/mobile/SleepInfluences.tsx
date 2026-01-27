import {
    Coffee,
    Dumbbell,
    Smartphone,
    Wine,
    Brain,
    UtensilsCrossed
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { SleepInfluence } from '../../types/sleep.types';

interface SleepInfluencesProps {
    influences: SleepInfluence[];
}

const INFLUENCE_ICONS = {
    caffeine: Coffee,
    alcohol: Wine,
    exercise: Dumbbell,
    screen: Smartphone,
    stress: Brain,
    late_meal: UtensilsCrossed
};

export function SleepInfluences({ influences }: SleepInfluencesProps) {
    return (
        <div className="space-y-4">
            <div className="px-1">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Fatores de Influência
                </h3>
            </div>

            <div className="space-y-3">
                {influences.map((influence) => {
                    const Icon = INFLUENCE_ICONS[influence.factor];

                    return (
                        <div
                            key={influence.factor}
                            className={cn(
                                "p-4 rounded-2xl border",
                                influence.impact === 'positive'
                                    ? "bg-emerald-500/[0.02] border-emerald-500/20"
                                    : "bg-rose-500/[0.02] border-rose-500/20"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    "p-2 rounded-lg shrink-0",
                                    influence.impact === 'positive'
                                        ? "bg-emerald-500/10 text-emerald-600"
                                        : "bg-rose-500/10 text-rose-600"
                                )}>
                                    <Icon className="h-4 w-4" />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="text-sm font-bold text-foreground">{influence.label}</h4>
                                        <div className="flex items-center gap-1">
                                            <div className={cn(
                                                "h-2 w-2 rounded-full",
                                                influence.impact === 'positive' ? "bg-emerald-500" : "bg-rose-500"
                                            )} />
                                            <span className="text-[9px] font-bold text-muted-foreground tabular-nums">
                                                {influence.correlation}%
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {influence.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
