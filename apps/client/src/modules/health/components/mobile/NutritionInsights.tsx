import {
    Lightbulb,
    TrendingUp,
    AlertTriangle,
    Sparkles,
    Brain
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { NutritionInsight } from '../../types/nutrition.types';

interface NutritionInsightsProps {
    insights: NutritionInsight[];
}

export function NutritionInsights({ insights }: NutritionInsightsProps) {
    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'pattern': return <TrendingUp className="h-4 w-4" />;
            case 'correlation': return <Sparkles className="h-4 w-4" />;
            case 'alert': return <AlertTriangle className="h-4 w-4" />;
            case 'recommendation': return <Lightbulb className="h-4 w-4" />;
            default: return <Brain className="h-4 w-4" />;
        }
    };

    const getInsightColor = (type: string) => {
        switch (type) {
            case 'alert': return 'bg-rose-500/10 text-rose-500';
            case 'recommendation': return 'bg-blue-500/10 text-blue-500';
            case 'correlation': return 'bg-purple-500/10 text-purple-500';
            default: return 'bg-emerald-500/10 text-emerald-500';
        }
    };

    return (
        <div className="space-y-4">
            <div className="px-1">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Brain className="h-3.5 w-3.5" />
                    Insights Nutricionais
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
                                <div className={cn("p-1.5 rounded-lg", getInsightColor(insight.type))}>
                                    {getInsightIcon(insight.type)}
                                </div>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
                                    {insight.type === 'pattern' ? 'Padrão' :
                                        insight.type === 'correlation' ? 'Correlação' :
                                            insight.type === 'alert' ? 'Alerta' :
                                                'Recomendação'}
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

                        {insight.actionable && (
                            <div className="pt-3 border-t border-border/40 flex items-start gap-3">
                                <Lightbulb className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-foreground uppercase tracking-tighter">Ação Sugerida</p>
                                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
                                        {insight.actionable}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
