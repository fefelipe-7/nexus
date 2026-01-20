import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { mockPlanningData } from '../data/mockPlanningData';
import { Button } from '@/ui/components/components/ui';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@nexus/shared';
import { PLANNING_STEPS, PlanningStepId } from '../types/planning.types';

import {
    PlanningHeader,
    PreviousWeekReview,
    PriorityDefinition,
    CapacityView,
    TimeBlockStep,
    TaskIntegrationStep,
    ConfirmationStep,
} from '../components/mobile';

export function WeeklyPlanning() {
    const { isMobile, isTablet } = useDeviceDetection();
    const isMobileView = isMobile || isTablet;

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [plan, setPlan] = useState(mockPlanningData);

    const currentStep = PLANNING_STEPS[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === PLANNING_STEPS.length - 1;

    const handleNext = () => {
        if (!isLastStep) {
            setCurrentStepIndex(currentStepIndex + 1);
            window.scrollTo(0, 0);
        } else {
            console.log('Finalizing weekly plan...', plan);
            // Here would be the submission logic
        }
    };

    const handleBack = () => {
        if (!isFirstStep) {
            setCurrentStepIndex(currentStepIndex - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleAddPriority = (name: string, isDominant: boolean) => {
        const newPriority = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            icon: isDominant ? '🌟' : '🎯',
            isDominant,
            type: 'tactical' as const,
        };

        setPlan({
            ...plan,
            priorities: [...plan.priorities, newPriority]
        });
    };

    const handleRemovePriority = (id: string) => {
        setPlan({
            ...plan,
            priorities: plan.priorities.filter(p => p.id !== id)
        });
    };

    const handleSetDominant = (id: string) => {
        setPlan({
            ...plan,
            priorities: plan.priorities.map(p => ({
                ...p,
                isDominant: p.id === id
            }))
        });
    };

    const renderStepContent = () => {
        switch (currentStep.id) {
            case 'review':
                return <PreviousWeekReview summary={plan.lastWeekSummary} />;
            case 'focus':
                return (
                    <PriorityDefinition
                        priorities={plan.priorities}
                        onAddPriority={handleAddPriority}
                        onRemovePriority={handleRemovePriority}
                        onSetDominant={handleSetDominant}
                    />
                );
            case 'capacity':
                return <CapacityView metrics={plan.metrics} />;
            case 'blocks':
                return <TimeBlockStep priorities={plan.priorities} />;
            case 'tasks':
                return <TaskIntegrationStep priorities={plan.priorities} />;
            case 'confirmation':
                return <ConfirmationStep plan={plan} />;
            default:
                return <div className="p-8 text-center text-muted-foreground">Em desenvolvimento...</div>;
        }
    };

    // On Mobile, it's a dedicated wizard
    if (isMobileView) {
        return (
            <div className="flex flex-col min-h-[calc(100vh-80px)]">
                <PlanningHeader
                    plan={plan}
                    currentStepIndex={currentStepIndex}
                    totalSteps={PLANNING_STEPS.length}
                />

                <main className="flex-1 py-6">
                    {renderStepContent()}
                </main>

                <footer className="sticky bottom-0 bg-background pt-4 pb-6 border-t border-muted flex gap-3">
                    {!isFirstStep && (
                        <Button
                            variant="outline"
                            className="px-4 border-2"
                            onClick={handleBack}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <Button
                        className={cn(
                            "flex-1 h-12 text-sm font-bold shadow-lg shadow-primary/20",
                            isLastStep ? "bg-green-600 hover:bg-green-700" : ""
                        )}
                        onClick={handleNext}
                    >
                        {isLastStep ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Confirmar Planejamento
                            </>
                        ) : (
                            <>
                                Próximo: {PLANNING_STEPS[currentStepIndex + 1].title}
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </>
                        )}
                    </Button>
                </footer>
            </div>
        );
    }

    // Desktop View (Split layout or larger wizard)
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <PlanningHeader
                    plan={plan}
                    currentStepIndex={currentStepIndex}
                    totalSteps={PLANNING_STEPS.length}
                />
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Navigation Sidebar */}
                <div className="col-span-3 space-y-2">
                    {PLANNING_STEPS.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStepIndex(index)}
                            className={cn(
                                "w-full text-left p-3 rounded-xl transition-all",
                                currentStepIndex === index
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : index < currentStepIndex
                                        ? "text-primary hover:bg-primary/5"
                                        : "text-muted-foreground hover:bg-muted/50"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold opacity-60">0{index + 1}</span>
                                <span className="text-sm font-bold">{step.title}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="col-span-9 bg-card border rounded-3xl p-8 shadow-sm min-h-[500px] flex flex-col">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold mb-2">{currentStep.title}</h2>
                        <p className="text-sm text-muted-foreground mb-8">{currentStep.description}</p>
                        {renderStepContent()}
                    </div>

                    <div className="mt-12 flex justify-between border-t pt-6">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={isFirstStep}
                        >
                            Voltar
                        </Button>
                        <Button
                            className={cn(isLastStep ? "bg-green-600 hover:bg-green-700" : "")}
                            onClick={handleNext}
                        >
                            {isLastStep ? 'Finalizar Planejamento' : 'Próximo Passo'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
