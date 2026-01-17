import { Card } from '@/ui/components/components/ui';
import { TrendingUp, AlertTriangle, CheckCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { FinancialInsight } from '../../types/reports.types';

interface InsightCardProps {
    insight: FinancialInsight;
    isMain?: boolean;
    onClick?: () => void;
}

export function InsightCard({ insight, isMain, onClick }: InsightCardProps) {
    const getInsightIcon = () => {
        switch (insight.type) {
            case 'trend': return TrendingUp;
            case 'achievement': return CheckCircle;
            case 'warning': return AlertTriangle;
            case 'suggestion': return Lightbulb;
            default: return TrendingUp;
        }
    };

    const getInsightColor = () => {
        switch (insight.type) {
            case 'trend': return '#3b82f6';
            case 'achievement': return '#10b981';
            case 'warning': return '#f59e0b';
            case 'suggestion': return '#8b5cf6';
            default: return '#6b7280';
        }
    };

    const Icon = getInsightIcon();
    const color = getInsightColor();

    if (isMain) {
        return (
            <Card
                className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                style={{ borderColor: `${color}30` }}
                onClick={onClick}
            >
                <div
                    className="p-4"
                    style={{ background: `linear-gradient(135deg, ${color}10, transparent)` }}
                >
                    <div className="flex items-start gap-3">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${color}15` }}
                        >
                            <Icon className="h-6 w-6" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-lg font-semibold">{insight.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                            {insight.comparison && (
                                <p className="text-xs mt-2" style={{ color }}>
                                    {insight.comparison.percentageChange > 0 ? '+' : ''}{insight.comparison.percentageChange.toFixed(0)}% vs. período anterior
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                "bg-muted/30 hover:bg-accent/50 text-left"
            )}
        >
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}15` }}
            >
                <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{insight.title}</p>
                {insight.value !== undefined && (
                    <p className="text-xs text-muted-foreground">
                        {typeof insight.value === 'number' && insight.value > 0 ? '+' : ''}{insight.value}
                        {insight.metric ? ` (${insight.metric})` : '%'}
                    </p>
                )}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </button>
    );
}

interface InsightsListProps {
    insights: FinancialInsight[];
}

export function InsightsList({ insights }: InsightsListProps) {
    return (
        <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Insights Automáticos</h3>
            <div className="space-y-2">
                {insights.map(insight => (
                    <InsightCard
                        key={insight.id}
                        insight={insight}
                        onClick={() => console.log('Insight clicked', insight.id)}
                    />
                ))}
            </div>
        </Card>
    );
}
