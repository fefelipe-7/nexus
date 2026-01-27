import type {
  MentalHealthSummary,
  MoodEntry,
  StressData,
  MentalClarityData,
  EmotionalEnergyData,
  ResilienceData,
  EmotionalPattern,
  MentalGoalImpact,
  MentalTrend,
  AISuggestion,
} from '../types/mental-health.types';

export const mockMentalHealthData = {
  summary: {
    overallStatus: 'attention',
    trend: 'down',
    lastCheckIn: new Date(2026, 0, 27, 9, 15),
    alerts: [
      {
        id: '1',
        type: 'stress',
        severity: 'medium',
        message: 'Nível de estresse elevado nos últimos 5 dias',
        suggestion: 'Considere revisar suas pendências e redistribuir carga',
        date: new Date(2026, 0, 27),
      },
      {
        id: '2',
        type: 'pattern',
        severity: 'low',
        message: 'Padrão de baixa energia emocional às segundas',
        suggestion: 'Evite agendar tarefas pesadas no início da semana',
        date: new Date(2026, 0, 26),
      },
    ],
    indicators: {
      averageMood: 62,
      stressLevel: 68,
      mentalClarity: 58,
      emotionalEnergy: 54,
    },
  } as MentalHealthSummary,

  moods: [
    {
      id: '1',
      date: new Date(2026, 0, 27, 9, 0),
      mood: 'neutral',
      emotionName: 'Ansioso',
      intensity: 6,
      triggers: ['Reunião importante', 'Prazo próximo'],
      duration: 'hours',
      notes: 'Preocupado com apresentação',
    },
    {
      id: '2',
      date: new Date(2026, 0, 26, 18, 30),
      mood: 'low',
      emotionName: 'Cansado',
      intensity: 7,
      triggers: ['Dia longo', 'Muitas decisões'],
      duration: 'day',
    },
    {
      id: '3',
      date: new Date(2026, 0, 25, 14, 0),
      mood: 'good',
      emotionName: 'Motivado',
      intensity: 7,
      triggers: ['Progresso em projeto'],
      duration: 'hours',
    },
    {
      id: '4',
      date: new Date(2026, 0, 24, 10, 0),
      mood: 'neutral',
      intensity: 5,
      duration: 'day',
    },
  ] as MoodEntry[],

  stress: {
    currentLevel: 'high',
    perceivedOverload: 72,
    trend: 'up',
    weeklyAverage: 65,
    sources: [
      {
        id: '1',
        category: 'deadlines',
        description: 'Entrega de projeto importante',
        intensity: 8,
        duration: 'acute',
        relatedDomain: 'work-study',
      },
      {
        id: '2',
        category: 'decisions',
        description: 'Múltiplas decisões financeiras pendentes',
        intensity: 6,
        duration: 'chronic',
        relatedDomain: 'money',
      },
      {
        id: '3',
        category: 'workload',
        description: 'Acúmulo de tarefas da semana',
        intensity: 7,
        duration: 'acute',
        relatedDomain: 'time',
      },
    ],
  } as StressData,

  clarity: {
    level: 'unclear',
    focusCapacity: 58,
    mentalNoise: 65,
    decisionEase: 52,
    trend: 'down',
  } as MentalClarityData,

  emotionalEnergy: {
    level: 54,
    motivation: 60,
    emotionalDisposition: 50,
    burnoutRisk: false,
    trend: 'down',
    factors: {
      physical: 65,
      sleep: 48,
      relationships: 70,
      routine: 55,
    },
  } as EmotionalEnergyData,

  resilience: {
    recoveryCapacity: 'moderate',
    averageRecoveryTime: 2,
    copingStrategies: [
      {
        id: '1',
        name: 'Caminhada ao ar livre',
        effectiveness: 'high',
        frequency: 'often',
        lastUsed: new Date(2026, 0, 25),
      },
      {
        id: '2',
        name: 'Conversar com amigos',
        effectiveness: 'high',
        frequency: 'sometimes',
        lastUsed: new Date(2026, 0, 20),
      },
      {
        id: '3',
        name: 'Reduzir estímulos digitais',
        effectiveness: 'moderate',
        frequency: 'rarely',
        lastUsed: new Date(2026, 0, 15),
      },
    ],
    recentPatterns: [
      'Recuperação mais rápida quando pratica exercício',
      'Dificuldade de regular após semanas intensas',
    ],
  } as ResilienceData,

  patterns: [
    {
      id: '1',
      type: 'energy-pattern',
      description: 'Baixa energia emocional às segundas-feiras',
      frequency: 'Semanal',
      impact: 'moderate',
      relatedEvents: ['Fim de semana', 'Início da semana'],
      firstDetected: new Date(2026, 0, 1),
    },
    {
      id: '2',
      type: 'stress-cycle',
      description: 'Picos de estresse antes de reuniões importantes',
      frequency: 'Ocasional',
      impact: 'moderate',
      relatedDomains: ['work-study'],
      firstDetected: new Date(2025, 11, 15),
    },
  ] as EmotionalPattern[],

  goalImpacts: [
    {
      goalId: '1',
      goalTitle: 'Concluir certificação profissional',
      emotionalWeight: 'heavy',
      impact: 'draining',
      adjustmentNeeded: true,
      suggestion: 'Considere estender o prazo ou reduzir escopo',
    },
    {
      goalId: '2',
      goalTitle: 'Melhorar saúde física',
      emotionalWeight: 'moderate',
      impact: 'positive',
      adjustmentNeeded: false,
    },
    {
      goalId: '3',
      goalTitle: 'Organizar finanças',
      emotionalWeight: 'moderate',
      impact: 'neutral',
      adjustmentNeeded: false,
    },
  ] as MentalGoalImpact[],

  trends: {
    period: 'month',
    moodProgression: {
      average: 62,
      trend: 'down',
      volatility: 'moderate',
    },
    stressProgression: {
      average: 65,
      trend: 'up',
      peaks: [
        new Date(2026, 0, 27),
        new Date(2026, 0, 20),
        new Date(2026, 0, 13),
      ],
    },
    clarityProgression: {
      average: 58,
      trend: 'down',
    },
    correlations: {
      withWorkload: -0.72,
      withRest: 0.65,
      withEvents: ['Prazos importantes', 'Reuniões'],
    },
  } as MentalTrend,

  aiSuggestions: [
    {
      id: '1',
      type: 'workload-reduction',
      priority: 'high',
      message: 'Sua carga está afetando clareza mental',
      reasoning: 'Detectamos queda de 15% na clareza mental correlacionada com aumento de 40% na carga de trabalho',
      actionable: true,
      actionText: 'Revisar pendências críticas',
      date: new Date(2026, 0, 27),
    },
    {
      id: '2',
      type: 'break-insertion',
      priority: 'medium',
      message: 'Pausas regulares podem ajudar sua regulação',
      reasoning: 'Você apresenta melhor recuperação emocional em dias com pausas estratégicas',
      actionable: true,
      actionText: 'Adicionar pausas de 15min',
      date: new Date(2026, 0, 26),
    },
  ] as AISuggestion[],
};
