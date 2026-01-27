import { DailyNutrition } from '../types/nutrition.types';

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const createTime = (hours: number, minutes: number = 0) => {
    const time = new Date(today);
    time.setHours(hours, minutes, 0, 0);
    return time;
};

export const mockNutritionData: DailyNutrition = {
    date: today,
    meals: [
        {
            id: 'meal1',
            type: 'breakfast',
            time: createTime(7, 30),
            foods: [
                {
                    id: 'food1',
                    name: 'Aveia',
                    quantity: 50,
                    unit: 'g',
                    calories: 190,
                    macros: { carbs: 34, protein: 7, fat: 3.5 }
                },
                {
                    id: 'food2',
                    name: 'Banana',
                    quantity: 1,
                    unit: 'unidade',
                    calories: 105,
                    macros: { carbs: 27, protein: 1.3, fat: 0.4 }
                },
                {
                    id: 'food3',
                    name: 'Leite Desnatado',
                    quantity: 200,
                    unit: 'ml',
                    calories: 68,
                    macros: { carbs: 10, protein: 6.8, fat: 0.2 }
                }
            ],
            totalCalories: 363,
            totalMacros: { carbs: 71, protein: 15.1, fat: 4.1 }
        },
        {
            id: 'meal2',
            type: 'lunch',
            time: createTime(12, 45),
            foods: [
                {
                    id: 'food4',
                    name: 'Arroz Integral',
                    quantity: 150,
                    unit: 'g',
                    calories: 195,
                    macros: { carbs: 41, protein: 4.5, fat: 1.5 }
                },
                {
                    id: 'food5',
                    name: 'Frango Grelhado',
                    quantity: 150,
                    unit: 'g',
                    calories: 248,
                    macros: { carbs: 0, protein: 46.5, fat: 5.4 }
                },
                {
                    id: 'food6',
                    name: 'Brócolis',
                    quantity: 100,
                    unit: 'g',
                    calories: 34,
                    macros: { carbs: 7, protein: 2.8, fat: 0.4 }
                }
            ],
            totalCalories: 477,
            totalMacros: { carbs: 48, protein: 53.8, fat: 7.3 },
            note: 'Almoço pós-treino'
        },
        {
            id: 'meal3',
            type: 'snack',
            time: createTime(16, 0),
            foods: [
                {
                    id: 'food7',
                    name: 'Iogurte Grego',
                    quantity: 150,
                    unit: 'g',
                    calories: 97,
                    macros: { carbs: 3.6, protein: 15, fat: 2.4 }
                }
            ],
            totalCalories: 97,
            totalMacros: { carbs: 3.6, protein: 15, fat: 2.4 }
        }
    ],
    totalCalories: 937,
    totalMacros: { carbs: 122.6, protein: 83.9, fat: 13.8 },
    water: {
        consumed: 1800,
        goal: 2500,
        entries: [
            { time: createTime(7, 0), amount: 300 },
            { time: createTime(10, 30), amount: 500 },
            { time: createTime(13, 0), amount: 500 },
            { time: createTime(15, 30), amount: 500 }
        ]
    },
    goals: {
        calories: 2200,
        macros: { carbs: 247.5, protein: 165, fat: 73.3 },
        macrosPercentage: { carbs: 45, protein: 30, fat: 25 },
        water: 2500,
        specificGoals: {
            minProtein: 150,
            maxSugar: 50,
            maxSodium: 2300,
            minFiber: 25
        }
    },
    insights: [
        {
            id: 'ins1',
            title: 'Proteína Acima da Meta',
            description: 'Você já consumiu 84g de proteína, ultrapassando 50% da meta diária antes do jantar.',
            type: 'pattern',
            priority: 'medium'
        },
        {
            id: 'ins2',
            title: 'Hidratação Abaixo do Ideal',
            description: 'Você está 28% abaixo da meta de água. Considere beber mais 700ml até o final do dia.',
            type: 'alert',
            priority: 'high',
            actionable: 'Beber 2 copos de água nas próximas 2 horas'
        },
        {
            id: 'ins3',
            title: 'Distribuição Equilibrada',
            description: 'Suas refeições estão bem distribuídas ao longo do dia, evitando picos calóricos.',
            type: 'pattern',
            priority: 'low'
        },
        {
            id: 'ins4',
            title: 'Correlação: Treino e Proteína',
            description: 'Nos dias de treino, você consome em média 15% mais proteína, o que é ideal para recuperação.',
            type: 'correlation',
            priority: 'medium'
        }
    ]
};
