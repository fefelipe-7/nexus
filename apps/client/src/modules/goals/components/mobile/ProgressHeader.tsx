import { Button } from '@/ui/components/components/ui';
import {
    BarChart3,
    Calendar,
    ChevronDown,
    Filter,
    Activity
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { ProgressContext } from '../../types/progress-indicators.types';

interface ProgressHeaderProps {
    context: ProgressContext;
    period: string;
    onContextChange: (ctx: ProgressContext) => void;
    onPeriodChange: (period: string) => void;
}

export function ProgressHeader({ context, period, onContextChange, onPeriodChange }: ProgressHeaderProps) {
    return (
        <div className="space-y-6">
            <div className="px-1 space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Indicadores de Progresso
                </h1>
                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5" />
                    Diagnóstico e Orientação de Avanço
                </p>
            </div>

            <div className="flex flex-col gap-4 bg-muted/20 p-4 rounded-2xl border border-border/40">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Configuração da Análise</p>
                    <Filter className="h-3 w-3 text-muted-foreground/50" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-muted-foreground/60 uppercase ml-1">Escopo</label>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-between bg-background border-border/60 text-[11px] h-9 rounded-xl font-bold uppercase tracking-tighter"
                        >
                            <span className="truncate">{context === 'general' ? 'Geral' : 'Por Objetivo'}</span>
                            <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
                        </Button>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-muted-foreground/60 uppercase ml-1">Período</label>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-between bg-background border-border/60 text-[11px] h-9 rounded-xl font-bold uppercase tracking-tighter"
                        >
                            <span className="truncate">{period}</span>
                            <Calendar className="h-3 w-3 opacity-50 shrink-0" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
