import { Card, CardContent } from '@/ui/components/components/ui';
import {
    Zap,
    CheckCircle2,
    Activity,
    Target,
    TrendingUp,
    TrendingDown,
    Minus
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { LifeKPI } from '../../types/progress-indicators.types';

interface ProgressKPIsProps {
    kpis: LifeKPI[];
}

const iconMap: Record<string, any> = {
    rhythm: Zap,
    completion: CheckCircle2,
    consistency: Activity,
    focus: Target
};

const colorMap: Record<string, string> = {
    rhythm: 'text-blue-500',
    completion: 'text-emerald-500',
    consistency: 'text-rose-500',
    focus: 'text-amber-500'
};

export function ProgressKPIs({ kpis }: ProgressKPIsProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {kpis.map((kpi) => {
                const Icon = iconMap[kpi.category] || Activity;
                const color = colorMap[kpi.category] || 'text-primary';

                return (
                    <Card key={kpi.id} className="border-border/40 shadow-none bg-background hover:bg-muted/30 transition-colors">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className={cn("p-2 rounded-lg bg-muted/50", color)}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex items-center gap-1">
                                    {kpi.trend === 'improving' ? <TrendingUp className="h-2.5 w-2.5 text-emerald-500" /> :
                                        kpi.trend === 'declining' ? <TrendingDown className="h-2.5 w-2.5 text-rose-500" /> :
                                            <Minus className="h-2.5 w-2.5 text-blue-400" />}
                                    <span className={cn(
                                        "text-[9px] font-bold uppercase",
                                        kpi.trend === 'improving' ? "text-emerald-600" :
                                            kpi.trend === 'declining' ? "text-rose-600" : "text-blue-600"
                                    )}>
                                        {kpi.variation}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{kpi.title}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-foreground">{kpi.value}</span>
                                    {kpi.unit && <span className="text-[10px] font-bold text-muted-foreground uppercase">{kpi.unit}</span>}
                                </div>
                            </div>

                            <p className="text-[9px] text-muted-foreground/80 leading-tight font-medium line-clamp-2">
                                {kpi.interpretation}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
