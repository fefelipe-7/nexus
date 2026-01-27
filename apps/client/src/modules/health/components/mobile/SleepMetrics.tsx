import { Card, CardContent } from '@/ui/components/components/ui';
import {
    Clock,
    Activity,
    TrendingUp,
    Moon,
    Sun
} from 'lucide-react';
import { SleepMetrics as SleepMetricsType, SleepDebt } from '../../types/sleep.types';

interface SleepMetricsProps {
    metrics: SleepMetricsType;
    debt: SleepDebt;
}

export function SleepMetrics({ metrics, debt }: SleepMetricsProps) {
    return (
        <div className="space-y-4">
            <div className="px-1">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Métricas e Tendências
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Card className="border-border/40 shadow-none bg-background">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Média 7 dias</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-black tracking-tighter tabular-nums">{metrics.averageDuration7Days.toFixed(1)}h</p>
                            <p className="text-[9px] font-medium text-muted-foreground">Por noite</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 shadow-none bg-background">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-500" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Regularidade</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-black tracking-tighter tabular-nums">{metrics.regularityScore}%</p>
                            <p className="text-[9px] font-medium text-muted-foreground">Consistência</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 shadow-none bg-background">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4 text-indigo-500" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Horário Médio</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-black tracking-tighter tabular-nums">{metrics.averageBedtime}</p>
                            <p className="text-[9px] font-medium text-muted-foreground">Dormir</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 shadow-none bg-background">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-amber-500" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Horário Médio</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-black tracking-tighter tabular-nums">{metrics.averageWakeTime}</p>
                            <p className="text-[9px] font-medium text-muted-foreground">Acordar</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sleep Debt */}
            {debt.deficit > 0 && (
                <Card className="border-amber-500/20 shadow-none bg-amber-500/[0.02]">
                    <CardContent className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dívida de Sono</h4>
                            <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
                                Atenção
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-black tracking-tighter tabular-nums text-amber-600">
                                {debt.deficit.toFixed(1)}h
                            </p>
                            <p className="text-xs text-muted-foreground">acumuladas esta semana</p>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Você precisaria de aproximadamente <span className="font-bold text-foreground">{debt.recoveryDaysNeeded} dias</span> dormindo no ideal para recuperar.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
