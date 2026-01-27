import { Card, CardContent } from '@/ui/components/components/ui';
import {
    Moon,
    Sun,
    Clock,
    Star,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { SleepEntry, SleepScore } from '../../types/sleep.types';

interface SleepOverviewProps {
    lastNight?: SleepEntry;
    score: SleepScore;
}

export function SleepOverview({ lastNight, score }: SleepOverviewProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600';
        if (score >= 60) return 'text-blue-600';
        if (score >= 40) return 'text-amber-600';
        return 'text-rose-600';
    };

    const getScoreFeedback = (score: number) => {
        if (score >= 80) return 'Excelente recuperação';
        if (score >= 60) return 'Boa qualidade de sono';
        if (score >= 40) return 'Sono moderado';
        return 'Sono precisa de atenção';
    };

    return (
        <div className="space-y-4">
            {/* Last Night Card */}
            {lastNight && (
                <Card className="border-none shadow-none bg-gradient-to-br from-blue-500/5 to-indigo-500/5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Moon className="h-24 w-24" />
                    </div>

                    <CardContent className="p-6 space-y-4 relative">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Última Noite</h3>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "h-3 w-3",
                                            i < lastNight.quality ? "fill-amber-500 text-amber-500" : "text-muted-foreground/20"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Moon className="h-3.5 w-3.5" />
                                    <span className="text-[9px] font-bold uppercase tracking-tighter">Dormiu</span>
                                </div>
                                <p className="text-lg font-black tracking-tighter">
                                    {lastNight.bedtime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Sun className="h-3.5 w-3.5" />
                                    <span className="text-[9px] font-bold uppercase tracking-tighter">Acordou</span>
                                </div>
                                <p className="text-lg font-black tracking-tighter">
                                    {lastNight.wakeTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span className="text-[9px] font-bold uppercase tracking-tighter">Duração</span>
                                </div>
                                <p className="text-lg font-black tracking-tighter">{lastNight.duration}h</p>
                            </div>
                        </div>

                        {lastNight.note && (
                            <p className="text-xs text-muted-foreground italic leading-relaxed pt-2 border-t border-border/20">
                                "{lastNight.note}"
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Sleep Score */}
            <Card className="border-border/40 shadow-none bg-background">
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Score de Sono</h3>
                            <p className={cn("text-sm font-bold", getScoreColor(score.overall))}>
                                {getScoreFeedback(score.overall)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={cn("text-4xl font-black tracking-tighter tabular-nums", getScoreColor(score.overall))}>
                                {score.overall}
                            </p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase">de 100</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {Object.entries(score.components).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                                        {key === 'duration' ? 'Duração' :
                                            key === 'regularity' ? 'Regularidade' :
                                                key === 'quality' ? 'Qualidade' :
                                                    key === 'fragmentation' ? 'Fragmentação' :
                                                        'Cronotipo'}
                                    </span>
                                    <span className="text-[10px] font-bold text-foreground tabular-nums">{value}%</span>
                                </div>
                                <div className="h-1 bg-muted/60 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-700"
                                        style={{ width: `${value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
