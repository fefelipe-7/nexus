import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { TimeDistribution } from '../../types/agenda.types';
import { LIFE_AREA_LABELS } from '../../types/agenda.types';

interface TimeDistributionCardProps {
    distribution: TimeDistribution[];
}

export function TimeDistributionCard({ distribution }: TimeDistributionCardProps) {
    const formatHours = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}min`;
        return mins > 0 ? `${hours}h${mins}min` : `${hours}h`;
    };

    // Sort by percentage descending
    const sorted = [...distribution].sort((a, b) => b.percentage - a.percentage);

    return (
        <Card className="p-4">
            <h3 className="text-sm font-semibold mb-4">Para Onde Vai Seu Tempo</h3>

            {/* Distribution bar */}
            <div className="h-4 rounded-full overflow-hidden flex mb-4">
                {sorted.map((item) => (
                    <div
                        key={item.area}
                        className="h-full transition-all"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="space-y-2">
                {sorted.map((item) => (
                    <div key={item.area} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm">{LIFE_AREA_LABELS[item.area]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {item.trend && (
                                <span className={cn(
                                    "text-[10px] font-medium",
                                    item.trend === 'up' && "text-amber-500",
                                    item.trend === 'down' && "text-green-500",
                                    item.trend === 'stable' && "text-muted-foreground"
                                )}>
                                    {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                                </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                                {item.percentage.toFixed(0)}%
                            </span>
                            <span className="text-sm font-medium w-16 text-right">
                                {formatHours(item.minutes)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
