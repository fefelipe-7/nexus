import {
    Lightbulb,
    TrendingUp,
    AlertTriangle,
    Sparkles,
    Brain
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { MoodInsight, MoodCorrelation } from '../../types/mood.types';

interface MoodInsightsProps {
    insights: MoodInsight[];
    correlations: MoodCorrelation[];
}

export function MoodInsights({ insights, correlations }: MoodInsightsProps) {
    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'pattern': return <TrendingUp className="h-4 w-4" />;
            case 'correlation': return <Sparkles className="h-4 w-4" />;
            case 'alert': return <AlertTriangle className="h-4 w-4" />;
            case 'suggestion': return <Lightbulb className="h-4 w-4" />;
            default: return <Brain className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Correlations */}
            {correlations.length > 0 && (
                <div className="space-y-4">
                    <div className="px-1">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5" />
                            Correlações Identificadas
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {correlations.map((corr, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "p-4 rounded-2xl border",
                                    corr.impact === 'positive' ? "bg-emerald-500/[0.02] border-emerald-500/20" : "bg-rose-500/[0.02] border-rose-500/20"
                                )}
                            >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <h4 className="text-sm font-bold text-foreground">{corr.factor}</h4>
                                    <div className="flex items-center gap-1">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            corr.impact === 'positive' ? "bg-emerald-500" : "bg-rose-500"
                                        )} />
                                        <span className="text-[9px] font-bold text-muted-foreground">{corr.strength}%</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{corr.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Insights */}
            <div className="space-y-4">
                <div className="px-1">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Brain className="h-3.5 w-3.5" />
                        Insights da IA
                    </h3>
                </div>

                <div className="space-y-3">
                    {insights.map((insight) => (
                        <div
                            key={insight.id}
                            className={cn(
                                "p-5 rounded-2xl border bg-background space-y-3",
                                insight.priority === 'high' ? "border-amber-500/20 shadow-sm shadow-amber-500/5" : "border-border/40"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "p-1.5 rounded-lg",
                                        insight.type === 'alert' ? "bg-rose-500/10 text-rose-500" :
                                            insight.type === 'suggestion' ? "bg-blue-500/10 text-blue-500" :
                                                "bg-emerald-500/10 text-emerald-500"
                                    )}>
                                        {getInsightIcon(insight.type)}
                                    </div>
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
                                        {insight.type}
                                    </span>
                                </div>
                                {insight.priority === 'high' && (
                                    <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
                                        Alta prioridade
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-foreground">{insight.title}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
