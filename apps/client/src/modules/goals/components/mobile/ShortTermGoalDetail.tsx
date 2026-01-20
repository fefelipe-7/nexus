import { Button } from '@/ui/components/components/ui';
import {
    ArrowLeft,
    Target,
    CheckCircle2,
    Circle,
    AlertCircle,
    TrendingUp,
    Zap,
    Activity,
    History,
    Link as LinkIcon,
    Heart, Wallet, Briefcase, Users, Brain, Palmtree, Sparkles,
    ArrowUpRight,
    ShieldAlert,
    Clock,
    Layout
} from 'lucide-react';
import { ShortTermGoal, Milestone } from '../../types/short-term-goals.types';
import { LifeArea } from '../../types/life-goals.types';
import { cn } from '@nexus/shared';

interface ShortTermGoalDetailProps {
    goal: ShortTermGoal;
    area?: LifeArea;
    parentGoalTitle?: string;
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

export function ShortTermGoalDetail({ goal, area, parentGoalTitle, onBack }: ShortTermGoalDetailProps) {
    const AreaIcon = area?.icon ? (areaIconMap[area.icon] || Target) : Target;

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
                    Execução Mensal
                </Button>
            </div>

            <header className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "p-3 rounded-2xl border ",
                        goal.status === 'completed' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-muted/50 border-border/40"
                    )}>
                        {goal.status === 'completed' ? (
                            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        ) : (
                            <AreaIcon className="h-6 w-6" style={{ color: area?.color }} />
                        )}
                    </div>
                    <div className="grow min-w-0">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                            {area?.name} • Curto Prazo
                        </p>
                        <h2 className="text-2xl font-bold leading-tight">{goal.title}</h2>
                    </div>
                </div>

                {goal.isAtRisk && (
                    <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-start gap-3">
                        <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-rose-600">Meta em Risco</p>
                            <p className="text-xs text-rose-600/70 leading-relaxed italic">{goal.riskReason}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">Progresso</p>
                        <p className="text-lg font-bold text-foreground">{goal.progress}%</p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">Prioridade</p>
                        <p className={cn(
                            "text-[10px] font-bold uppercase",
                            goal.priority === 'high' ? "text-rose-500" : goal.priority === 'medium' ? "text-amber-500" : "text-blue-500"
                        )}>
                            {goal.priority === 'high' ? 'Crítica' : goal.priority === 'medium' ? 'Média' : 'Baixa'}
                        </p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">Prazo</p>
                        <p className="text-[10px] font-bold text-foreground">
                            {goal.deadline.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid gap-8">
                {/* Milestones Section */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Layout className="h-3.5 w-3.5" />
                        Marcos de Entrega
                    </h3>
                    <div className="grid gap-2">
                        {goal.milestones.map((milestone) => (
                            <div
                                key={milestone.id}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-xl border transition-colors",
                                    milestone.isCompleted
                                        ? "bg-emerald-500/[0.03] border-emerald-500/10"
                                        : "bg-background border-border/40"
                                )}
                            >
                                {milestone.isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground/30 shrink-0" />
                                )}
                                <span className={cn(
                                    "text-sm font-medium",
                                    milestone.isCompleted ? "text-foreground/60 line-through" : "text-foreground"
                                )}>
                                    {milestone.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Strategic Purpose */}
                <section className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5" />
                        Contexto Estratégico
                    </h3>
                    <div className="space-y-4">
                        <div className="text-sm text-foreground/80 leading-relaxed bg-background p-4 rounded-xl border border-border/40">
                            {goal.description}
                        </div>
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-between">
                            <div className="grow min-w-0 px-1">
                                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter mb-0.5">Objetivo Pai (Anual)</p>
                                <p className="text-sm font-bold truncate">{parentGoalTitle || 'Objetivo Não Vinculado'}</p>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-blue-500 shrink-0" />
                        </div>
                    </div>
                </section>

                {/* Impact Analysis */}
                <section className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5" />
                        Impacto no Resultado
                    </h3>
                    <div className="p-4 rounded-xl bg-muted/20 border border-border/40 text-xs leading-relaxed italic text-foreground/70">
                        "{goal.estimatedImpact}"
                    </div>
                </section>

                {/* Integration Links */}
                <section className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <LinkIcon className="h-3.5 w-3.5" />
                        Conexão com Execução
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl border border-border/40 bg-background flex flex-col items-center justify-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tighter">Tempo</span>
                            <span className="text-xs font-medium">{goal.relatedTimeBlockIds.length > 0 ? 'Conectado' : 'Sem Blocos'}</span>
                        </div>
                        <div className="p-4 rounded-xl border border-border/40 bg-background flex flex-col items-center justify-center gap-2">
                            <History className="h-4 w-4 text-muted-foreground" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tighter">Hábitos</span>
                            <span className="text-xs font-medium">{goal.relatedHabitIds.length > 0 ? 'Vinculado' : 'Sem Hábitos'}</span>
                        </div>
                    </div>
                </section>
            </div>

            <footer className="pt-10 border-t border-border/40">
                <div className="flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-2">
                        <History className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase">Meta ativa há 15 dias</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
