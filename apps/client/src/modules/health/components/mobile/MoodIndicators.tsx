import { Card, CardContent } from '@/ui/components/components/ui';
import {
    TrendingUp,
    Activity,
    Heart,
    BarChart3
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { MoodMetrics as MoodMetricsType } from '../../types/mood.types';

interface MoodIndicatorsProps {
    metrics: MoodMetricsType;
}

export function MoodIndicators({ metrics }: MoodIndicatorsProps) {
    return (
        <div className="space-y-4">
            <div className="px-1">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5" />
                    Indicadores Emocionais
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Card className="border-border/40 shadow-none bg-background">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-emerald-500" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Humor Médio</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-black tracking-tighter tabular-nums">{metrics.averageMood7Days.toFixed(1)}</p>
                            <p className="text-[9px] font-medium text-muted-foreground">Últimos 7 dias</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 shadow-none bg-background">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Estabilidade</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-black tracking-tighter tabular-nums">{metrics.emotionalStability}%</p>
                            <p className="text-[9px] font-medium text-muted-foreground">Consistência emocional</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 shadow-none bg-background">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Emoções +</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-black tracking-tighter tabular-nums text-emerald-600">{metrics.positiveEmotionsPct}%</p>
                            <p className="text-[9px] font-medium text-muted-foreground">Sentimentos positivos</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 shadow-none bg-background">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-amber-500" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Sequência</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-black tracking-tighter tabular-nums">{metrics.consecutivePositiveDays}</p>
                            <p className="text-[9px] font-medium text-muted-foreground">Dias positivos seguidos</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
