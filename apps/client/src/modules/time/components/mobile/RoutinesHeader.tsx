import { Card } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Minus, CheckCircle, Clock, Pause, Activity, Target } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { RoutinesSummary } from '../../types/routines.types';

interface RoutinesHeaderProps {
    summary: RoutinesSummary;
}

export function RoutinesHeader({ summary }: RoutinesHeaderProps) {
    const getTrendIcon = () => {
        switch (summary.weeklyTrend) {
            case 'up': return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
            case 'down': return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
            default: return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
        }
    };

    const getTrendBg = () => {
        switch (summary.weeklyTrend) {
            case 'up': return 'bg-green-500/10';
            case 'down': return 'bg-red-500/10';
            default: return 'bg-muted/50';
        }
    };

    const getTrendLabel = () => {
        switch (summary.weeklyTrend) {
            case 'up': return 'Em alta';
            case 'down': return 'Em queda';
            default: return 'Estável';
        }
    };

    return (
        <Card className="overflow-hidden">
            <div className="p-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                {/* Main Stats */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Previsibilidade
                        </p>
                        <p className="text-3xl font-bold tracking-tight mt-1">
                            {summary.predictabilityScore}%
                        </p>
                    </div>
                    <div className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full",
                        getTrendBg()
                    )}>
                        {getTrendIcon()}
                        <span className="text-xs font-semibold">{getTrendLabel()}</span>
                    </div>
                </div>

                {/* Insight */}
                <div className={cn(
                    "p-3 rounded-xl mb-4",
                    summary.insight.type === 'warning' && "bg-amber-500/10 border border-amber-500/20",
                    summary.insight.type === 'success' && "bg-green-500/10 border border-green-500/20",
                    summary.insight.type === 'info' && "bg-blue-500/10 border border-blue-500/20",
                    summary.insight.type === 'suggestion' && "bg-purple-500/10 border border-purple-500/20"
                )}>
                    <p className="text-sm">{summary.insight.message}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-2">
                    <div className="bg-background/60 rounded-xl p-2.5 text-center">
                        <Activity className="h-4 w-4 mx-auto text-primary mb-1" />
                        <p className="text-sm font-bold">{summary.totalActive}</p>
                        <p className="text-[9px] text-muted-foreground">Ativas</p>
                    </div>
                    <div className="bg-background/60 rounded-xl p-2.5 text-center">
                        <Clock className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                        <p className="text-sm font-bold">{summary.scheduledToday}</p>
                        <p className="text-[9px] text-muted-foreground">Hoje</p>
                    </div>
                    <div className="bg-background/60 rounded-xl p-2.5 text-center">
                        <CheckCircle className="h-4 w-4 mx-auto text-green-500 mb-1" />
                        <p className="text-sm font-bold">{summary.executedToday}</p>
                        <p className="text-[9px] text-muted-foreground">Executadas</p>
                    </div>
                    <div className="bg-background/60 rounded-xl p-2.5 text-center">
                        <Target className="h-4 w-4 mx-auto text-amber-500 mb-1" />
                        <p className="text-sm font-bold">{summary.averageExecutionRate}%</p>
                        <p className="text-[9px] text-muted-foreground">Média</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
