import { cn } from '@nexus/shared';
import { ChevronRight, Clock, MapPin, Link, Repeat } from 'lucide-react';
import type { TimeBlock } from '../../types/agenda.types';
import { INTENTION_COLORS, LIFE_AREA_LABELS, EVENT_TYPE_LABELS } from '../../types/agenda.types';

interface TimeBlockItemProps {
    block: TimeBlock;
    onClick?: () => void;
    compact?: boolean;
}

export function TimeBlockItem({ block, onClick, compact }: TimeBlockItemProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDurationLabel = () => {
        const mins = (block.endTime.getTime() - block.startTime.getTime()) / 60000;
        if (mins < 60) return `${mins}min`;
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return remainingMins > 0 ? `${hours}h${remainingMins}min` : `${hours}h`;
    };

    const isNow = () => {
        const now = new Date();
        return now >= block.startTime && now <= block.endTime;
    };

    const isPast = () => {
        return new Date() > block.endTime;
    };

    if (compact) {
        return (
            <button
                onClick={onClick}
                className={cn(
                    "w-full flex items-center gap-2 p-2 rounded-lg transition-all",
                    "hover:bg-accent/30 active:bg-accent/50",
                    isPast() && "opacity-50"
                )}
            >
                <div
                    className="w-1 h-8 rounded-full flex-shrink-0"
                    style={{ backgroundColor: block.color || INTENTION_COLORS[block.intention] }}
                />
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">{block.title}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(block.startTime)}</p>
                </div>
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-stretch gap-3 p-3 rounded-xl transition-all",
                "hover:bg-accent/30 active:bg-accent/50",
                isNow() && "ring-2 ring-primary/50 bg-primary/5",
                isPast() && "opacity-60"
            )}
        >
            {/* Time bar */}
            <div
                className="w-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: block.color || INTENTION_COLORS[block.intention] }}
            />

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-sm font-semibold">{block.title}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(block.startTime)} - {formatTime(block.endTime)}</span>
                            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                            <span>{getDurationLabel()}</span>
                        </div>
                    </div>
                    {isNow() && (
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full">
                            AGORA
                        </span>
                    )}
                </div>

                {/* Meta badges */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{
                            backgroundColor: `${block.color || INTENTION_COLORS[block.intention]}15`,
                            color: block.color || INTENTION_COLORS[block.intention]
                        }}
                    >
                        {EVENT_TYPE_LABELS[block.eventType]}
                    </span>
                    <span className="px-2 py-0.5 bg-muted rounded-full text-[10px] font-medium text-muted-foreground">
                        {LIFE_AREA_LABELS[block.lifeArea]}
                    </span>
                    {block.isRecurring && (
                        <Repeat className="h-3 w-3 text-muted-foreground" />
                    )}
                    {block.linkedGoalId && (
                        <Link className="h-3 w-3 text-primary" />
                    )}
                    {block.location && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {block.location}
                        </span>
                    )}
                </div>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 self-center" />
        </button>
    );
}
