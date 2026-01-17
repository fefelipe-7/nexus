import { Card } from '@/ui/components/components/ui';
import { Calendar, Clock, Zap, Coffee, AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { AgendaSummary } from '../../types/agenda.types';

interface AgendaHeaderProps {
    summary: AgendaSummary;
    currentDate: Date;
}

export function AgendaHeader({ summary, currentDate }: AgendaHeaderProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    };

    const getOccupancyColor = (rate: number) => {
        if (rate >= 85) return 'text-red-500';
        if (rate >= 70) return 'text-amber-500';
        return 'text-green-500';
    };

    const getOccupancyBg = (rate: number) => {
        if (rate >= 85) return 'bg-red-500/10';
        if (rate >= 70) return 'bg-amber-500/10';
        return 'bg-green-500/10';
    };

    return (
        <Card className="overflow-hidden">
            <div className="p-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                {/* Date & Occupancy */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            Hoje
                        </p>
                        <p className="text-lg font-semibold capitalize mt-0.5">
                            {formatDate(currentDate)}
                        </p>
                    </div>
                    <div className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full",
                        getOccupancyBg(summary.todayOccupancy)
                    )}>
                        <Clock className="h-3.5 w-3.5" />
                        <span className={cn("text-xs font-semibold", getOccupancyColor(summary.todayOccupancy))}>
                            {summary.todayOccupancy.toFixed(0)}% ocupado
                        </span>
                    </div>
                </div>

                {/* Main Insight */}
                <button className={cn(
                    "w-full p-3 rounded-xl text-left mb-4 transition-colors",
                    summary.mainInsight.type === 'warning' && "bg-amber-500/10 border border-amber-500/30",
                    summary.mainInsight.type === 'suggestion' && "bg-blue-500/10 border border-blue-500/30",
                    summary.mainInsight.type === 'achievement' && "bg-green-500/10 border border-green-500/30"
                )}>
                    <div className="flex items-start gap-2">
                        {summary.mainInsight.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />}
                        <div className="flex-1">
                            <p className="text-sm font-medium">{summary.mainInsight.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{summary.mainInsight.description}</p>
                        </div>
                        {summary.mainInsight.actionable && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                </button>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-2">
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-2.5 text-center">
                        <Zap className="h-4 w-4 mx-auto text-primary mb-1" />
                        <p className="text-sm font-bold">{summary.focusBlocksThisWeek}</p>
                        <p className="text-[9px] text-muted-foreground">Foco</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-2.5 text-center">
                        <Coffee className="h-4 w-4 mx-auto text-green-500 mb-1" />
                        <p className="text-sm font-bold">{summary.restBlocksThisWeek}</p>
                        <p className="text-[9px] text-muted-foreground">Descanso</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-2.5 text-center">
                        <Clock className="h-4 w-4 mx-auto text-amber-500 mb-1" />
                        <p className="text-sm font-bold">{summary.upcomingDeadlines}</p>
                        <p className="text-[9px] text-muted-foreground">Prazos</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-2.5 text-center">
                        <Calendar className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-sm font-bold">{summary.weekOccupancy.toFixed(0)}%</p>
                        <p className="text-[9px] text-muted-foreground">Semana</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
