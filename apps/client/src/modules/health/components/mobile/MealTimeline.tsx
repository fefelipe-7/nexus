import { Card, CardContent } from '@/ui/components/components/ui';
import {
    Coffee,
    Sun,
    Moon,
    Apple,
    MoreVertical,
    Star
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { Meal } from '../../types/nutrition.types';

interface MealTimelineProps {
    meals: Meal[];
}

const MEAL_ICONS = {
    breakfast: Coffee,
    lunch: Sun,
    dinner: Moon,
    snack: Apple,
    custom: Apple
};

const MEAL_LABELS = {
    breakfast: 'Café da Manhã',
    lunch: 'Almoço',
    dinner: 'Jantar',
    snack: 'Lanche',
    custom: 'Personalizada'
};

export function MealTimeline({ meals }: MealTimelineProps) {
    if (meals.length === 0) {
        return (
            <Card className="border-border/40 shadow-none bg-muted/10">
                <CardContent className="p-6 text-center">
                    <Apple className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">Nenhuma refeição registrada hoje</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="px-1">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Refeições do Dia
                </h3>
            </div>

            <div className="space-y-3">
                {meals.map((meal) => {
                    const Icon = MEAL_ICONS[meal.type];
                    const label = meal.customName || MEAL_LABELS[meal.type];

                    return (
                        <Card key={meal.id} className="border-border/40 shadow-none bg-background">
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-muted/50">
                                            <Icon className="h-4 w-4 text-foreground" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className="text-sm font-bold text-foreground">{label}</h4>
                                            <p className="text-[10px] font-medium text-muted-foreground">
                                                {meal.time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {meal.isFavorite && (
                                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                        )}
                                        <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-3">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Calorias</p>
                                        <p className="text-lg font-black tracking-tighter tabular-nums">{meal.totalCalories}</p>
                                    </div>

                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Carbs</p>
                                        <p className="text-lg font-black tracking-tighter tabular-nums text-blue-600">{meal.totalMacros.carbs.toFixed(0)}g</p>
                                    </div>

                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Prot</p>
                                        <p className="text-lg font-black tracking-tighter tabular-nums text-emerald-600">{meal.totalMacros.protein.toFixed(0)}g</p>
                                    </div>

                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Gord</p>
                                        <p className="text-lg font-black tracking-tighter tabular-nums text-amber-600">{meal.totalMacros.fat.toFixed(0)}g</p>
                                    </div>
                                </div>

                                {meal.note && (
                                    <p className="text-xs text-muted-foreground italic leading-relaxed pt-2 border-t border-border/20">
                                        "{meal.note}"
                                    </p>
                                )}

                                <div className="pt-2 border-t border-border/20">
                                    <p className="text-[10px] font-medium text-muted-foreground">
                                        {meal.foods.length} {meal.foods.length === 1 ? 'item' : 'itens'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
