import { Card } from '@/ui/components/components/ui';
import { Target, AlertTriangle, TrendingUp, TrendingDown, Minus, Focus, LayoutList, Clock } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { PrioritiesSummary } from '../../types/priorities.types';
import { DISPERSION_LABELS, DISPERSION_COLORS, TYPE_ICONS, TYPE_LABELS } from '../../types/priorities.types';

interface PrioritiesHeaderProps {
    summary: PrioritiesSummary;
}

export function PrioritiesHeader({ summary }: PrioritiesHeaderProps) {
    return (
        <Card className="overflow-hidden">
            <div className="p-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                {/* Main Stats */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Prioridades Ativas
                        </p>
                        <p className="text-3xl font-bold tracking-tight mt-1">
                            {summary.totalActive}
                        </p>
                    </div>
                    <div
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                        style={{ backgroundColor: `${DISPERSION_COLORS[summary.dispersionLevel]}15` }}
                    >
                        <Focus className="h-3.5 w-3.5" style={{ color: DISPERSION_COLORS[summary.dispersionLevel] }} />
                        <span
                            className="text-xs font-semibold"
                            style={{ color: DISPERSION_COLORS[summary.dispersionLevel] }}
                        >
                            {DISPERSION_LABELS[summary.dispersionLevel]}
                        </span>
                    </div>
                </div>

                {/* Dominant Priority */}
                {summary.dominantPriority && (
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl mb-4">
                        <p className="text-xs text-primary mb-1">Foco Principal</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{summary.dominantPriority.icon}</span>
                            <p className="text-sm font-semibold">{summary.dominantPriority.name}</p>
                        </div>
                    </div>
                )}

                {/* Insight */}
                {!summary.dominantPriority && (
                    <div className={cn(
                        "p-3 rounded-xl mb-4",
                        summary.insight.type === 'warning' && "bg-amber-500/10 border border-amber-500/20",
                        summary.insight.type === 'success' && "bg-green-500/10 border border-green-500/20",
                        summary.insight.type === 'info' && "bg-blue-500/10 border border-blue-500/20",
                        summary.insight.type === 'suggestion' && "bg-purple-500/10 border border-purple-500/20"
                    )}>
                        <p className="text-sm">{summary.insight.message}</p>
                    </div>
                )}

                {/* By Type */}
                <div className="grid grid-cols-4 gap-2">
                    {summary.byType.map(({ type, count }) => (
                        <div key={type} className="bg-background/60 rounded-xl p-2.5 text-center">
                            <span className="text-lg">{TYPE_ICONS[type]}</span>
                            <p className="text-sm font-bold mt-0.5">{count}</p>
                            <p className="text-[9px] text-muted-foreground truncate">{TYPE_LABELS[type]}</p>
                        </div>
                    ))}
                    {summary.byType.length < 4 && Array(4 - summary.byType.length).fill(0).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-background/30 rounded-xl p-2.5" />
                    ))}
                </div>

                {/* Conflicts */}
                {summary.conflicts.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {summary.conflicts.slice(0, 2).map((conflict, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex items-center gap-2 p-2 rounded-lg text-xs",
                                    conflict.severity === 'critical' && "bg-red-500/10 text-red-600",
                                    conflict.severity === 'warning' && "bg-amber-500/10 text-amber-600",
                                    conflict.severity === 'info' && "bg-blue-500/10 text-blue-600"
                                )}
                            >
                                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                                <span>{conflict.message}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}
