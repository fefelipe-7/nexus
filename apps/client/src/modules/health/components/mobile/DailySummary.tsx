import { Card, CardContent } from '@/ui/components/components/ui';
import {
    Flame,
    TrendingUp,
    Activity
} from 'lucide-react';
import { cn } from '@nexus/shared';
import { NutritionGoals, MacroNutrients } from '../../types/nutrition.types';

interface DailySummaryProps {
    totalCalories: number;
    totalMacros: MacroNutrients;
    goals: NutritionGoals;
}

export function DailySummary({ totalCalories, totalMacros, goals }: DailySummaryProps) {
    const remaining = goals.calories - totalCalories;
    const progress = (totalCalories / goals.calories) * 100;

    const getMacroProgress = (consumed: number, goal: number) => (consumed / goal) * 100;

    return (
        <div className="space-y-4">
            {/* Calories Card */}
            <Card className="border-none shadow-none bg-gradient-to-br from-orange-500/5 to-red-500/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Flame className="h-24 w-24" />
                </div>

                <CardContent className="p-6 space-y-4 relative">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Calorias</h3>
                        <div className="flex items-center gap-1">
                            <Flame className="h-3.5 w-3.5 text-orange-500" />
                            <span className="text-[9px] font-bold text-muted-foreground">{progress.toFixed(0)}%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Consumidas</p>
                            <p className="text-2xl font-black tracking-tighter tabular-nums">{totalCalories}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Meta</p>
                            <p className="text-2xl font-black tracking-tighter tabular-nums text-muted-foreground/60">{goals.calories}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Restantes</p>
                            <p className={cn(
                                "text-2xl font-black tracking-tighter tabular-nums",
                                remaining > 0 ? "text-emerald-600" : "text-rose-600"
                            )}>
                                {remaining > 0 ? remaining : 0}
                            </p>
                        </div>
                    </div>

                    <div className="h-2 bg-muted/60 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-700",
                                progress > 100 ? "bg-rose-500" : "bg-orange-500"
                            )}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Macros Card */}
            <Card className="border-border/40 shadow-none bg-background">
                <CardContent className="p-6 space-y-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5" />
                        Macronutrientes
                    </h3>

                    <div className="space-y-3">
                        {/* Carbs */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground">Carboidratos</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-foreground tabular-nums">{totalMacros.carbs.toFixed(1)}g</span>
                                    <span className="text-[9px] font-medium text-muted-foreground">/ {goals.macros.carbs.toFixed(0)}g</span>
                                </div>
                            </div>
                            <div className="h-1.5 bg-muted/60 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(getMacroProgress(totalMacros.carbs, goals.macros.carbs), 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Protein */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground">Proteínas</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-foreground tabular-nums">{totalMacros.protein.toFixed(1)}g</span>
                                    <span className="text-[9px] font-medium text-muted-foreground">/ {goals.macros.protein.toFixed(0)}g</span>
                                </div>
                            </div>
                            <div className="h-1.5 bg-muted/60 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(getMacroProgress(totalMacros.protein, goals.macros.protein), 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Fat */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground">Gorduras</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-foreground tabular-nums">{totalMacros.fat.toFixed(1)}g</span>
                                    <span className="text-[9px] font-medium text-muted-foreground">/ {goals.macros.fat.toFixed(0)}g</span>
                                </div>
                            </div>
                            <div className="h-1.5 bg-muted/60 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-amber-500 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(getMacroProgress(totalMacros.fat, goals.macros.fat), 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
