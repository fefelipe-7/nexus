import { Button } from '@/ui/components/components/ui';
import {
    Plus,
    Calendar,
    Settings2,
    UtensilsCrossed
} from 'lucide-react';

interface NutritionHeaderProps {
    onAddMeal: () => void;
    date: Date;
}

export function NutritionHeader({ onAddMeal, date }: NutritionHeaderProps) {
    return (
        <div className="space-y-6">
            <div className="px-1 flex items-start justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Alimentação
                    </h1>
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                        <UtensilsCrossed className="h-3.5 w-3.5" />
                        {date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Settings2 className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex gap-3">
                <Button
                    onClick={onAddMeal}
                    className="flex-1 h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-bold text-xs uppercase tracking-tighter shadow-lg shadow-foreground/5"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Refeição
                </Button>
                <Button
                    variant="outline"
                    className="px-5 h-12 rounded-2xl border-border/60 font-bold text-xs uppercase tracking-tighter"
                >
                    <Calendar className="h-4 w-4 mr-2" />
                    Histórico
                </Button>
            </div>
        </div>
    );
}
