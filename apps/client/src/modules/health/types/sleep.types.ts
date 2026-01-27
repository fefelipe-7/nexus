export type SleepQuality = 1 | 2 | 3 | 4 | 5; // 1=Muito ruim, 5=Excelente
export type Chronotype = 'morning' | 'evening' | 'intermediate';
export type InfluenceFactor = 'caffeine' | 'alcohol' | 'exercise' | 'screen' | 'stress' | 'late_meal';

export interface SleepEntry {
    id: string;
    date: Date;
    bedtime: Date;
    wakeTime: Date;
    duration: number; // em horas
    quality: SleepQuality;
    awakenings?: number;
    timeToSleep?: number; // minutos
    feltRested: boolean;
    influences?: InfluenceFactor[];
    note?: string;
}

export interface SleepScore {
    overall: number; // 0-100
    components: {
        duration: number; // 0-100
        regularity: number; // 0-100
        quality: number; // 0-100
        fragmentation: number; // 0-100
        chronotypeAlignment: number; // 0-100
    };
}

export interface SleepMetrics {
    averageDuration7Days: number;
    averageDuration30Days: number;
    averageQuality: number;
    regularityScore: number; // 0-100
    averageBedtime: string; // HH:mm
    averageWakeTime: string; // HH:mm
    bedtimeVariability: number; // em minutos
}

export interface SleepDebt {
    weeklyIdeal: number; // horas
    weeklyActual: number; // horas
    deficit: number; // horas
    recoveryDaysNeeded: number;
}

export interface SleepInfluence {
    factor: InfluenceFactor;
    label: string;
    impact: 'positive' | 'negative' | 'neutral';
    correlation: number; // 0-100
    description: string;
}

export interface SleepInsight {
    id: string;
    title: string;
    description: string;
    type: 'behavioral' | 'predictive' | 'educational' | 'alert';
    priority: 'high' | 'medium' | 'low';
    actionable?: string;
}

export interface SleepData {
    recentEntries: SleepEntry[];
    lastNight?: SleepEntry;
    score: SleepScore;
    metrics: SleepMetrics;
    debt: SleepDebt;
    influences: SleepInfluence[];
    insights: SleepInsight[];
    chronotype: Chronotype;
}
