import { useState, useMemo } from 'react';
import { YearlyGoalsHeader } from '../components/mobile/YearlyGoalsHeader';
import { YearlyGoalCard } from '../components/mobile/YearlyGoalCard';
import { YearlyGoalDetail } from '../components/mobile/YearlyGoalDetail';
import { mockYearlyGoalsData } from '../data/mockYearlyGoalsData';
import { mockLifeGoalsData } from '../data/mockLifeGoalsData';
import { YearlyGoal, YearlyStatus } from '../types/yearly-goals.types';
import { LifeAreaId } from '../types/life-goals.types';
import { Button } from '@/ui/components/components/ui';
import { Plus, LayoutGrid, Heart, Wallet, Briefcase, Users, Brain, Palmtree, Sparkles, Target, Filter, ChevronDown } from 'lucide-react';
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

export function YearlyGoals() {
    const [selectedArea, setSelectedArea] = useState<LifeAreaId | 'all'>('all');
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [showCompleted, setShowCompleted] = useState(false);

    const filteredGoals = useMemo(() => {
        return mockYearlyGoalsData.goals.filter(g => {
            const matchesArea = selectedArea === 'all' || g.areaId === selectedArea;
            const isCompleted = g.status === 'completed' || g.status === 'abandoned';
            return matchesArea && (showCompleted ? isCompleted : !isCompleted);
        });
    }, [selectedArea, showCompleted]);

    const selectedGoal = useMemo(() => {
        return mockYearlyGoalsData.goals.find(g => g.id === selectedGoalId) || null;
    }, [selectedGoalId]);

    const getArea = (areaId: LifeAreaId) => {
        return mockLifeGoalsData.areas.find(a => a.id === areaId);
    };

    const getLifeGoalTitle = (lifeGoalId: string) => {
        return mockLifeGoalsData.goals.find(g => g.id === lifeGoalId)?.title;
    };

    if (selectedGoal) {
        return (
            <div className="p-4 sm:p-6 max-w-2xl mx-auto">
                <YearlyGoalDetail
                    goal={selectedGoal}
                    area={getArea(selectedGoal.areaId)}
                    lifeGoalTitle={getLifeGoalTitle(selectedGoal.relatedLifeGoalId)}
                    onBack={() => setSelectedGoalId(null)}
                />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-10 pb-32 max-w-2xl mx-auto min-h-screen bg-background">
            <YearlyGoalsHeader summary={mockYearlyGoalsData.summary} />

            {/* Areas Filter Horizontal Scroll */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Filtro por Categoria
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

            {/* Goals List Contextual Header */}
            <section className="space-y-5">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {showCompleted ? 'Objetivos Finalizados' : 'Estratégias Ativas'} ({filteredGoals.length})
                        </h3>
                    </div>
                    <button
                        onClick={() => setShowCompleted(!showCompleted)}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                        <Filter className="h-3 w-3" />
                        {showCompleted ? 'Ver Ativos' : 'Ver Finalizados'}
                    </button>
                </div>

                <div className="grid gap-3 sm:gap-4">
                    {filteredGoals.length > 0 ? (
                        filteredGoals.map((goal) => (
                            <YearlyGoalCard
                                key={goal.id}
                                goal={goal}
                                area={getArea(goal.areaId)}
                                onClick={() => setSelectedGoalId(goal.id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/60">
                            <p className="text-sm text-muted-foreground font-medium">
                                Nenhum objetivo encontrado com esses filtros.
                            </p>
                            <Button
                                variant="link"
                                size="sm"
                                className="mt-2 text-primary uppercase text-[10px] font-bold tracking-widest"
                                onClick={() => {
                                    setSelectedArea('all');
                                    setShowCompleted(false);
                                }}
                            >
                                Limpar filtros
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Professional FAB */}
            <Button
                className="fixed bottom-10 right-6 sm:right-10 h-14 px-6 rounded-2xl shadow-xl shadow-foreground/10 bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95"
            >
                <Plus className="h-5 w-5 mr-2" />
                <span className="font-bold text-xs uppercase tracking-tighter">Novo Estratégico</span>
            </Button>

            {/* Strategic Tip Section */}
            <footer className="pt-12 text-center space-y-4">
                <div className="max-w-[300px] mx-auto p-4 bg-foreground/5 rounded-2xl border border-foreground/5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-2">Insight Analítico</p>
                    <p className="text-xs text-foreground/80 leading-relaxed italic">
                        "O foco anual protege seus grandes objetivos de vida do ruído das obrigações diárias."
                    </p>
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                    Nexus Strategy Module
                </p>
            </footer>
        </div>
    );
}
