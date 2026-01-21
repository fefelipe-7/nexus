import { useState } from 'react';
import { Button } from '@/ui/components/components/ui';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Zap,
    Brain,
    Target,
    Layout,
    Activity,
    History,
    MessageSquare,
    Sparkles,
    ShieldAlert,
    Save
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { ReviewType, PeriodicReview, ReviewBlock, AdjustmentDecision } from '../../types/reviews.types';

interface ReviewFlowProps {
    type: ReviewType;
    onCancel: () => void;
    onComplete: (review: Partial<PeriodicReview>) => void;
}

export function ReviewFlow({ type, onCancel, onComplete }: ReviewFlowProps) {
    const [step, setStep] = useState(1);
    const totalSteps = 5;

    const getStepTitle = (s: number) => {
        switch (s) {
            case 1: return 'Contexto Automático';
            case 2: return 'Leitura do Período';
            case 3: return 'Análise de Execução';
            case 4: return 'Aprendizados Extraídos';
            case 5: return 'Ajustes Decididos';
            default: return '';
        }
    };

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
        else onComplete({});
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
        else onCancel();
    };

    return (
        <div className="fixed inset-0 z-50 bg-background animate-in fade-in slide-in-from-bottom-5 duration-300 overflow-y-auto">
            <div className="p-6 max-w-2xl mx-auto min-h-screen flex flex-col">
                {/* Progress Header */}
                <header className="flex items-center justify-between mb-8">
                    <Button variant="ghost" size="sm" onClick={onCancel} className="-ml-2 text-muted-foreground">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Cancelar
                    </Button>
                    <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div
                                key={s}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-500",
                                    s === step ? "w-8 bg-foreground" :
                                        s < step ? "w-4 bg-foreground/30" : "w-1.5 bg-muted"
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest tabular-nums">
                        Passo {step}/{totalSteps}
                    </span>
                </header>

                <main className="flex-1 space-y-8 pb-32">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold leading-tight">{getStepTitle(step)}</h2>
                        <p className="text-sm text-muted-foreground">
                            {step === 1 && "Veja um resumo do que aconteceu desde sua última revisão."}
                            {step === 2 && "Como você se sente em relação ao seu progresso?"}
                            {step === 3 && "Vamos olhar para os números e padrões de execução."}
                            {step === 4 && "Transforme suas observações em conhecimento real."}
                            {step === 5 && "O que mudaremos daqui para frente?"}
                        </p>
                    </div>

                    {/* Conditional Content by Step */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-muted/20 border border-border/40">
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Ação Realizada</p>
                                    <p className="text-xl font-bold text-foreground">14 atividades</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/20 border border-border/40">
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Score Atual</p>
                                    <p className="text-xl font-bold text-emerald-500">78/100</p>
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl border border-blue-500/10 bg-blue-500/[0.02] space-y-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-blue-500" />
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Resumo da IA</p>
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed italic">
                                    "Você teve uma semana de alta produtividade nas manhãs, mas houve uma estagnação de 3 dias no projeto AWS. Suas finanças estão no ritmo planejado."
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">O que avançou de forma significativa?</label>
                                <textarea
                                    className="w-full min-h-[120px] p-4 rounded-2xl border border-border/60 bg-muted/10 text-sm focus:ring-1 focus:ring-foreground outline-none transition-all placeholder:text-muted-foreground/30"
                                    placeholder="Ex: Concluí a negociação com o banco..."
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                {['Satisfeito', 'Neutro', 'Frustrado', 'Cansado', 'Motivado'].map(tag => (
                                    <button key={tag} className="px-4 py-2 rounded-xl border border-border/40 text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap hover:bg-muted">
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step >= 3 && (
                        <div className="text-center py-12 opacity-40">
                            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Aguardando Entrada de Reflexão</p>
                            <p className="text-xs text-muted-foreground mt-1 mx-auto max-w-xs">A inteligência do sistema auxiliará na análise de padrões nestes blocos.</p>
                        </div>
                    )}
                </main>

                {/* Footer Navigation */}
                <footer className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-border/40 z-10 flex items-center justify-between">
                    <Button variant="ghost" onClick={prevStep} className="font-bold text-xs uppercase tracking-widest">
                        {step === 1 ? 'Sair' : 'Voltar'}
                    </Button>
                    <Button
                        onClick={nextStep}
                        className="h-12 px-8 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-bold text-xs uppercase tracking-tighter"
                    >
                        {step === totalSteps ? (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Finalizar Ritual
                            </>
                        ) : (
                            <>
                                Continuar
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                        )}
                    </Button>
                </footer>
            </div>
        </div>
    );
}
