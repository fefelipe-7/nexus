import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { TimeInsight } from '../../types/history.types';
import { Lightbulb, AlertTriangle, Info, ArrowRight } from 'lucide-react';

interface InsightCardProps {
    insight: TimeInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
    const getIcon = () => {
        switch (insight.type) {
            case 'success': return <Lightbulb className="h-5 w-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
            case 'suggestion': return <Lightbulb className="h-5 w-5 text-purple-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getBgColor = () => {
        switch (insight.type) {
            case 'success': return 'bg-green-500/10 border-green-500/20';
            case 'warning': return 'bg-amber-500/10 border-amber-500/20';
            case 'suggestion': return 'bg-purple-500/10 border-purple-500/20';
            default: return 'bg-blue-500/10 border-blue-500/20';
        }
    };

    return (
        <Card className={cn("p-4 border transition-all hover:bg-muted/50", getBgColor())}>
            <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {insight.message}
                    </p>
                    {insight.actionLabel && (
                        <button className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-primary transition-all hover:gap-2">
                            <span>{insight.actionLabel}</span>
                            <ArrowRight className="h-3 w-3" />
                        </button>
                    )}
                </div>
            </div>
        </Card>
    );
}
