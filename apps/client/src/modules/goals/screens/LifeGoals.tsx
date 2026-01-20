import { useState, useMemo } from 'react';
import { LifeGoalsHeader } from '../components/mobile/LifeGoalsHeader';
import { LifeGoalCard } from '../components/mobile/LifeGoalCard';
import { LifeGoalDetail } from '../components/mobile/LifeGoalDetail';
import { mockLifeGoalsData } from '../data/mockLifeGoalsData';
import { LifeGoal, LifeAreaId } from '../types/life-goals.types';
import { Button } from '@/ui/components/components/ui';
import { Plus, LayoutGrid, Heart, Wallet, Briefcase, Users, Brain, Palmtree, Sparkles, Target } from 'lucide-react';
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

export function LifeGoals() {
    const [selectedArea, setSelectedArea] = useState<LifeAreaId | 'all'>('all');
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

    const filteredGoals = useMemo(() => {
        if (selectedArea === 'all') return mockLifeGoalsData.goals;
        return mockLifeGoalsData.goals.filter(g => g.areaId === selectedArea);
    }, [selectedArea]);

    const selectedGoal = useMemo(() => {
        return mockLifeGoalsData.goals.find(g => g.id === selectedGoalId) || null;
    }, [selectedGoalId]);

    const getArea = (areaId: LifeAreaId) => {
        return mockLifeGoalsData.areas.find(a => a.id === areaId);
    };

    if (selectedGoal) {
        return (
            <div className="p-4 sm:p-6 max-w-2xl mx-auto">
                <LifeGoalDetail
                    goal={selectedGoal}
                    area={getArea(selectedGoal.areaId)}
                    onBack={() => setSelectedGoalId(null)}
                />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-10 pb-32 max-w-2xl mx-auto min-h-screen bg-background">
            <LifeGoalsHeader summary={mockLifeGoalsData.summary} />

            {/* Areas Filter Scroll */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Filtro por Dimensão
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
                        <LayoutGrid className="mr-2 h-4 w-4" />
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
                                <Icon className={cn("h-4 w-4", !isActive && "text-muted-foreground")} />
                                {area.name}
                            </Button>
                        );
                    })}
                </div>
            </section>

            {/* Goals List */}
            <section className="space-y-5">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Objetivos Identitários ({filteredGoals.length})
                    </h3>
                </div>

                <div className="grid gap-3 sm:gap-4">
                    {filteredGoals.length > 0 ? (
                        filteredGoals.map((goal) => (
                            <LifeGoalCard
                                key={goal.id}
                                goal={goal}
                                area={getArea(goal.areaId)}
                                onClick={() => setSelectedGoalId(goal.id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/60">
                            <p className="text-sm text-muted-foreground font-medium">Nenhum propósito para esta dimensão.</p>
                            <Button
                                variant="link"
                                size="sm"
                                className="mt-2 text-primary"
                                onClick={() => setSelectedArea('all')}
                            >
                                Explorar todas as áreas
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
                <span className="font-bold text-xs uppercase tracking-tighter">Novo Objetivo</span>
            </Button>

            {/* Refined Footer */}
            <footer className="pt-12 text-center space-y-6">
                <div className="h-px w-8 bg-border/60 mx-auto" />
                <p className="text-[11px] text-muted-foreground italic max-w-[280px] mx-auto leading-relaxed">
                    "O que fazemos no dia a dia deve ser um eco dos nossos objetivos de vida."
                </p>
            </footer>
        </div>
    );
}
