import { Card, CardContent } from '@/ui/components/components/ui';
import {
    ShieldCheck,
    Activity,
    Zap,
    Puzzle,
    TrendingUp
} from 'lucide-react';
import { cn } from '@nexus/shared';

interface ConnectionMacroViewProps {
    metrics: {
        goalsWithHabitsPct: number;
        goalsWithProjectsPct: number;
        strategicProjectPct: number;
        systemCoherence: number;
    };
}

export function ConnectionMacroView({ metrics }: ConnectionMacroViewProps) {
    return (
        <div className="space-y-4">
            <Card className="border-none shadow-none bg-foreground text-background overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheck className="h-24 w-24" />
                </div>

                <CardContent className="p-6 space-y-6 relative">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em]">Integridade Sistêmica</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold uppercase tracking-tight text-emerald-400">Sistema Conectado</span>
                                <TrendingUp className="h-4 w-4 text-emerald-400" />
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-4xl font-black tracking-tighter tabular-nums">
                                {metrics.systemCoherence}%
                            </span>
                        </div>
                    </div>

                    <div className="h-1 bg-background/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-1000"
                            style={{ width: `${metrics.systemCoherence}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 flex flex-col justify-between h-24">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <div className="space-y-0.5">
                        <p className="text-[20px] font-black tracking-tighter tabular-nums">{metrics.goalsWithHabitsPct}%</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Metas c/ Hábitos</p>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 flex flex-col justify-between h-24">
                    <Puzzle className="h-4 w-4 text-emerald-500" />
                    <div className="space-y-0.5">
                        <p className="text-[20px] font-black tracking-tighter tabular-nums">{metrics.goalsWithProjectsPct}%</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Metas c/ Projetos</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
