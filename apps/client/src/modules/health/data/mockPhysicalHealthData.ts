import type {
  PhysicalHealthSummary,
  MovementData,
  PhysicalCapacity,
  BodyComposition,
  RecoveryData,
  PainEntry,
  PhysicalGoal,
  PhysicalTrend,
} from '../types/physical-health.types';

export const mockPhysicalHealthData = {
  summary: {
    overallStatus: 'attention',
    trend: 'down',
    physicalEnergy: 65,
    lastCheckIn: new Date(2026, 0, 27, 8, 30),
    alerts: [
      {
        id: '1',
        type: 'sedentary',
        severity: 'medium',
        message: '3 dias consecutivos sem atividade física',
        suggestion: 'Que tal uma caminhada de 20 minutos hoje?',
        date: new Date(2026, 0, 27),
      },
      {
        id: '2',
        type: 'consistency',
        severity: 'low',
        message: 'Você tinha meta de treinar 3x esta semana',
        suggestion: 'Ainda há tempo para recuperar o ritmo.',
        date: new Date(2026, 0, 26),
      },
    ],
  } as PhysicalHealthSummary,

  movement: {
    weeklyActive: 2,
    weeklyGoal: 4,
    currentStreak: 0,
    longestStreak: 12,
    weeklyVolume: {
      current: 2.5,
      average: 4.2,
      trend: 'down',
    },
    activities: [
      {
        id: '1',
        date: new Date(2026, 0, 24),
        type: 'workout',
        title: 'Treino de Força',
        duration: 60,
        intensity: 'high',
      },
      {
        id: '2',
        date: new Date(2026, 0, 22),
        type: 'walk',
        title: 'Caminhada Matinal',
        duration: 30,
        intensity: 'light',
      },
      {
        id: '3',
        date: new Date(2026, 0, 21),
        type: 'sport',
        title: 'Futebol com amigos',
        duration: 90,
        intensity: 'moderate',
      },
      {
        id: '4',
        date: new Date(2026, 0, 19),
        type: 'workout',
        title: 'Treino Funcional',
        duration: 45,
        intensity: 'moderate',
      },
    ],
  } as MovementData,

  capacity: {
    strength: {
      level: 'moderate',
      trend: 'stable',
      lastAssessment: new Date(2026, 0, 15),
    },
    endurance: {
      level: 'good',
      trend: 'up',
      lastAssessment: new Date(2026, 0, 15),
    },
    mobility: {
      level: 'moderate',
      trend: 'down',
      notes: 'Rigidez nos ombros notada',
    },
    cardiovascular: {
      level: 'good',
      trend: 'stable',
    },
  } as PhysicalCapacity,

  bodyComposition: {
    weight: {
      current: 78.5,
      unit: 'kg',
      trend: 'stable',
      history: [
        { date: new Date(2026, 0, 27), value: 78.5 },
        { date: new Date(2026, 0, 20), value: 78.8 },
        { date: new Date(2026, 0, 13), value: 79.2 },
        { date: new Date(2026, 0, 6), value: 79.0 },
        { date: new Date(2025, 11, 30), value: 78.7 },
        { date: new Date(2025, 11, 23), value: 78.5 },
      ],
    },
    measurements: {
      chest: 98,
      waist: 84,
      hips: 95,
      arms: 34,
      legs: 56,
      unit: 'cm',
    },
    bodyFat: {
      percentage: 18.5,
      trend: 'stable',
      method: 'manual',
    },
  } as BodyComposition,

  recovery: {
    status: 'recovering',
    restDays: 5,
    sleepQuality: 68,
    fatigue: 55,
    overtrainingRisk: false,
    lastRestDay: new Date(2026, 0, 27),
  } as RecoveryData,

  pain: [
    {
      id: '1',
      location: 'Ombro direito',
      intensity: 'mild',
      frequency: 'occasional',
      startDate: new Date(2026, 0, 20),
      impactOnRoutine: 'low',
      notes: 'Aparece após treinos de empurrar',
    },
  ] as PainEntry[],

  goals: [
    {
      id: '1',
      title: 'Treinar 4x por semana consistentemente',
      category: 'general',
      status: 'active',
      progress: 60,
      startDate: new Date(2026, 0, 1),
      targetDate: new Date(2026, 2, 31),
      relatedHabits: ['habit-1', 'habit-2'],
      relatedRoutines: ['routine-1'],
    },
    {
      id: '2',
      title: 'Melhorar mobilidade dos ombros',
      category: 'rehabilitation',
      status: 'active',
      progress: 35,
      startDate: new Date(2026, 0, 10),
      relatedRoutines: ['routine-2'],
    },
    {
      id: '3',
      title: 'Correr 5km sem parar',
      category: 'performance',
      status: 'active',
      progress: 70,
      startDate: new Date(2025, 11, 1),
      targetDate: new Date(2026, 1, 28),
      relatedHabits: ['habit-3'],
      relatedRoutines: [],
    },
  ] as PhysicalGoal[],

  trends: {
    period: 'month',
    movementConsistency: {
      value: 58,
      trend: 'down',
    },
    energyLevel: {
      average: 68,
      trend: 'stable',
    },
    recoveryBalance: {
      effortToRestRatio: 0.4,
      balanced: false,
    },
  } as PhysicalTrend,
};
