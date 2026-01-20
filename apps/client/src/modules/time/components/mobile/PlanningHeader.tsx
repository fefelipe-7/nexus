import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { Target, Zap, Clock, Info } from 'lucide-react';
import { WeeklyPlan } from '../../types/planning.types';

interface PlanningHeaderProps {
    plan: WeeklyPlan;
    currentStepIndex: number;
    totalSteps: number;
}

export function PlanningHeader({ plan, currentStepIndex, totalSteps }: PlanningHeaderProps) {
    const progress = ((currentStepIndex + 1) / totalSteps) * 100;

    const loadColors = {
        low: 'text-green-500 bg-green-500/10',
        moderate: 'text-blue-500 bg-blue-500/10',
        high: 'text-amber-500 bg-amber-500/10',
        critical: 'text-red-500 bg-red-500/10',
    };

    const loadLabels = {
        low: 'Carga Leve',
        moderate: 'Carga Moderada',
        high: 'Carga Alta',
        critical: 'Sobrecarga Relevante',
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Planejamento</h1>
                    <p className="text-sm font-medium text-muted-foreground">{plan.period.label}</p>
                </div>
                <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    loadColors[plan.loadIndicator]
                )}>
                    {loadLabels[plan.loadIndicator]}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                    <span>Passo {currentStepIndex + 1} de {totalSteps}</span>
                    <span>{Math.round(progress)}% concluído</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {currentStepIndex === 0 && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg h-fit">
                            <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold">Ritual Semanal</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Este é seu momento de pausa consciente. Defina sua intenção para evitar que a semana se torne apenas reativa.
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
