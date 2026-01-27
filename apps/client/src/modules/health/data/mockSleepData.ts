import { SleepData } from '../types/sleep.types';

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

// Helper to create a date with specific time
const createDateTime = (daysAgo: number, hours: number, minutes: number = 0) => {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hours, minutes, 0, 0);
    return date;
};

export const mockSleepData: SleepData = {
    lastNight: {
        id: 'sleep1',
        date: today,
        bedtime: createDateTime(0, 23, 15),
        wakeTime: createDateTime(0, 6, 45),
        duration: 7.5,
        quality: 4,
        awakenings: 1,
        timeToSleep: 15,
        feltRested: true,
        influences: ['exercise'],
        note: 'Dormi bem após o treino'
    },
    recentEntries: [
        {
            id: 'sleep2',
            date: new Date(today.getTime() - 24 * 60 * 60 * 1000),
            bedtime: createDateTime(1, 0, 30),
            wakeTime: createDateTime(1, 7, 0),
            duration: 6.5,
            quality: 3,
            awakenings: 2,
            feltRested: false,
            influences: ['caffeine', 'screen']
        },
        {
            id: 'sleep3',
            date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
            bedtime: createDateTime(2, 22, 45),
            wakeTime: createDateTime(2, 6, 30),
            duration: 7.75,
            quality: 5,
            awakenings: 0,
            feltRested: true,
            influences: ['exercise']
        }
    ],
    score: {
        overall: 78,
        components: {
            duration: 82,
            regularity: 75,
            quality: 80,
            fragmentation: 70,
            chronotypeAlignment: 85
        }
    },
    metrics: {
        averageDuration7Days: 7.2,
        averageDuration30Days: 7.0,
        averageQuality: 3.8,
        regularityScore: 75,
        averageBedtime: '23:15',
        averageWakeTime: '06:45',
        bedtimeVariability: 45
    },
    debt: {
        weeklyIdeal: 52.5, // 7.5h x 7 dias
        weeklyActual: 48.0,
        deficit: 4.5,
        recoveryDaysNeeded: 3
    },
    influences: [
        {
            factor: 'exercise',
            label: 'Exercício Físico',
            impact: 'positive',
            correlation: 85,
            description: 'Treinar até 3h antes de dormir melhora a qualidade do sono em 23%.'
        },
        {
            factor: 'caffeine',
            label: 'Cafeína após 16h',
            impact: 'negative',
            correlation: 72,
            description: 'Consumo de cafeína após 16h reduz a qualidade do sono em 18%.'
        },
        {
            factor: 'screen',
            label: 'Tela antes de dormir',
            impact: 'negative',
            correlation: 68,
            description: 'Uso de tela 1h antes de dormir aumenta o tempo para adormecer em 12 minutos.'
        }
    ],
    insights: [
        {
            id: 'ins1',
            title: 'Padrão de Regularidade Forte',
            description: 'Você mantém um horário consistente de dormir (variação de apenas 45min), o que fortalece seu ritmo circadiano.',
            type: 'behavioral',
            priority: 'medium'
        },
        {
            id: 'ins2',
            title: 'Impacto do Exercício',
            description: 'Nos últimos 30 dias, você dormiu 1h15 a mais em média nos dias com treino.',
            type: 'predictive',
            priority: 'high',
            actionable: 'Manter treinos regulares, preferencialmente até 20h'
        },
        {
            id: 'ins3',
            title: 'Atenção: Dívida de Sono Acumulada',
            description: 'Você acumulou 4h30 de dívida de sono esta semana. Isso pode afetar humor e foco.',
            type: 'alert',
            priority: 'high',
            actionable: 'Tente dormir 30min mais cedo nos próximos 3 dias'
        },
        {
            id: 'ins4',
            title: 'Educacional: Janela de Sono Ideal',
            description: 'Seu cronotipo sugere que dormir entre 22h30 e 23h30 maximiza a qualidade do sono.',
            type: 'educational',
            priority: 'low'
        }
    ],
    chronotype: 'intermediate'
};
