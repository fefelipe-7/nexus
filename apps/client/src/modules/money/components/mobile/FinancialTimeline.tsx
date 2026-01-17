import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { FinancialEvent } from '../../types/reports.types';
import { EVENT_TYPE_COLORS } from '../../types/reports.types';

interface FinancialTimelineProps {
    events: FinancialEvent[];
    maxItems?: number;
}

export function FinancialTimeline({ events, maxItems = 10 }: FinancialTimelineProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            month: 'short',
            year: 'numeric',
        }).replace('. ', '/');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            notation: 'compact',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const displayedEvents = events.slice(0, maxItems);

    return (
        <Card className="p-4">
            <h3 className="text-sm font-semibold mb-4">Linha do Tempo Financeira</h3>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-muted" />

                {/* Events */}
                <div className="space-y-4">
                    {displayedEvents.map((event, index) => {
                        const color = EVENT_TYPE_COLORS[event.type];

                        return (
                            <div key={event.id} className="relative flex gap-4">
                                {/* Icon */}
                                <div
                                    className={cn(
                                        "relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0",
                                        event.impact === 'positive' && "ring-2 ring-green-500/20",
                                        event.impact === 'negative' && "ring-2 ring-red-500/20"
                                    )}
                                    style={{ backgroundColor: `${color}15` }}
                                >
                                    {event.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pb-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-medium">{event.title}</p>
                                            <p className="text-xs text-muted-foreground">{event.description}</p>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                            {formatDate(event.date)}
                                        </span>
                                    </div>
                                    {event.amount && (
                                        <p
                                            className={cn(
                                                "text-sm font-semibold mt-1",
                                                event.impact === 'positive' ? "text-green-500" :
                                                    event.impact === 'negative' ? "text-red-500" : "text-muted-foreground"
                                            )}
                                        >
                                            {event.impact === 'negative' ? '-' : event.impact === 'positive' ? '' : ''}{formatCurrency(event.amount)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {events.length > maxItems && (
                <button className="w-full text-center text-xs text-primary font-medium mt-2 py-2 hover:underline">
                    Ver mais {events.length - maxItems} eventos
                </button>
            )}
        </Card>
    );
}
