import { Button } from '@/ui/components/components/ui';
import {
    ArrowLeft,
    Target,
    CheckCircle2,
    Circle,
    AlertCircle,
    Lock,
    Clock,
    Zap,
    Activity,
    ChevronDown,
    ChevronUp,
    Link as LinkIcon,
    Heart, Wallet, Briefcase, Users, Brain, Palmtree, Sparkles,
    ArrowUpRight,
    ShieldAlert,
    ListTodo
} from 'lucide-react';
import { ActionPlan, PlanStep, PlanAction, PlanDependency } from '../../types/action-plans.types';
import { LifeArea } from '../../types/life-goals.types';
import { cn } from '@nexus/shared';
import { useState } from 'react';

interface ActionPlanDetailProps {
    plan: ActionPlan;
    area?: LifeArea;
    shortTermGoalTitle?: string;
    onBack: () => void;
}

const areaIconMap: Record<string, any> = {
    heart: Heart,
    wallet: Wallet,
    briefcase: Briefcase,
    users: Users,
    brain: Brain,
    palmtree: Palmtree,
    sparkles: Sparkles,
};

export function ActionPlanDetail({ plan, area, shortTermGoalTitle, onBack }: ActionPlanDetailProps) {
    const AreaIcon = area?.icon ? (areaIconMap[area.icon] || Target) : Target;
    const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>(
        plan.steps.reduce((acc, step) => ({ ...acc, [step.id]: step.status === 'in_progress' }), {})
    );

    const toggleStep = (id: string) => {
        setExpandedSteps(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="-ml-2 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Mapas Operacionais
                </Button>
            </div>

            <header className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "p-3 rounded-2xl border shadow-sm",
                        "bg-muted/50 border-border/40"
                    )}>
                        <AreaIcon className="h-6 w-6" style={{ color: area?.color }} />
                    </div>
                    <div className="grow min-w-0">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                            {area?.name} • Plano de Ação
                        </p>
                        <h2 className="text-2xl font-bold leading-tight">{plan.title}</h2>
                    </div>
                </div>

                {plan.status === 'blocked' && (
                    <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-start gap-3">
                        <Lock className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-rose-600">Plano Bloqueado</p>
                            <p className="text-xs text-rose-600/70 leading-relaxed italic">
                                Identificamos dependências críticas não resolvidas que impedem o avanço deste plano.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">Impacto</p>
                        <p className="text-[10px] font-bold text-foreground uppercase">{plan.impact}</p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">Complexidade</p>
                        <p className="text-[10px] font-bold text-foreground uppercase">{plan.complexity}</p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">Conclusão</p>
                        <p className="text-[10px] font-bold text-foreground">
                            {plan.deadline?.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) || 'S/D'}
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid gap-8">
                {/* Strategic Origin */}
                <section className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <LinkIcon className="h-3.5 w-3.5" />
                        Vínculo com Resultado
                    </h3>
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between transition-colors">
                        <div className="grow min-w-0 px-1">
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter mb-0.5">Meta de Curto Prazo</p>
                            <p className="text-sm font-bold truncate">{shortTermGoalTitle || 'Meta Não Vinculada'}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-emerald-500 shrink-0" />
                    </div>
                </section>

                {/* Steps and Progression */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <ListTodo className="h-3.5 w-3.5" />
                        Etapas e Sequenciamento
                    </h3>

                    <div className="space-y-3">
                        {plan.steps.map((step) => (
                            <div
                                key={step.id}
                                className={cn(
                                    "border rounded-2xl overflow-hidden transition-all duration-300",
                                    step.status === 'completed' ? "bg-muted/10 border-border/30 opacity-75" :
                                        step.status === 'in_progress' ? "bg-background border-primary/20 shadow-sm" :
                                            step.status === 'blocked' ? "bg-rose-500/[0.02] border-rose-500/10" : "bg-background border-border"
                                )}
                            >
                                <div
                                    className="p-4 flex items-center justify-between cursor-pointer active:bg-muted/30"
                                    onClick={() => toggleStep(step.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                                            step.status === 'completed' ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground border border-border"
                                        )}>
                                            {step.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : step.order}
                                        </div>
                                        <span className={cn(
                                            "text-sm font-bold",
                                            step.status === 'completed' && "line-through"
                                        )}>{step.title}</span>
                                    </div>
                                    {expandedSteps[step.id] ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                </div>

                                {expandedSteps[step.id] && (
                                    <div className="px-4 pb-4 pt-0 space-y-4 animate-in fade-in duration-200">
                                        <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border/40 italic">
                                            "Para concluir: {step.criteriaForCompletion}"
                                        </div>

                                        {/* Actions in Step */}
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Ações Operacionais</p>
                                            <div className="grid gap-2">
                                                {step.actions.map(action => (
                                                    <div key={action.id} className="flex items-center justify-between p-3 bg-background border border-border/40 rounded-xl text-xs">
                                                        <div className="flex items-center gap-2">
                                                            {action.isCompleted ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Circle className="h-3.5 w-3.5 text-muted-foreground/30" />}
                                                            <span className={cn(action.isCompleted && "line-through text-muted-foreground")}>{action.title}</span>
                                                        </div>
                                                        <span className="text-[8px] font-bold uppercase text-muted-foreground/60">{action.effortEstimate}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Dependencies in Step */}
                                        {step.dependencies.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Dependências</p>
                                                {step.dependencies.map(dep => (
                                                    <div key={dep.id} className={cn(
                                                        "flex items-center gap-2 p-2.5 rounded-lg border text-[11px]",
                                                        dep.isResolved ? "bg-emerald-50/50 border-emerald-500/10 text-emerald-700/70" : "bg-rose-50 dark:bg-rose-500/5 border-rose-500/20 text-rose-700 dark:text-rose-400"
                                                    )}>
                                                        {dep.isResolved ? <CheckCircle2 className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                                        <span className="font-medium">{dep.description}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Intelligence Insight */}
                <section className="pt-4">
                    <div className="p-5 bg-foreground/5 rounded-2xl border border-foreground/5 space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-foreground/40" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Análise do Planejador</p>
                        </div>
                        <p className="text-xs text-foreground/80 leading-relaxed italic">
                            {plan.status === 'blocked'
                                ? "Este plano estagnou devido a uma dependência de 'Energia'. Considere recalibrar seu planejamento semanal para priorizar sua recuperação antes de retomar as etapas complexas."
                                : "Seu ritmo neste plano é consistente. A etapa de 'Negociação' tende a levar mais tempo que o esperado; considere antecipar o contato para garantir o prazo de Março."}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
