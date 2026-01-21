import {
    ShieldAlert,
    Lightbulb,
    ArrowRight,
    Brain,
    Zap,
    Clock,
    Wallet,
    Activity
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { Bottleneck } from '../../types/progress-indicators.types';

interface ProgressInsightsProps {
    bottlenecks: Bottleneck[];
    recommendations: {
        title: string;
        description: string;
        action: string;
    }[];
}

const originIconMap: Record<string, any> = {
    time: Clock,
    energy: Brain,
    money: Wallet,
    structure: Activity
};

export function ProgressInsights({ bottlenecks, recommendations }: ProgressInsightsProps) {
    return (
        <div className="space-y-10">
            {/* Bottlenecks Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                        Gargalos e Riscos Críticos
                    </h3>
                </div>

                <div className="grid gap-3">
                    {bottlenecks.map((b) => {
                        const OriginIcon = originIconMap[b.origin] || Activity;
                        return (
                            <div
                                key={b.id}
                                className={cn(
                                    "p-5 rounded-2xl border bg-background space-y-4",
                                    b.impact === 'high' ? "border-rose-500/20" : "border-amber-500/20"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-muted/50 text-muted-foreground">
                                            <OriginIcon className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{b.origin}</span>
                                    </div>
                                    <span className={cn(
                                        "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                        b.impact === 'high' ? "bg-rose-500/10 text-rose-600" : "bg-amber-500/10 text-amber-600"
                                    )}>
                                        Impacto {b.impact === 'high' ? 'Alto' : 'Médio'}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-foreground">{b.title}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{b.description}</p>
                                </div>

                                <div className="pt-3 border-t border-border/40 flex items-start gap-3">
                                    <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-foreground uppercase tracking-tighter">Ação Corretiva Sugerida</p>
                                        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium leading-relaxed italic">
                                            "{b.suggestion}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* AI Recommendations */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-blue-500" />
                        Recomendações da IA
                    </h3>
                </div>

                <div className="space-y-3">
                    {recommendations.map((rec, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-foreground/5 border border-foreground/5 space-y-4">
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-foreground">{rec.title}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                            </div>
                            <button className="w-full py-2.5 px-4 bg-foreground text-background rounded-xl text-[10px] font-bold uppercase tracking-tighter flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all active:scale-[0.98]">
                                {rec.action}
                                <ArrowRight className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
