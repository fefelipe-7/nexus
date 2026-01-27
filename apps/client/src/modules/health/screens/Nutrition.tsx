import { useState } from 'react';
import { NutritionHeader } from '../components/mobile/NutritionHeader';
import { DailySummary } from '../components/mobile/DailySummary';
import { MealTimeline } from '../components/mobile/MealTimeline';
import { WaterTracker } from '../components/mobile/WaterTracker';
import { NutritionInsights } from '../components/mobile/NutritionInsights';
import { mockNutritionData } from '../data/mockNutritionData';
import { UtensilsCrossed } from 'lucide-react';

export function Nutrition() {
    const [waterConsumed, setWaterConsumed] = useState(mockNutritionData.water.consumed);

    const handleAddWater = (amount: number) => {
        setWaterConsumed(prev => prev + amount);
        console.log(`Added ${amount}ml of water`);
    };

    const handleAddMeal = () => {
        console.log('Opening meal registration modal');
    };

    return (
        <div className="p-4 sm:p-6 space-y-12 pb-32 max-w-2xl mx-auto min-h-screen bg-background">
            <NutritionHeader
                onAddMeal={handleAddMeal}
                date={mockNutritionData.date}
            />

            <section>
                <DailySummary
                    totalCalories={mockNutritionData.totalCalories}
                    totalMacros={mockNutritionData.totalMacros}
                    goals={mockNutritionData.goals}
                />
            </section>

            <section className="pt-4 border-t border-border/40">
                <MealTimeline meals={mockNutritionData.meals} />
            </section>

            <section className="pt-4 border-t border-border/40">
                <WaterTracker
                    water={{ ...mockNutritionData.water, consumed: waterConsumed }}
                    onAddWater={handleAddWater}
                />
            </section>

            <section className="pt-4 border-t border-border/40">
                <NutritionInsights insights={mockNutritionData.insights} />
            </section>

            {/* Philosophy Footer */}
            <footer className="pt-12 text-center space-y-6 border-t border-border/40">
                <div className="inline-flex p-3 rounded-2xl bg-muted/30 border border-border/40">
                    <UtensilsCrossed className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <div className="max-w-[320px] mx-auto space-y-3">
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed italic px-4">
                        "Alimentação consciente não é sobre restrição, é sobre entender como o que você come afeta quem você é."
                    </p>
                </div>
            </footer>
        </div>
    );
}
