import { Card } from '@/ui/components/components/ui';
import { AlertTriangle, CheckCircle, Clock, Calendar, Flame, Info } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { CommitmentsSummary, PressureLevel } from '../../types/commitments.types';

interface CommitmentsHeaderProps {
    summary: CommitmentsSummary;
}

export function CommitmentsHeader({ summary }: CommitmentsHeaderProps) {
    const getPressureColor = (level: PressureLevel) => {
        switch (level) {
            case 'high': return 'text-red-500';
            case 'moderate': return 'text-amber-500';
            default: return 'text-green-500';
        }
    };

    const getPressureBg = (level: PressureLevel) => {
        switch (level) {
            case 'high': return 'bg-red-500/10';
            case 'moderate': return 'bg-amber-500/10';
            default: return 'bg-green-500/10';
        }
    };

    const getPressureLabel = (level: PressureLevel) => {
        switch (level) {
            case 'high': return 'Pressão alta';
            case 'moderate': return 'Moderada';
            default: return 'Tranquilo';
        }
    };

    return (
        <Card className="overflow-hidden">
            <div className="p-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                {/* Main Stats */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Compromissos Ativos
                        </p>
                        <p className="text-3xl font-bold tracking-tight mt-1">
                            {summary.totalActive}
                        </p>
                    </div>
                    <div className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full",
                        getPressureBg(summary.pressureLevel)
                    )}>
                        <Flame className="h-3.5 w-3.5" />
                        <span className={cn("text-xs font-semibold", getPressureColor(summary.pressureLevel))}>
                            {getPressureLabel(summary.pressureLevel)}
                        </span>
                    </div>
                </div>

                {/* Insight */}
                <div className={cn(
                    "p-3 rounded-xl mb-4",
                    summary.insight.type === 'warning' && "bg-amber-500/10 border border-amber-500/20",
                    summary.insight.type === 'success' && "bg-green-500/10 border border-green-500/20",
                    summary.insight.type === 'info' && "bg-blue-500/10 border border-blue-500/20"
                )}>
                    <div className="flex items-center gap-2">
                        {summary.insight.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                        {summary.insight.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {summary.insight.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                        <p className="text-sm font-medium">{summary.insight.message}</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-2">
                    <div className={cn(
                        "rounded-xl p-2.5 text-center",
                        summary.overdueCount > 0 ? "bg-red-500/10" : "bg-background/60"
                    )}>
                        <AlertTriangle className={cn(
                            "h-4 w-4 mx-auto mb-1",
                            summary.overdueCount > 0 ? "text-red-500" : "text-muted-foreground"
                        )} />
                        <p className={cn(
                            "text-sm font-bold",
                            summary.overdueCount > 0 && "text-red-500"
                        )}>{summary.overdueCount}</p>
                        <p className="text-[9px] text-muted-foreground">Atrasados</p>
                    </div>
                    <div className={cn(
                        "rounded-xl p-2.5 text-center",
                        summary.criticalCount > 0 ? "bg-amber-500/10" : "bg-background/60"
                    )}>
                        <Flame className={cn(
                            "h-4 w-4 mx-auto mb-1",
                            summary.criticalCount > 0 ? "text-amber-500" : "text-muted-foreground"
                        )} />
                        <p className={cn(
                            "text-sm font-bold",
                            summary.criticalCount > 0 && "text-amber-500"
                        )}>{summary.criticalCount}</p>
                        <p className="text-[9px] text-muted-foreground">Críticos</p>
                    </div>
                    <div className="bg-background/60 rounded-xl p-2.5 text-center">
                        <Clock className="h-4 w-4 mx-auto text-primary mb-1" />
                        <p className="text-sm font-bold">{summary.dueToday}</p>
                        <p className="text-[9px] text-muted-foreground">Hoje</p>
                    </div>
                    <div className="bg-background/60 rounded-xl p-2.5 text-center">
                        <Calendar className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-sm font-bold">{summary.dueThisWeek}</p>
                        <p className="text-[9px] text-muted-foreground">Semana</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
