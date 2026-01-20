import { useState, useMemo } from 'react';
import { ShortTermGoalsHeader } from '../components/mobile/ShortTermGoalsHeader';
import { ShortTermGoalCard } from '../components/mobile/ShortTermGoalCard';
import { ShortTermGoalDetail } from '../components/mobile/ShortTermGoalDetail';
import { mockShortTermGoalsData } from '../data/mockShortTermGoalsData';
import { mockYearlyGoalsData } from '../data/mockYearlyGoalsData';
import { mockLifeGoalsData } from '../data/mockLifeGoalsData';
import { ShortTermGoal, ShortTermStatus } from '../types/short-term-goals.types';
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

export function ShortTermGoals() {
    const [selectedArea, setSelectedArea] = useState<LifeAreaId | 'all'>('all');
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [showCompleted, setShowCompleted] = useState(false);

    const filteredGoals = useMemo(() => {
        return mockShortTermGoalsData.goals.filter(g => {
            const matchesArea = selectedArea === 'all' || g.areaId === selectedArea;
            const isCompleted = g.status === 'completed';
            return matchesArea && (showCompleted ? isCompleted : !isCompleted);
        });
    }, [selectedArea, showCompleted]);

    const selectedGoal = useMemo(() => {
        return mockShortTermGoalsData.goals.find(g => g.id === selectedGoalId) || null;
    }, [selectedGoalId]);

    const getArea = (areaId: LifeAreaId) => {
        return mockLifeGoalsData.areas.find(a => a.id === areaId);
    };

    const getParentGoalTitle = (parentYearlyGoalId: string) => {
        return mockYearlyGoalsData.goals.find(g => g.id === parentYearlyGoalId)?.title;
    };

    if (selectedGoal) {
        return (
            <div className="p-4 sm:p-6 max-w-2xl mx-auto">
                <ShortTermGoalDetail
                    goal={selectedGoal}
                    area={getArea(selectedGoal.areaId)}
                    parentGoalTitle={getParentGoalTitle(selectedGoal.parentYearlyGoalId)}
                    onBack={() => setSelectedGoalId(null)}
                />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-10 pb-32 max-w-2xl mx-auto min-h-screen bg-background">
            <ShortTermGoalsHeader summary={mockShortTermGoalsData.summary} />

            {/* Areas Selection */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Categorias em Foco
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

            {/* List Context */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {showCompleted ? 'Resultados Alcançados' : 'Metas em Execução'} ({filteredGoals.length})
                    </h3>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowCompleted(!showCompleted)}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                        >
                            <Filter className="h-3 w-3" />
                            {showCompleted ? 'Ver Ativas' : 'Ver Concluídas'}
                        </button>
                    </div>
                </div>

                <div className="grid gap-3 sm:gap-4">
                    {filteredGoals.length > 0 ? (
                        filteredGoals.map((goal) => (
                            <ShortTermGoalCard
                                key={goal.id}
                                goal={goal}
                                area={getArea(goal.areaId)}
                                onClick={() => setSelectedGoalId(goal.id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-muted/20 rounded-3xl border border-dashed border-border/60">
                            <p className="text-sm text-muted-foreground font-medium">Nenhuma meta encontrada.</p>
                            <Button
                                variant="link"
                                size="sm"
                                className="mt-2 text-primary uppercase text-[10px] font-bold"
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

            {/* Execution FAB */}
            <Button
                className="fixed bottom-10 right-6 sm:right-10 h-14 px-6 rounded-2xl shadow-xl shadow-foreground/10 bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95"
            >
                <Plus className="h-5 w-5 mr-2" />
                <span className="font-bold text-xs uppercase tracking-tighter">Nova Meta Tática</span>
            </Button>

            {/* Strategic Footer */}
            <footer className="pt-12 text-center space-y-6">
                <div className="max-w-[280px] mx-auto space-y-3">
                    <div className="h-px w-6 bg-border/60 mx-auto" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                        "O sucesso no longo prazo é a soma de vitórias táticas consistentes no curto prazo."
                    </p>
                </div>
            </footer>
        </div>
    );
}
