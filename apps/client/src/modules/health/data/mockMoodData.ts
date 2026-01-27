import { MoodData } from '../types/mood.types';

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - (n * 24 * 60 * 60 * 1000));

export const mockMoodData: MoodData = {
    recentEntries: [
        {
            id: 'me1',
            timestamp: new Date(now.getTime() - (2 * 60 * 60 * 1000)),
            moodLevel: 4,
            intensity: 75,
            emotions: ['calm', 'motivated'],
            context: 'work',
            timeOfDay: 'afternoon'
        },
        {
            id: 'me2',
            timestamp: new Date(now.getTime() - (8 * 60 * 60 * 1000)),
            moodLevel: 5,
            intensity: 90,
            emotions: ['happy', 'confident'],
            context: 'gym',
            note: 'Treino excelente hoje!',
            timeOfDay: 'morning'
        }
    ],
    dailySummaries: [
        {
            date: now,
            averageMood: 4.5,
            dominantEmotion: 'motivated',
            entries: [],
            variability: 15
        },
        {
            date: daysAgo(1),
            averageMood: 3.2,
            dominantEmotion: 'tired',
            entries: [],
            variability: 35
        },
        {
            date: daysAgo(2),
            averageMood: 4.0,
            dominantEmotion: 'calm',
            entries: [],
            variability: 20
        }
    ],
    metrics: {
        averageMood7Days: 3.8,
        averageMood30Days: 3.6,
        emotionalStability: 72,
        positiveEmotionsPct: 65,
        negativeEmotionsPct: 35,
        consecutivePositiveDays: 3,
        consecutiveNegativeDays: 0
    },
    correlations: [
        {
            factor: 'Treino matinal',
            impact: 'positive',
            strength: 85,
            description: 'Dias com treino pela manhã mostram humor 23% mais elevado.'
        },
        {
            factor: 'Sono < 6h',
            impact: 'negative',
            strength: 78,
            description: 'Noites com menos de 6h de sono reduzem o humor médio em 18%.'
        },
        {
            factor: 'Trabalho em projetos criativos',
            impact: 'positive',
            strength: 65,
            description: 'Emoções positivas aumentam 15% durante projetos criativos.'
        }
    ],
    insights: [
        {
            id: 'ins1',
            title: 'Padrão de Energia Matinal',
            description: 'Seu humor tende a ser 30% melhor nas manhãs em que você acorda antes das 7h.',
            type: 'pattern',
            priority: 'medium'
        },
        {
            id: 'ins2',
            title: 'Impacto do Exercício',
            description: 'Nos últimos 30 dias, 85% dos seus melhores dias incluíram atividade física.',
            type: 'correlation',
            priority: 'high'
        },
        {
            id: 'ins3',
            title: 'Atenção: Variação Emocional',
            description: 'Você teve 3 dias com oscilações emocionais significativas na última semana. Considere técnicas de regulação emocional.',
            type: 'alert',
            priority: 'high'
        },
        {
            id: 'ins4',
            title: 'Sugestão: Pausa Consciente',
            description: 'Experimente adicionar uma pausa de 5 minutos para respiração após o almoço.',
            type: 'suggestion',
            priority: 'low'
        }
    ]
};
