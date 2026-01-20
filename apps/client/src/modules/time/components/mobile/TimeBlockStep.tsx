import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { Clock, Plus, Target, Zap, Waves, Calendar } from 'lucide-react';
import { WeeklyPriority } from '../../types/planning.types';

interface TimeBlockStepProps {
    priorities: WeeklyPriority[];
}

export function TimeBlockStep({ priorities }: TimeBlockStepProps) {
    const dayTypes = [
        { label: 'Blocos de Foco', icon: <Zap className="h-4 w-4 text-purple-500" />, count: 3, area: 'Estratégico' },
        { label: 'Rotinas e Manutenção', icon: <Waves className="h-4 w-4 text-blue-500" />, count: 12, area: 'Operacional' },
        { label: 'Obrigações Fixas', icon: <Clock className="h-4 w-4 text-amber-500" />, count: 8, area: 'Inadiável' },
    ];

    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center px-4">
                <h3 className="text-lg font-bold">Estrutura de Blocos</h3>
                <p className="text-xs text-muted-foreground">
                    Distribua seus blocos de foco ao longo da semana. Garanta que suas prioridades tenham tempo dedicado.
                </p>
            </div>

            <div className="space-y-3">
                {dayTypes.map((type, i) => (
                    <Card key={i} className="p-3 flex items-center justify-between border-none bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-background rounded-xl">
                                {type.icon}
                            </div>
                            <div>
                                <p className="text-sm font-bold">{type.label}</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{type.area}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-lg">
                            <span className="text-xs font-bold">{type.count}</span>
                            <span className="text-[10px] text-muted-foreground">blocos</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Simplified Weekly Grid */}
            <section className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Visualização da Semana</h4>
                    <button className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                        <Calendar className="h-3 w-3" />
                        <span>Ver Agenda Completa</span>
                    </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {days.map((day) => (
                        <div key={day} className="flex-shrink-0 w-24 space-y-2">
                            <div className="text-center py-2 bg-muted/20 rounded-t-xl border-x border-t border-muted">
                                <p className="text-[10px] font-bold uppercase">{day}</p>
                            </div>
                            <div className="min-h-[120px] bg-muted/10 border border-muted rounded-b-xl p-1.5 space-y-1">
                                {day !== 'Sáb' && day !== 'Dom' && (
                                    <>
                                        <div className="h-8 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                                            <Zap className="h-3 w-3 text-purple-600" />
                                        </div>
                                        <div className="h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg" />
                                    </>
                                )}
                                <button className="w-full h-8 border-2 border-dashed border-muted rounded-lg flex items-center justify-center hover:bg-muted/20 transition-colors">
                                    <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
                <p className="text-xs font-bold flex items-center gap-2">
                    <Target className="h-3.5 w-3.5 text-primary" />
                    Dica de Alocação
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Tente colocar seus blocos de foco nas manhãs, onde sua energia costuma estar mais alta. Reserve as tardes para tarefas de manutenção.
                </p>
            </div>
        </div>
    );
}
