import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { WeekSchedule, LifeArea } from '../../types/agenda.types';
import { LIFE_AREA_COLORS } from '../../types/agenda.types';

interface WeekViewProps {
    schedule: WeekSchedule;
    onDayClick?: (date: Date) => void;
}

export function WeekView({ schedule, onDayClick }: WeekViewProps) {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const now = new Date();

    const getOccupancyColor = (rate: number) => {
        if (rate >= 85) return 'bg-red-500';
        if (rate >= 70) return 'bg-amber-500';
        if (rate >= 40) return 'bg-primary';
        return 'bg-muted';
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Visão Semanal</h3>
                <span className="text-xs text-muted-foreground">
                    {schedule.totalOccupancyRate.toFixed(0)}% de ocupação média
                </span>
            </div>

            {/* Week grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
                {schedule.days.map((day, index) => {
                    const isToday = day.date.toDateString() === now.toDateString();
                    const isPast = day.date < new Date(now.setHours(0, 0, 0, 0));

                    return (
                        <button
                            key={index}
                            onClick={() => onDayClick?.(day.date)}
                            className={cn(
                                "flex flex-col items-center p-2 rounded-xl transition-all",
                                "hover:bg-accent/30 active:bg-accent/50",
                                isToday && "ring-2 ring-primary bg-primary/5"
                            )}
                        >
                            <span className={cn(
                                "text-[10px] uppercase",
                                isToday ? "text-primary font-semibold" : "text-muted-foreground"
                            )}>
                                {days[index]}
                            </span>
                            <span className={cn(
                                "text-lg font-bold",
                                isToday && "text-primary",
                                isPast && "text-muted-foreground"
                            )}>
                                {day.date.getDate()}
                            </span>
                            {/* Occupancy bar */}
                            <div className="w-full h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full", getOccupancyColor(day.occupancyRate))}
                                    style={{ width: `${day.occupancyRate}%` }}
                                />
                            </div>
                            {/* Indicators */}
                            <div className="flex items-center gap-0.5 mt-1">
                                {day.focusBlocks > 0 && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                )}
                                {day.restBlocks > 0 && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Week insight */}
            <div className="p-3 bg-muted/30 rounded-xl">
                <p className="text-xs text-muted-foreground">{schedule.insight}</p>
            </div>
        </Card>
    );
}
