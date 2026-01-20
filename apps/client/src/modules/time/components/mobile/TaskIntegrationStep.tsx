import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { ClipboardList, AlertCircle, ArrowDown, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { WeeklyPriority } from '../../types/planning.types';

interface TaskIntegrationStepProps {
    priorities: WeeklyPriority[];
}

export function TaskIntegrationStep({ priorities }: TaskIntegrationStepProps) {
    const suggestedTasks = [
        { id: 't1', title: 'Desenhar esquema de dados History', priority: 'Dominante', status: 'pending' },
        { id: 't2', title: 'Refatorar Context de Temas', priority: 'Secundária', status: 'allocated' },
        { id: 't3', title: 'Reunião de alinhamento design', priority: 'Fixa', status: 'pending' },
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center px-4">
                <h3 className="text-lg font-bold">Conectar Execução</h3>
                <p className="text-xs text-muted-foreground">
                    Escolha quais tarefas críticas devem ser resolvidas nesta semana. O sistema sugere itens baseados no seu foco.
                </p>
            </div>

            <section className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sugestões de Alocação</h4>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Top 3</span>
                </div>

                <div className="space-y-2">
                    {suggestedTasks.map((task) => (
                        <Card key={task.id} className={cn(
                            "p-3 border-none flex items-center justify-between",
                            task.status === 'allocated' ? "bg-green-500/10" : "bg-muted/30"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-xl h-fit",
                                    task.status === 'allocated' ? "bg-green-500/20 text-green-600" : "bg-background text-muted-foreground"
                                )}>
                                    <ClipboardList className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{task.title}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Prioridade {task.priority}</p>
                                </div>
                            </div>
                            <button
                                className={cn(
                                    "p-2 rounded-lg transition-all",
                                    task.status === 'allocated' ? "bg-green-500 text-white" : "bg-primary/10 text-primary"
                                )}
                            >
                                {task.status === 'allocated' ? <CheckCircle2 className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                            </button>
                        </Card>
                    ))}
                </div>
            </section>

            <Card className="p-4 bg-amber-500/5 border border-dashed border-amber-500/20">
                <div className="flex gap-3 items-start text-amber-700">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <div className="space-y-1">
                        <p className="text-xs font-bold">Alerta de Sobrecarga</p>
                        <p className="text-[10px] leading-relaxed">
                            Você já alocou 12 tarefas para esta semana. Com sua média histórica, você costuma concluir 8. Considere repriorizar.
                        </p>
                    </div>
                </div>
            </Card>

            <button className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground border-2 border-dashed border-muted rounded-2xl hover:bg-muted/10 transition-colors">
                <LayoutGrid className="h-4 w-4" />
                Ver Backlog Completo
            </button>
        </div>
    );
}
