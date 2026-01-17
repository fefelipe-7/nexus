import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { DaySchedule } from '../../types/agenda.types';
import { TimeBlockItem } from './TimeBlockItem';

interface DayViewProps {
    schedule: DaySchedule;
    onBlockClick?: (blockId: string) => void;
}

export function DayView({ schedule, onBlockClick }: DayViewProps) {
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7h to 21h

    // Group blocks by hour
    const blocksByHour = schedule.blocks.reduce((acc, block) => {
        const hour = block.startTime.getHours();
        if (!acc[hour]) acc[hour] = [];
        acc[hour].push(block);
        return acc;
    }, {} as Record<number, typeof schedule.blocks>);

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Linha do Tempo</h3>
                <span className="text-xs text-muted-foreground">
                    {schedule.blocks.length} eventos
                </span>
            </div>

            <div className="relative">
                {/* Current time indicator */}
                {currentHour >= 7 && currentHour <= 21 && (
                    <div
                        className="absolute left-0 right-0 z-10 flex items-center gap-2"
                        style={{ top: `${((currentHour - 7) * 60 + currentMinute) / (14 * 60) * 100}%` }}
                    >
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <div className="flex-1 h-0.5 bg-red-500" />
                    </div>
                )}

                {/* Time grid */}
                <div className="space-y-0">
                    {hours.map((hour) => {
                        const blocks = blocksByHour[hour] || [];
                        const isPast = hour < currentHour;

                        return (
                            <div
                                key={hour}
                                className={cn(
                                    "flex gap-3 py-2 border-t border-dashed border-muted/50",
                                    isPast && "opacity-50"
                                )}
                            >
                                {/* Time label */}
                                <div className="w-12 flex-shrink-0 text-right">
                                    <span className="text-xs text-muted-foreground">
                                        {hour.toString().padStart(2, '0')}:00
                                    </span>
                                </div>

                                {/* Blocks */}
                                <div className="flex-1 min-h-[40px]">
                                    {blocks.length > 0 ? (
                                        <div className="space-y-1">
                                            {blocks.map(block => (
                                                <TimeBlockItem
                                                    key={block.id}
                                                    block={block}
                                                    compact
                                                    onClick={() => onBlockClick?.(block.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full min-h-[40px]" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}
