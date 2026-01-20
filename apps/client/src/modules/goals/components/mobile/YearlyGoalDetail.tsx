import { Button } from '@/ui/components/components/ui';
import {
    ArrowLeft,
    Target,
    CheckCircle2,
    ShieldAlert,
    TrendingUp,
    Zap,
    Activity,
    History,
    Link as LinkIcon,
    Heart, Wallet, Briefcase, Users, Brain, Palmtree, Sparkles,
    ArrowUpRight
} from 'lucide-react';
import { YearlyGoal } from '../../types/yearly-goals.types';
import { LifeArea } from '../../types/life-goals.types';
import { cn } from '@nexus/shared';

interface YearlyGoalDetailProps {
    goal: YearlyGoal;
    area?: LifeArea;
    lifeGoalTitle?: string;
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

export function YearlyGoalDetail({ goal, area, lifeGoalTitle, onBack }: YearlyGoalDetailProps) {
    const AreaIcon = area?.icon ? (areaIconMap[area.icon] || Target) : Target;

    return (
        <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="-ml-2 text-muted-foreground"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Estratégia Anual
                </Button>
            </div>

            <header className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted/50 rounded-2xl border border-border/40">
                        <AreaIcon className="h-6 w-6" style={{ color: area?.color }} />
                    </div>
                    <div className="grow min-w-0">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                            {area?.name} • {goal.period}
                        </p>
                        <h2 className="text-2xl font-bold leading-tight">{goal.title}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">Consistência</p>
                        <p className="text-lg font-bold text-foreground">{goal.perceivedConsistency}%</p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">Relevância</p>
                        <p className={cn(
                            "text-sm font-bold",
                            goal.importance === 'high' ? "text-amber-500" : "text-blue-500"
                        )}>
                            {goal.importance === 'high' ? 'CRÍTICA' : 'MODERADA'}
                        </p>
                    </div>
                </div>

                <div className="relative p-5 rounded-2xl bg-muted/30 border border-border/40">
                    <p className="text-sm text-foreground/90 italic leading-relaxed text-center">
                        "{goal.description}"
                    </p>
                </div>
            </header>

            <div className="grid gap-8">
                {/* Strategic Context */}
                <section className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5" />
                        Por que este ano?
                    </h3>
                    <div className="text-sm text-foreground/80 leading-relaxed bg-background p-4 rounded-xl border border-border/40">
                        {goal.whyThisYear}
                    </div>
                </section>

                {/* Life Connection */}
                <section className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <LinkIcon className="h-3.5 w-3.5" />
                        Vínculo com Direção de Vida
                    </h3>
                    <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 flex items-center justify-between">
                        <div className="grow min-w-0 px-1">
                            <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tighter mb-0.5">Objetivo de Vida</p>
                            <p className="text-sm font-bold truncate">{lifeGoalTitle || 'Objetivo Não Vinculado'}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-orange-500 shrink-0" />
                    </div>
                </section>

                {/* Metrics/Impacts */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <section className="space-y-3">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Impacto Positivo</h3>
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs leading-relaxed">
                            {goal.impactIfAchieved}
                        </div>
                    </section>
                    <section className="space-y-3">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Risco de Inércia</h3>
                        <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs leading-relaxed">
                            {goal.riskIfIgnored}
                        </div>
                    </section>
                </div>

                {/* Success Criteria */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Critérios de Sucesso
                    </h3>
                    <div className="grid gap-2">
                        {goal.successCriteria.map((criterion, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3.5 bg-muted/30 rounded-lg border border-border/20 text-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-foreground/20 shrink-0" />
                                <span>{criterion}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Action Gap */}
                <section className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5" />
                        Desdobramento Tático
                    </h3>
                    <div className={cn(
                        "p-5 rounded-2xl border flex items-center justify-between gap-4",
                        goal.activeMetaIds.length > 0 ? "bg-blue-500/5 border-blue-500/20" : "bg-amber-500/5 border-amber-500/20 border-dashed"
                    )}>
                        <div className="space-y-1">
                            <p className="text-sm font-bold">
                                {goal.activeMetaIds.length > 0
                                    ? `${goal.activeMetaIds.length} metas ativas conectadas`
                                    : 'Nenhuma meta ativa definida'}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium">
                                {goal.activeMetaIds.length > 0
                                    ? 'O objetivo está sendo materializado em metas.'
                                    : 'Objetivos anuais precisam de metas para sair do papel.'}
                            </p>
                        </div>
                        <Button size="sm" variant={goal.activeMetaIds.length > 0 ? "outline" : "default"} className="h-9 truncate px-4">
                            {goal.activeMetaIds.length > 0 ? 'Ver Metas' : 'Criar Meta'}
                        </Button>
                    </div>
                </section>
            </div>

            <footer className="pt-10 border-t border-border/40">
                <div className="flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-2">
                        <History className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase">Iniciado em {goal.createdAt.toLocaleDateString('pt-BR')}</span>
                    </div>
                    {goal.lastReviewedAt && (
                        <span className="text-[10px] font-bold uppercase">Revisado em {goal.lastReviewedAt.toLocaleDateString('pt-BR')}</span>
                    )}
                </div>
            </footer>
        </div>
    );
}
