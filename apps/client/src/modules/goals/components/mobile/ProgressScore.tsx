import { Card, CardContent } from '@/ui/components/components/ui';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Zap
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { ProgressScore as ProgressScoreType } from '../../types/progress-indicators.types';

interface ProgressScoreProps {
    score: ProgressScoreType;
}

export function ProgressScore({ score }: ProgressScoreProps) {
    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'improving': return <TrendingUp className="h-4 w-4 text-emerald-500" />;
            case 'declining': return <TrendingDown className="h-4 w-4 text-rose-500" />;
            default: return <Minus className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <Card className="border-border/40 shadow-none bg-muted/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Zap className="h-24 w-24" />
            </div>

            <CardContent className="p-6 space-y-6 relative">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Score Global de Progresso</h3>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "text-sm font-bold uppercase tracking-tight",
                                score.trend === 'improving' ? "text-emerald-500" : score.trend === 'declining' ? "text-rose-500" : "text-blue-500"
                            )}>
                                {score.interpretation}
                            </span>
                            {getTrendIcon(score.trend)}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-5xl font-black tracking-tighter text-foreground tabular-nums">
                            {score.value}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase -mt-1">de 100</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Simple Progress Bar */}
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                score.value >= 70 ? "bg-emerald-500" : score.value >= 40 ? "bg-blue-500" : "bg-amber-500"
                            )}
                            style={{ width: `${score.value}%` }}
                        />
                    </div>

                    <div className="bg-background/60 p-4 rounded-xl border border-border/20">
                        <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                            "{score.narrative}"
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
