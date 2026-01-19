import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { WeeklyConsistency } from '../../types/habits.types';
import { DAYS_SHORT } from '../../types/habits.types';

interface ConsistencyChartProps {
    data: WeeklyConsistency[];
    title?: string;
}

export function ConsistencyChart({ data, title = "Últimos 7 dias" }: ConsistencyChartProps) {
    const maxRate = Math.max(...data.map(d => d.rate), 100);

    return (
        <Card className="p-4">
            <h3 className="text-sm font-semibold mb-4">{title}</h3>

            <div className="flex items-end justify-between gap-1 h-24">
                {data.map((day, index) => {
                    const height = (day.rate / maxRate) * 100;
                    const isToday = day.day.toDateString() === new Date().toDateString();

                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full h-20 flex items-end justify-center">
                                <div
                                    className={cn(
                                        "w-full max-w-8 rounded-t-sm transition-all",
                                        day.rate >= 70 && "bg-green-500",
                                        day.rate >= 50 && day.rate < 70 && "bg-amber-500",
                                        day.rate < 50 && day.rate > 0 && "bg-red-400",
                                        day.rate === 0 && "bg-muted",
                                        isToday && "ring-2 ring-primary ring-offset-1"
                                    )}
                                    style={{ height: `${Math.max(height, 4)}%` }}
                                />
                            </div>
                            <span className={cn(
                                "text-[10px]",
                                isToday ? "font-bold text-primary" : "text-muted-foreground"
                            )}>
                                {DAYS_SHORT[day.day.getDay()]}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>≥70%</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>50-69%</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span>&lt;50%</span>
                </div>
            </div>
        </Card>
    );
}
