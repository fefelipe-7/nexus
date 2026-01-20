import { Button } from '@/ui/components/components/ui';
import {
    Target,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    History,
    Activity,
    Goal,
    Link as LinkIcon,
    Heart, Wallet, Briefcase, Users, Brain, Palmtree, Sparkles
} from 'lucide-react';
import { LifeGoal, LifeArea } from '../../types/life-goals.types';
import { cn } from '@nexus/shared';

interface LifeGoalDetailProps {
    goal: LifeGoal;
    area?: LifeArea;
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

export function LifeGoalDetail({ goal, area, onBack }: LifeGoalDetailProps) {
    const AreaIcon = area?.icon ? (areaIconMap[area.icon] || Target) : Target;

    return (
        <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="-ml-2 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                </Button>
            </div>

            <header className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted/50 rounded-2xl border border-border/40">
                        <AreaIcon className="h-6 w-6" style={{ color: area?.color }} />
                    </div>
                    <div className="grow min-w-0">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                            {area?.name}
                        </p>
                        <h2 className="text-2xl font-bold leading-tight truncate">{goal.title}</h2>
                    </div>
                </div>

                <div className="relative p-5 rounded-2xl bg-muted/20 border border-border/50">
                    <p className="text-base text-foreground/90 italic leading-relaxed text-center quote">
                        "{goal.description}"
                    </p>
                </div>
            </header>

            <div className="grid gap-8">
                {/* Purpose Section */}
                <section className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Goal className="h-3.5 w-3.5" />
                        Significado e Porquê
                    </h3>
                    <div className="text-sm text-foreground/80 leading-relaxed bg-background p-4 rounded-xl border border-border/40 shadow-sm">
                        {goal.whyItMatters}
                    </div>
                </section>

                {/* Indicators Section */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5" />
                        Evidências de Progresso
                    </h3>
                    <div className="grid gap-2">
                        {goal.successIndicators.map((indicator, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3.5 bg-muted/30 rounded-lg border border-border/20 text-sm font-medium">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                <span>{indicator}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Metas/Links Section */}
                <section className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <LinkIcon className="h-3.5 w-3.5" />
                        Conexões Ativas
                    </h3>
                    <div className={cn(
                        "p-4 rounded-xl border flex items-center justify-between",
                        goal.relatedMetaIds.length > 0
                            ? "bg-blue-500/5 border-blue-500/20"
                            : "bg-muted/30 border-border/50"
                    )}>
                        <span className="text-sm font-semibold">
                            {goal.relatedMetaIds.length > 0
                                ? `${goal.relatedMetaIds.length} metas vinculadas`
                                : 'Nenhuma meta associada'}
                        </span>
                        <Button size="sm" variant="outline" className="h-8 shadow-none">
                            Gerenciar
                        </Button>
                    </div>
                </section>

                {/* Not Included Section */}
                <section className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Não é o foco
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {goal.whatIsNotIncluded.map((item, idx) => (
                            <span key={idx} className="text-[11px] py-1.5 px-3 rounded-lg bg-background border border-border/60 text-muted-foreground font-medium">
                                {item}
                            </span>
                        ))}
                    </div>
                </section>
            </div>

            <footer className="pt-8 border-t border-border/40">
                <div className="flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        <span className="text-xs font-medium">Criado em {goal.createdAt.toLocaleDateString('pt-BR')}</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{goal.horizon}</span>
                </div>
            </footer>
        </div>
    );
}
