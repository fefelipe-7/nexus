import { Button } from '@/ui/components/components/ui';
import { Target, Plus } from 'lucide-react';

interface EmptyFinancialGoalsProps {
    onAddGoal: () => void;
}

export function EmptyFinancialGoals({ onAddGoal }: EmptyFinancialGoalsProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <div className="mb-6 p-6 rounded-full bg-muted/30">
                <Target className="h-16 w-16 text-muted-foreground/40" />
            </div>

            <h2 className="text-2xl font-bold mb-2">
                Realize seus sonhos
            </h2>

            <p className="text-muted-foreground mb-8 max-w-md">
                Defina metas financeiras claras, estabeleça prazos e acompanhe seu progresso até a conquista.
            </p>

            <Button onClick={onAddGoal} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Nova Meta
            </Button>
        </div>
    );
}
