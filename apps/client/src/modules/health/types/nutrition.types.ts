export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'custom';

export interface MacroNutrients {
    carbs: number; // gramas
    protein: number; // gramas
    fat: number; // gramas
}

export interface MicroNutrients {
    fiber?: number; // gramas
    sugar?: number; // gramas
    sodium?: number; // mg
    calcium?: number; // mg
    iron?: number; // mg
    vitaminC?: number; // mg
}

export interface FoodItem {
    id: string;
    name: string;
    quantity: number;
    unit: string; // g, ml, unidade, colher, fatia
    calories: number;
    macros: MacroNutrients;
    micros?: MicroNutrients;
}

export interface Meal {
    id: string;
    type: MealType;
    customName?: string;
    time: Date;
    foods: FoodItem[];
    totalCalories: number;
    totalMacros: MacroNutrients;
    isFavorite?: boolean;
    note?: string;
}

export interface NutritionGoals {
    calories: number;
    macros: MacroNutrients;
    macrosPercentage: {
        carbs: number; // 0-100
        protein: number; // 0-100
        fat: number; // 0-100
    };
    water: number; // ml
    specificGoals?: {
        minProtein?: number;
        maxSugar?: number;
        maxSodium?: number;
        minFiber?: number;
    };
}

export interface WaterIntake {
    consumed: number; // ml
    goal: number; // ml
    entries: Array<{
        time: Date;
        amount: number; // ml
    }>;
}

export interface NutritionInsight {
    id: string;
    title: string;
    description: string;
    type: 'pattern' | 'alert' | 'recommendation' | 'correlation';
    priority: 'high' | 'medium' | 'low';
    actionable?: string;
}

export interface DailyNutrition {
    date: Date;
    meals: Meal[];
    totalCalories: number;
    totalMacros: MacroNutrients;
    water: WaterIntake;
    goals: NutritionGoals;
    insights: NutritionInsight[];
}
