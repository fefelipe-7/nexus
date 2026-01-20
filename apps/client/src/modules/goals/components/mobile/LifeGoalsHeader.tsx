import { Card, CardContent } from '@/ui/components/components/ui';
import { Target, Compass, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@nexus/shared';
import { LifeGoalsSummary } from '../../types/life-goals.types';

interface LifeGoalsHeaderProps {
    summary: LifeGoalsSummary;
}

export function LifeGoalsHeader({ summary }: LifeGoalsHeaderProps) {
    const getAlignmentColor = (level: string) => {
        switch (level) {
            case 'high': return 'text-emerald-500 bg-emerald-500/10';
            case 'medium': return 'text-blue-500 bg-blue-500/10';
            case 'low': return 'text-amber-500 bg-amber-500/10';
            default: return 'text-muted-foreground bg-muted';
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1.5 px-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Objetivos de Vida
                </h1>
                <p className="text-muted-foreground text-sm uppercase tracking-wider font-medium">
                    Direção e Propósito
                </p>
            </div>

            <div className="grid gap-4">
                <Card className="border-none bg-muted/30 shadow-none">
                    <CardContent className="p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2.5 rounded-xl",
                                getAlignmentColor(summary.alignmentLevel)
                            )}>
                                {summary.alignmentLevel === 'high' ? (
                                    <Sparkles className="h-5 w-5" />
                                ) : (
                                    <Compass className="h-5 w-5" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Status de Alinhamento
                                </p>
                                <p className="text-sm font-medium text-foreground">
                                    {summary.alignmentLevel === 'high' ? 'Alinhamento Ótimo' :
                                        summary.alignmentLevel === 'medium' ? 'Alinhamento Parcial' : 'Necessita Reflexão'}
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-foreground/80 leading-relaxed bg-background/50 p-3 rounded-lg border border-border/40">
                            {summary.alignmentMessage}
                        </p>

                        <div className="grid grid-cols-2 gap-8 pt-2">
                            <div className="space-y-0.5">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Ativos</p>
                                <p className="text-xl font-bold text-foreground">{summary.activeCount}</p>
                            </div>
                            <div className="grow space-y-0.5 text-right">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Revisado em</p>
                                <p className="text-xs font-semibold text-foreground">
                                    {summary.lastReviewDate
                                        ? summary.lastReviewDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                                        : 'Pendente'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
