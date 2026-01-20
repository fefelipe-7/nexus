import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { Star, ShieldCheck, Clock, CalendarCheck, Zap } from 'lucide-react';
import { WeeklyPlan } from '../../types/planning.types';

interface ConfirmationStepProps {
    plan: WeeklyPlan;
}

export function ConfirmationStep({ plan }: ConfirmationStepProps) {
    const dominant = plan.priorities.find(p => p.isDominant);

    return (
        <div className="space-y-8">
            <div className="space-y-2 text-center px-4 pt-4">
                <div className="inline-flex p-3 bg-green-500/10 rounded-full mb-2">
                    <ShieldCheck className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold">Semana Planejada!</h3>
                <p className="text-sm text-muted-foreground">
                    Você criou um mapa realista para os próximos 7 dias. Está pronto para o compromisso?
                </p>
            </div>

            <div className="space-y-4">
                {/* Dominant Highlight */}
                <section className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Seu Grande Foco</h4>
                    {dominant && (
                        <Card className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 border-none text-white relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 opacity-10">
                                <Star className="h-24 w-24 fill-current" />
                            </div>
                            <div className="relative flex items-center gap-4">
                                <span className="text-4xl">{dominant.icon}</span>
                                <div className="space-y-1">
                                    <p className="text-lg font-bold leading-tight">{dominant.name}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Prioridade Dominante</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </section>

                {/* Quick Stats Summary */}
                <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4 bg-muted/30 border-none">
                        <div className="flex items-center gap-2 mb-2 text-purple-600">
                            <Zap className="h-4 w-4" />
                            <p className="text-[10px] font-bold uppercase tracking-tight">Foco</p>
                        </div>
                        <p className="text-xl font-bold">{plan.metrics.currentAllocatedFocusHours}h</p>
                        <p className="text-[10px] text-muted-foreground">alocadas na semana</p>
                    </Card>
                    <Card className="p-4 bg-muted/30 border-none">
                        <div className="flex items-center gap-2 mb-2 text-blue-600">
                            <CalendarCheck className="h-4 w-4" />
                            <p className="text-[10px] font-bold uppercase tracking-tight">Status</p>
                        </div>
                        <p className="text-xl font-bold">Viável</p>
                        <p className="text-[10px] text-muted-foreground">baseado em seu perfil</p>
                    </Card>
                </div>

                <div className="p-4 rounded-2xl bg-muted/20 border border-muted text-center space-y-1">
                    <p className="text-xs font-medium text-muted-foreground tracking-tight italic">
                        "A diferença entre quem faz e quem sonha é o planejamento realista seguido de ação imperfeita."
                    </p>
                </div>
            </div>
        </div>
    );
}
