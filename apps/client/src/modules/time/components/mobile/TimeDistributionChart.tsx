import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { AreaTimeSummary, AREA_LABELS, TypeTimeSummary, TYPE_LABELS, TYPE_COLORS, TimeArea } from '../../types/history.types';

interface TimeDistributionChartProps {
    summaryByArea: AreaTimeSummary[];
    summaryByType: TypeTimeSummary[];
}

export function TimeDistributionChart({ summaryByArea, summaryByType }: TimeDistributionChartProps) {
    // Sort areas by time
    const sortedAreas = [...summaryByArea].sort((a, b) => b.totalTime - a.totalTime).filter(a => a.totalTime > 0);

    const getAreaColor = (area: TimeArea) => {
        switch (area) {
            case 'work': return 'bg-blue-500';
            case 'health': return 'bg-teal-500';
            case 'personal': return 'bg-orange-500';
            case 'finance': return 'bg-indigo-500';
            case 'learning': return 'bg-purple-500';
            case 'untracked': return 'bg-slate-300';
            default: return 'bg-primary';
        }
    };

    return (
        <div className="space-y-6">
            {/* Area Distribution */}
            <section className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">
                    Distribuição por Área
                </h3>
                <Card className="p-4">
                    <div className="flex h-3 w-full overflow-hidden rounded-full mb-4">
                        {sortedAreas.map((area) => (
                            <div
                                key={area.area}
                                className={cn("h-full", getAreaColor(area.area))}
                                style={{ width: `${area.percentage}%` }}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {sortedAreas.map((area) => (
                            <div key={area.area} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", getAreaColor(area.area))} />
                                    <span className="text-xs font-medium">{AREA_LABELS[area.area]}</span>
                                </div>
                                <span className="text-xs text-muted-foreground font-semibold">{area.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>

            {/* Type Distribution */}
            <section className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">
                    Perfil de Atividade
                </h3>
                <Card className="p-4">
                    <div className="space-y-3">
                        {summaryByType.filter(t => t.totalTime > 0).sort((a, b) => b.totalTime - a.totalTime).map((type) => (
                            <div key={type.type} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium">{TYPE_LABELS[type.type]}</span>
                                    <span className="text-muted-foreground">{type.percentage}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full"
                                        style={{
                                            width: `${type.percentage}%`,
                                            backgroundColor: TYPE_COLORS[type.type]
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>
        </div>
    );
}
