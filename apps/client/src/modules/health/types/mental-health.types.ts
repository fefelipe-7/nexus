/**
 * Mental Health Types
 * Core types for the Mental Health submodule
 */

export type MentalStatus = 'stable' | 'attention' | 'overload';
export type TrendDirection = 'up' | 'down' | 'stable';
export type MoodLevel = 'very-low' | 'low' | 'neutral' | 'good' | 'very-good';
export type StressLevel = 'low' | 'moderate' | 'high' | 'critical';
export type ClarityLevel = 'foggy' | 'unclear' | 'clear' | 'sharp';

export interface MentalHealthSummary {
  overallStatus: MentalStatus;
  trend: TrendDirection;
  lastCheckIn: Date;
  alerts: MentalAlert[];
  indicators: {
    averageMood: number; // 0-100
    stressLevel: number; // 0-100
    mentalClarity: number; // 0-100
    emotionalEnergy: number; // 0-100
  };
}

export interface MentalAlert {
  id: string;
  type: 'stress' | 'energy-drop' | 'overload' | 'pattern' | 'burnout-risk';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion?: string;
  date: Date;
}

export interface MoodEntry {
  id: string;
  date: Date;
  mood: MoodLevel;
  emotionName?: string;
  intensity: number; // 1-10
  triggers?: string[];
  duration?: 'brief' | 'hours' | 'day' | 'ongoing';
  notes?: string;
}

export interface StressData {
  currentLevel: StressLevel;
  perceivedOverload: number; // 0-100
  sources: StressSource[];
  trend: TrendDirection;
  weeklyAverage: number;
}

export interface StressSource {
  id: string;
  category: 'deadlines' | 'decisions' | 'conflicts' | 'workload' | 'uncertainty' | 'other';
  description: string;
  intensity: number; // 1-10
  duration: 'acute' | 'chronic';
  relatedDomain?: string; // money, time, goals, etc
}

export interface MentalClarityData {
  level: ClarityLevel;
  focusCapacity: number; // 0-100
  mentalNoise: number; // 0-100
  decisionEase: number; // 0-100
  trend: TrendDirection;
}

export interface EmotionalEnergyData {
  level: number; // 0-100
  motivation: number; // 0-100
  emotionalDisposition: number; // 0-100
  burnoutRisk: boolean;
  trend: TrendDirection;
  factors: {
    physical: number; // influence from physical health
    sleep: number; // influence from sleep
    relationships: number; // influence from social
    routine: number; // influence from daily routine
  };
}

export interface ResilienceData {
  recoveryCapacity: 'low' | 'moderate' | 'good' | 'excellent';
  averageRecoveryTime: number; // days
  copingStrategies: CopingStrategy[];
  recentPatterns: string[];
}

export interface CopingStrategy {
  id: string;
  name: string;
  effectiveness: 'low' | 'moderate' | 'high';
  frequency: 'rarely' | 'sometimes' | 'often';
  lastUsed?: Date;
}

export interface DailyCheckIn {
  date: Date;
  howAreYou: {
    feeling: string;
    intensity: number; // 1-5
  };
  drainers?: string[];
  strengtheners?: string[];
  notes?: string;
}

export interface EmotionalPattern {
  id: string;
  type: 'recurring-mood' | 'stress-cycle' | 'energy-pattern' | 'trigger-response';
  description: string;
  frequency: string;
  impact: 'low' | 'moderate' | 'high';
  relatedEvents?: string[];
  relatedDomains?: string[];
  firstDetected: Date;
}

export interface MentalGoalImpact {
  goalId: string;
  goalTitle: string;
  emotionalWeight: 'light' | 'moderate' | 'heavy' | 'overwhelming';
  impact: 'positive' | 'neutral' | 'draining';
  adjustmentNeeded: boolean;
  suggestion?: string;
}

export interface MentalTrend {
  period: 'week' | 'month' | 'quarter';
  moodProgression: {
    average: number;
    trend: TrendDirection;
    volatility: 'low' | 'moderate' | 'high';
  };
  stressProgression: {
    average: number;
    trend: TrendDirection;
    peaks: Date[];
  };
  clarityProgression: {
    average: number;
    trend: TrendDirection;
  };
  correlations: {
    withWorkload: number; // -1 to 1
    withRest: number; // -1 to 1
    withEvents: string[];
  };
}

export interface AISuggestion {
  id: string;
  type: 'workload-reduction' | 'planning-adjustment' | 'break-insertion' | 'habit-reinforcement' | 'early-review';
  priority: 'low' | 'medium' | 'high';
  message: string;
  reasoning: string;
  actionable: boolean;
  actionText?: string;
  date: Date;
}
