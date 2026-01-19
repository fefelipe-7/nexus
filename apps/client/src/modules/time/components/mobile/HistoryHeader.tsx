import { Card } from '@/ui/components/components/ui';
import { Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { cn } from '@nexus/shared';
import { HistoryPeriod, PERIOD_LABELS } from '../../types/history.types';

interface HistoryHeaderProps {
    period: HistoryPeriod;
    totalTime: number;
    score: number;
    onPeriodChange: (period: HistoryPeriod) => void;
    insight: string;
}

export function HistoryHeader({ period, totalTime, score, onPeriodChange, insight }: HistoryHeaderProps) {
    const formatTotalTime = (mins: number) => {
        const hours = Math.floor(mins / 60);
        const rem = mins % 60;
        if (hours === 0) return `${rem}min`;
        return rem > 0 ? `${hours}h ${rem}min` : `${hours}h`;
    };

    const getScoreColor = (s: number) => {
        if (s >= 80) return 'text-green-500';
        if (s >= 60) return 'text-amber-500';
        return 'text-red-500';
    };

    const periods: HistoryPeriod[] = ['today', 'week', 'month', 'quarter'];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Histórico</h1>
                <div className="flex bg-muted/50 p-1 rounded-lg">
                    {periods.map((p) => (
                        <button
                            key={p}
                            onClick={() => onPeriodChange(p)}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                period === p ? "bg-background shadow-sm" : "text-muted-foreground"
                            )}
                        >
                            {PERIOD_LABELS[p].split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="p-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                Tempo Registrado
                            </p>
                            <p className="text-2xl font-bold tracking-tight mt-1">
                                {formatTotalTime(totalTime)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                Aderência
                            </p>
                            <p className={cn("text-2xl font-bold tracking-tight mt-1", getScoreColor(score))}>
                                {score}%
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-xl">
                        <Info className="h-4 w-4 text-primary shrink-0" />
                        <p className="text-xs font-medium">{insight}</p>
                    </div>
                </div>
            </Card>

            {/* Date Navigation */}
            <div className="flex items-center justify-between px-1">
                <button className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{period === 'today' ? '18 de Jan, 2026' : '12 - 18 de Jan, 2026'}</span>
                </div>
                <button className="p-2 hover:bg-muted rounded-full transition-colors opacity-50 cursor-not-allowed">
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
