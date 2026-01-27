import { useState, ReactNode } from 'react';
import { Button } from '@/ui/components/components/ui';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@nexus/shared';

export interface WizardStepProps<T = any> {
    data: T;
    updateData: (updates: Partial<T>) => void;
    goNext: () => void;
    goPrevious: () => void;
}

export interface WizardStep<T = any> {
    id: string;
    title: string;
    description?: string;
    component: React.ComponentType<WizardStepProps<T>>;
    validate?: (data: T) => { isValid: boolean; error?: string };
}

interface WizardBaseProps<T> {
    title: string;
    steps: WizardStep<T>[];
    initialData: T;
    onComplete: (data: T) => Promise<void>;
    onCancel: () => void;
}

export function WizardBase<T>({
    title,
    steps,
    initialData,
    onComplete,
    onCancel
}: WizardBaseProps<T>) {
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState<T>(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    const step = steps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;
    const progress = ((currentStep + 1) / steps.length) * 100;

    const updateData = (updates: Partial<T>) => {
        setData(prev => ({ ...prev, ...updates }));
        setError('');
    };

    const goNext = () => {
        // Validate current step
        if (step.validate) {
            const validation = step.validate(data);
            if (!validation.isValid) {
                setError(validation.error || 'Por favor, preencha todos os campos obrigatórios');
                return;
            }
        }

        setError('');

        if (isLastStep) {
            handleComplete();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const goPrevious = () => {
        if (!isFirstStep) {
            setCurrentStep(prev => prev - 1);
            setError('');
        }
    };

    const handleComplete = async () => {
        try {
            setIsSubmitting(true);
            setError('');
            await onComplete(data);
        } catch (err) {
            setError('Erro ao salvar. Tente novamente.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const StepComponent = step.component;

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold">{title}</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Passo {currentStep + 1} de {steps.length}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onCancel} disabled={isSubmitting}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-foreground transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-foreground">{step.title}</p>
                            <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
                        </div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {step.description && (
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                        )}

                        <StepComponent
                            data={data}
                            updateData={updateData}
                            goNext={goNext}
                            goPrevious={goPrevious}
                        />

                        {error && (
                            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                <p className="text-sm text-rose-600">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border">
                    <div className="flex items-center justify-between gap-3">
                        <Button
                            variant="outline"
                            onClick={goPrevious}
                            disabled={isFirstStep || isSubmitting}
                            className="gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Voltar
                        </Button>

                        <div className="flex gap-2">
                            {steps.map((s, index) => (
                                <div
                                    key={s.id}
                                    className={cn(
                                        "h-2 w-2 rounded-full transition-all",
                                        index === currentStep
                                            ? "bg-foreground w-6"
                                            : index < currentStep
                                                ? "bg-foreground/60"
                                                : "bg-muted"
                                    )}
                                />
                            ))}
                        </div>

                        <Button
                            onClick={goNext}
                            disabled={isSubmitting}
                            className="gap-2"
                        >
                            {isLastStep ? (
                                isSubmitting ? 'Salvando...' : 'Concluir'
                            ) : (
                                <>
                                    Próximo
                                    <ChevronRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
