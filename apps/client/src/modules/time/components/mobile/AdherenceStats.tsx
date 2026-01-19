import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { AdherenceMetrics } from '../../types/history.types';
import { Target, Zap, Waves, Repeat } from 'lucide-react';

interface AdherenceStatsProps {
    metrics: AdherenceMetrics;
}

export function AdherenceStats({ metrics }: AdherenceStatsProps) {
    const stats = [
        {
            label: 'Concluídos',
            value: `${metrics.percentageConcluded}%`,
            sub: 'do planejado',
            icon: <Target className="h-4 w-4 text-green-500" />,
            color: 'bg-green-500/10',
        },
        {
            label: 'Foco Profundo',
            value: `${Math.floor(metrics.totalDeepWorkTime / 60)}h ${metrics.totalDeepWorkTime % 60}m`,
            sub: 'total hoje',
            icon: <Zap className="h-4 w-4 text-purple-500" />,
            color: 'bg-purple-500/10',
        },
        {
            label: 'Bloco Médio',
            value: `${metrics.averageFragmentSize} min`,
            sub: 'por atividade',
            icon: <Waves className="h-4 w-4 text-blue-500" />,
            color: 'bg-blue-500/10',
        },
        {
            label: 'Contexto',
            value: metrics.contextSwitches,
            sub: 'trocas de foco',
            icon: <Repeat className="h-4 w-4 text-orange-500" />,
            color: 'bg-orange-500/10',
        },
    ];

    return (
        <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">
                Qualidade e Aderência
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-3">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={cn("p-2 rounded-xl", stat.color)}>
                                {stat.icon}
                            </div>
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-tight">
                                {stat.label}
                            </p>
                        </div>
                        <div>
                            <p className="text-xl font-bold">{stat.value}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
}
