export type MoodLevel = 1 | 2 | 3 | 4 | 5; // 1=Muito ruim, 5=Muito bom
export type EmotionType =
    | 'anxious' | 'calm' | 'happy' | 'sad' | 'irritated'
    | 'motivated' | 'tired' | 'stressed' | 'confident' | 'lonely';

export type MoodContext = 'home' | 'work' | 'gym' | 'social' | 'other';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Emotion {
    type: EmotionType;
    label: string;
    icon: string;
}

export interface MoodEntry {
    id: string;
    timestamp: Date;
    moodLevel: MoodLevel;
    intensity?: number; // 0-100
    emotions: EmotionType[];
    context?: MoodContext;
    note?: string;
    timeOfDay: TimeOfDay;
}

export interface DailySummary {
    date: Date;
    averageMood: number;
    dominantEmotion?: EmotionType;
    entries: MoodEntry[];
    variability: number; // 0-100, quanto maior, mais instável
}

export interface MoodMetrics {
    averageMood7Days: number;
    averageMood30Days: number;
    emotionalStability: number; // 0-100
    positiveEmotionsPct: number;
    negativeEmotionsPct: number;
    consecutivePositiveDays: number;
    consecutiveNegativeDays: number;
}

export interface MoodCorrelation {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    strength: number; // 0-100
    description: string;
}

export interface MoodInsight {
    id: string;
    title: string;
    description: string;
    type: 'pattern' | 'correlation' | 'alert' | 'suggestion';
    priority: 'high' | 'medium' | 'low';
}

export interface MoodData {
    recentEntries: MoodEntry[];
    dailySummaries: DailySummary[];
    metrics: MoodMetrics;
    correlations: MoodCorrelation[];
    insights: MoodInsight[];
}
