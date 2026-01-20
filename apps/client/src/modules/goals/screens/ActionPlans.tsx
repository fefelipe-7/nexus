import { useState, useMemo } from 'react';
import { ActionPlansHeader } from '../components/mobile/ActionPlansHeader';
import { ActionPlanCard } from '../components/mobile/ActionPlanCard';
import { ActionPlanDetail } from '../components/mobile/ActionPlanDetail';
import { mockActionPlansData } from '../data/mockActionPlansData';
import { mockShortTermGoalsData } from '../data/mockShortTermGoalsData';
import { mockLifeGoalsData } from '../data/mockLifeGoalsData';
import { ActionPlan, PlanStatus } from '../types/action-plans.types';
import { LifeAreaId } from '../types/life-goals.types';
import { Button } from '@/ui/components/components/ui';
import { Plus, LayoutGrid, Heart, Wallet, Briefcase, Users, Brain, Palmtree, Sparkles, Target, Filter, ArrowUpDown } from 'lucide-react';
import { cn } from '@nexus/shared';

const areaIconMap: Record<string, any> = {
    heart: Heart,
    wallet: Wallet,
    briefcase: Briefcase,
    users: Users,
    brain: Brain,
    palmtree: Palmtree,
    sparkles: Sparkles,
};

export function ActionPlans() {
    const [selectedArea, setSelectedArea] = useState<LifeAreaId | 'all'>('all');
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<PlanStatus | 'all'>('all');

    const filteredPlans = useMemo(() => {
        return (mockActionPlansData.plans as any[]).filter(p => {
            const matchesArea = selectedArea === 'all' || p.areaId === selectedArea;
            const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
            return matchesArea && matchesStatus;
        });
    }, [selectedArea, statusFilter]);

    const selectedPlan = useMemo(() => {
        return (mockActionPlansData.plans as any[]).find(p => p.id === selectedGoalId) || null;
    }, [selectedGoalId]);

    const getArea = (areaId: LifeAreaId) => {
        return mockLifeGoalsData.areas.find(a => a.id === areaId);
    };

    const getShortTermGoalTitle = (stId: string) => {
        return mockShortTermGoalsData.goals.find(g => g.id === stId)?.title;
    };

    if (selectedPlan) {
        return (
            <div className="p-4 sm:p-6 max-w-2xl mx-auto">
                <ActionPlanDetail
                    plan={selectedPlan}
                    area={getArea(selectedPlan.areaId)}
                    shortTermGoalTitle={getShortTermGoalTitle(selectedPlan.shortTermGoalId)}
                    onBack={() => setSelectedGoalId(null)}
                />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-10 pb-32 max-w-2xl mx-auto min-h-screen bg-background">
            <ActionPlansHeader summary={mockActionPlansData.summary} />

            {/* Areas Selection */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Foco Operacional por Área
                    </h3>
                </div>

                <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
                    <Button
                        variant={selectedArea === 'all' ? 'default' : 'secondary'}
                        size="sm"
                        className={cn(
                            "rounded-xl flex-shrink-0 h-9 px-4 text-xs font-semibold shadow-none transition-all",
                            selectedArea === 'all' ? "bg-foreground text-background" : "bg-muted/50 border-none"
                        )}
                        onClick={() => setSelectedArea('all')}
                    >
                        <LayoutGrid className="mr-2 h-3.5 w-3.5" />
                        Todas
                    </Button>
                    {mockLifeGoalsData.areas.map((area) => {
                        const Icon = areaIconMap[area.icon] || Target;
                        const isActive = selectedArea === area.id;

                        return (
                            <Button
                                key={area.id}
                                variant={isActive ? 'default' : 'secondary'}
                                size="sm"
                                className={cn(
                                    "rounded-xl flex-shrink-0 h-9 px-4 text-xs font-semibold shadow-none transition-all gap-2",
                                    isActive ? "bg-foreground text-background" : "bg-muted/50 border-none"
                                )}
                                onClick={() => setSelectedArea(area.id)}
                            >
                                <Icon className={cn("h-3.5 w-3.5", !isActive && "text-muted-foreground")} />
                                {area.name}
                            </Button>
                        );
                    })}
                </div>
            </section>

            {/* Main List */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Seus Mapas de Ataque ({filteredPlans.length})
                    </h3>
                    <div className="relative">
                        <select
                            className="bg-muted px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter border-none focus:ring-1 focus:ring-primary/20 appearance-none pr-8"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                        >
                            <option value="all">Todos Status</option>
                            <option value="on_track">No Ritmo</option>
                            <option value="blocked">Bloqueado</option>
                            <option value="needs_attention">Atenção</option>
                            <option value="completed">Finalizado</option>
                        </select>
                        <Filter className="h-3 w-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                    </div>
                </div>

                <div className="grid gap-3 sm:gap-4">
                    {filteredPlans.length > 0 ? (
                        filteredPlans.map((plan) => (
                            <ActionPlanCard
                                key={plan.id}
                                plan={plan}
                                area={getArea(plan.areaId)}
                                onClick={() => setSelectedGoalId(plan.id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/60">
                            <p className="text-sm text-muted-foreground font-medium">Nenhum plano para esses critérios.</p>
                            <Button
                                variant="link"
                                size="sm"
                                className="mt-2 text-primary uppercase text-[10px] font-bold"
                                onClick={() => {
                                    setSelectedArea('all');
                                    setStatusFilter('all');
                                }}
                            >
                                Limpar filtros
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Operation FAB */}
            <Button
                className="fixed bottom-10 right-6 sm:right-10 h-14 px-6 rounded-2xl shadow-xl shadow-foreground/10 bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95"
            >
                <Plus className="h-5 w-5 mr-2" />
                <span className="font-bold text-xs uppercase tracking-tighter">Novo Mapa de Ação</span>
            </Button>

            {/* Refined Footer */}
            <footer className="pt-12 text-center opacity-60 px-4">
                <p className="text-[11px] text-muted-foreground leading-relaxed italic max-w-xs mx-auto">
                    "A diferença entre uma meta e um resultado é um plano de ação bem executado."
                </p>
            </footer>
        </div>
    );
}
