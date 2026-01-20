import { Card, CardContent } from '@/ui/components/components/ui';
import {
    BarChart3,
    Activity,
    AlertTriangle,
    Lock,
    TrendingUp,
    TrendingDown,
    Layout
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { ActionPlansSummary } from '../../types/action-plans.types';

interface ActionPlansHeaderProps {
    summary: ActionPlansSummary;
}

export function ActionPlansHeader({ summary }: ActionPlansHeaderProps) {
    const getTrendIcon = (direction: string) => {
        switch (direction) {
            case 'improving': return <TrendingUp className="h-4 w-4 text-emerald-500" />;
            case 'declining': return <TrendingDown className="h-4 w-4 text-rose-500" />;
            default: return <BarChart3 className="h-4 w-4 text-blue-500 opacity-50" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="px-1 space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Planos de Ação
                </h1>
                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                    <Layout className="h-3 w-3" />
                    Mapas Operacionais de Execução
                </p>
            </div>

            {/* Snapshot Cards */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="bg-emerald-500/[0.03] border-emerald-500/10 shadow-none">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-2">
                            <Activity className="h-4 w-4 text-emerald-500" />
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase font-bold">No Ritmo</span>
                        </div>
                        <p className="text-2xl font-bold">{summary.activeCount}</p>
                    </CardContent>
                </Card>

                <Card className="bg-rose-500/[0.03] border-rose-500/10 shadow-none">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-2">
                            <Lock className="h-4 w-4 text-rose-500" />
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-500/10 px-1.5 py-0.5 rounded uppercase font-bold">Bloqueados</span>
                        </div>
                        <p className="text-2xl font-bold">{summary.blockedCount}</p>
                    </CardContent>
                </Card>

                <Card className="bg-amber-500/[0.03] border-amber-500/10 shadow-none">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase font-bold">Atenção</span>
                        </div>
                        <p className="text-2xl font-bold">{summary.needsAttentionCount}</p>
                    </CardContent>
                </Card>

                <Card className="bg-muted/30 border-border/50 shadow-none">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase font-bold">Meta: {summary.trends.period}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {getTrendIcon(summary.trends.direction)}
                            <span className="text-xs font-bold text-foreground/80 uppercase tracking-tighter">
                                {summary.trends.direction === 'improving' ? 'Evoluindo' : 'Estável'}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
