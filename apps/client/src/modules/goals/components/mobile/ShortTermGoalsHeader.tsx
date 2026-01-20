import { Card, CardContent } from '@/ui/components/components/ui';
import {
    PlayCircle,
    Calendar,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Zap,
    Target
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { ShortTermGoalsSummary } from '../../types/short-term-goals.types';

interface ShortTermGoalsHeaderProps {
    summary: ShortTermGoalsSummary;
}

export function ShortTermGoalsHeader({ summary }: ShortTermGoalsHeaderProps) {
    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'improving': return <TrendingUp className="h-4 w-4 text-emerald-500" />;
            case 'declining': return <AlertCircle className="h-4 w-4 text-rose-500" />;
            default: return <TrendingUp className="h-4 w-4 text-blue-500 opacity-50" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="px-1 space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Metas de Curto Prazo
                </h1>
                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                    <Zap className="h-3 w-3" />
                    Execução e Resultados Táticos
                </p>
            </div>

            {/* Snapshot Cards */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="bg-blue-500/[0.03] border-blue-500/10 shadow-none">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-2">
                            <PlayCircle className="h-4 w-4 text-blue-500" />
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-500/10 px-1.5 py-0.5 rounded uppercase">Ativas</span>
                        </div>
                        <p className="text-2xl font-bold">{summary.activeCount}</p>
                    </CardContent>
                </Card>

                <Card className="bg-amber-500/[0.03] border-amber-500/10 shadow-none">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-2">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase">Em Risco</span>
                        </div>
                        <p className="text-2xl font-bold">{summary.atRiskCount}</p>
                    </CardContent>
                </Card>

                <Card className="bg-emerald-500/[0.03] border-emerald-500/10 shadow-none">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">Feitas</span>
                        </div>
                        <p className="text-2xl font-bold">{summary.completedCount}</p>
                    </CardContent>
                </Card>

                <Card className="bg-muted/30 border-border/50 shadow-none">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">Prazo Médio</span>
                        </div>
                        <p className="text-2xl font-bold flex items-baseline gap-1">
                            {summary.averageDeadlineDays}
                            <span className="text-[10px] font-medium text-muted-foreground">dias</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Trend Message */}
            <div className="bg-muted/20 border border-border/40 p-4 rounded-2xl flex gap-3 items-center">
                <div className="p-2 bg-background rounded-lg border border-border/20">
                    {getTrendIcon(summary.trends.status)}
                </div>
                <div className="grow">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Dinâmica de Execução</p>
                    <p className="text-xs text-foreground/80 leading-relaxed italic">
                        "{summary.trends.message}"
                    </p>
                </div>
            </div>
        </div>
    );
}
