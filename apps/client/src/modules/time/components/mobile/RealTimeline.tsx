import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { TimeRecord, TYPE_COLORS, TYPE_LABELS } from '../../types/history.types';
import { Clock, AlertCircle, CheckCircle2, TimerOff } from 'lucide-react';

interface RealTimelineProps {
    records: TimeRecord[];
}

export function RealTimeline({ records }: RealTimelineProps) {
    const sortedRecords = [...records].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusIcon = (status: TimeRecord['status']) => {
        switch (status) {
            case 'concluded': return <CheckCircle2 className="h-3 w-3 text-green-500" />;
            case 'extrapolated': return <AlertCircle className="h-3 w-3 text-amber-500" />;
            case 'skipped': return <TimerOff className="h-3 w-3 text-muted-foreground" />;
            case 'cancelled': return <TimerOff className="h-3 w-3 text-red-500" />;
        }
    };

    return (
        <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">
                Linha do Tempo Real
            </h3>

            <div className="relative space-y-3 pl-4 border-l-2 border-muted ml-2">
                {sortedRecords.map((record) => (
                    <div key={record.id} className="relative">
                        {/* Dot on the timeline */}
                        <div
                            className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-background"
                            style={{ backgroundColor: TYPE_COLORS[record.type] }}
                        />

                        <Card className={cn(
                            "p-3 transition-all",
                            record.status === 'skipped' && "opacity-60 bg-muted/30"
                        )}>
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">
                                            {formatTime(record.startTime)} — {formatTime(record.endTime)}
                                        </p>
                                        {getStatusIcon(record.status)}
                                    </div>
                                    <p className="text-sm font-bold truncate">{record.title}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                        {TYPE_LABELS[record.type]} • {record.duration} min
                                        {record.wasPlanned && " • Planejado"}
                                    </p>
                                </div>

                                {record.actualDuration && record.actualDuration !== record.duration && (
                                    <div className="text-right flex-shrink-0">
                                        <p className={cn(
                                            "text-[10px] font-bold p-1 rounded-md inline-block",
                                            record.actualDuration > record.duration ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                                        )}>
                                            {record.actualDuration > record.duration ? `+${record.actualDuration - record.duration}m` : `${record.actualDuration - record.duration}m`}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {record.interruptions && record.interruptions > 0 && (
                                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-red-500 font-medium">
                                    <AlertCircle className="h-2.5 w-2.5" />
                                    <span>{record.interruptions} interrupç{record.interruptions > 1 ? 'ões' : 'ão'}</span>
                                </div>
                            )}
                        </Card>
                    </div>
                ))}

                {/* Dynamic gap filler or indicator of "now" could go here */}
            </div>
        </section>
    );
}
