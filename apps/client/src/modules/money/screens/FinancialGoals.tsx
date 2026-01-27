import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useFinancialGoals } from '@/hooks/data/useFinancialGoals';
import { FAB } from '@/ui/layouts/MobileLayout/FAB';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';

import { FinancialGoalWizard } from '../components/wizards/FinancialGoalWizard';
import { EmptyFinancialGoals } from '../components/empty-states/EmptyFinancialGoals';

export function FinancialGoals() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const { goals, isLoading, error, addGoal, refresh } = useFinancialGoals();
    const [showWizard, setShowWizard] = useState(false);

    const handleAddGoal = () => {
        setShowWizard(true);
    };

    const handleWizardComplete = async (goalData: any) => {
        await addGoal(goalData);
        setShowWizard(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                <p className="text-rose-600 mb-4">Erro ao carregar metas: {error.message}</p>
                <Button onClick={refresh}>Tentar Novamente</Button>
            </div>
        );
    }

    if (goals.length === 0) {
        return (
            <>
                <EmptyFinancialGoals onAddGoal={handleAddGoal} />
                {showWizard && (
                    <FinancialGoalWizard
                        onComplete={handleWizardComplete}
                        onCancel={() => setShowWizard(false)}
                    />
                )}
            </>
        );
    }

    const GoalsList = () => (
        <div className="space-y-4">
            {goals.map((goal) => {
                const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                return (
                    <div key={goal.id} className="p-5 rounded-2xl border border-border bg-background space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold">{goal.name}</h3>
                                <p className="text-xs text-muted-foreground">Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide ${goal.priority === 'high' ? 'bg-rose-500/10 text-rose-600' :
                                    goal.priority === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                                        'bg-blue-500/10 text-blue-600'
                                }`}>
                                {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Média' : 'Baixa'}
                            </span>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-emerald-600">R$ {goal.current_amount}</span>
                                <span className="text-muted-foreground">de R$ {goal.target_amount}</span>
                            </div>
                            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    if (isMobileView) {
        return (
            <>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight mb-1">Metas Financeiras</h1>
                        <p className="text-sm text-muted-foreground">
                            Planeje suas conquistas
                        </p>
                    </div>

                    <GoalsList />

                    <FAB
                        onClick={handleAddGoal}
                        icon={Plus}
                        label="Nova Meta"
                    />
                </div>

                {showWizard && (
                    <FinancialGoalWizard
                        onComplete={handleWizardComplete}
                        onCancel={() => setShowWizard(false)}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Metas Financeiras</h1>
                        <p className="text-muted-foreground">
                            Acompanhe o progresso dos seus objetivos
                        </p>
                    </div>
                    <Button size="sm" onClick={handleAddGoal}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Meta
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GoalsList />
                </div>
            </div>

            {showWizard && (
                <FinancialGoalWizard
                    onComplete={handleWizardComplete}
                    onCancel={() => setShowWizard(false)}
                />
            )}
        </>
    );
}
