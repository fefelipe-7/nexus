import { useState } from 'react';
import { Card } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import { WeeklyPriority } from '../../types/planning.types';
import { Star, Target, Plus, X } from 'lucide-react';

interface PriorityDefinitionProps {
    priorities: WeeklyPriority[];
    onAddPriority: (name: string, isDominant: boolean) => void;
    onRemovePriority: (id: string) => void;
    onSetDominant: (id: string) => void;
}

export function PriorityDefinition({ priorities, onAddPriority, onRemovePriority, onSetDominant }: PriorityDefinitionProps) {
    const [newPriority, setNewPriority] = useState('');
    const dominant = priorities.find(p => p.isDominant);
    const secondary = priorities.filter(p => !p.isDominant);

    const handleAdd = () => {
        if (!newPriority.trim()) return;
        onAddPriority(newPriority, priorities.length === 0);
        setNewPriority('');
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center px-4">
                <h3 className="text-lg font-bold">Qual o seu foco?</h3>
                <p className="text-xs text-muted-foreground">
                    Escolha uma prioridade dominante e até 3 secundárias. Menos é mais para garantir execução real.
                </p>
            </div>

            {/* Dominant Priority */}
            <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                    Foco Dominante (Apenas 1)
                </h4>
                {dominant ? (
                    <Card className="p-4 border-l-4 border-l-amber-500 bg-amber-500/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{dominant.icon}</span>
                                <div>
                                    <p className="text-sm font-bold">{dominant.name}</p>
                                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tighter">Impacto Estratégico</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onRemovePriority(dominant.id)}
                                className="p-1 hover:bg-amber-100 rounded-full"
                            >
                                <X className="h-4 w-4 text-amber-700" />
                            </button>
                        </div>
                    </Card>
                ) : (
                    <Card className="p-8 border-dashed border-2 flex flex-col items-center justify-center text-muted-foreground">
                        <Star className="h-6 w-6 mb-2 opacity-20" />
                        <p className="text-xs">Defina o foco principal da semana</p>
                    </Card>
                )}
            </div>

            {/* Secondary Priorities */}
            <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                    Focos Secundários ({secondary.length}/3)
                </h4>
                <div className="space-y-2">
                    {secondary.map((p) => (
                        <Card key={p.id} className="p-3 bg-muted/30 border-none">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{p.icon}</span>
                                    <p className="text-sm font-medium">{p.name}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onSetDominant(p.id)}
                                        className="p-1.5 hover:bg-background rounded-lg transition-colors"
                                    >
                                        <Target className="h-3.5 w-3.5 text-muted-foreground" />
                                    </button>
                                    <button
                                        onClick={() => onRemovePriority(p.id)}
                                        className="p-1.5 hover:bg-background rounded-lg transition-colors"
                                    >
                                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {secondary.length < 3 && (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Adicionar prioridade..."
                                value={newPriority}
                                onChange={(e) => setNewPriority(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                className="flex-1 bg-muted/50 border-none rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                            <button
                                onClick={handleAdd}
                                className="p-2 bg-primary text-primary-foreground rounded-xl"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
