/**
 * Physical Health Types
 * Core types for the Physical Health submodule
 */

export type HealthStatus = 'good' | 'attention' | 'risk';
export type TrendDirection = 'up' | 'down' | 'stable';
export type MovementLevel = 'active' | 'moderate' | 'sedentary';
export type RecoveryStatus = 'recovered' | 'recovering' | 'overtraining';
export type PainIntensity = 'none' | 'mild' | 'moderate' | 'severe';

export interface PhysicalHealthSummary {
  overallStatus: HealthStatus;
  trend: TrendDirection;
  physicalEnergy: number; // 0-100
  lastCheckIn: Date;
  alerts: PhysicalAlert[];
}

export interface PhysicalAlert {
  id: string;
  type: 'sedentary' | 'overload' | 'recovery' | 'pain' | 'consistency';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion?: string;
  date: Date;
}

export interface MovementData {
  weeklyActive: number; // days
  weeklyGoal: number; // days
  currentStreak: number; // days
  longestStreak: number; // days
  weeklyVolume: {
    current: number; // hours
    average: number; // hours
    trend: TrendDirection;
  };
  activities: Activity[];
}

export interface Activity {
  id: string;
  date: Date;
  type: 'workout' | 'sport' | 'walk' | 'active-routine';
  title: string;
  duration: number; // minutes
  intensity?: 'light' | 'moderate' | 'high';
  notes?: string;
}

export interface PhysicalCapacity {
  strength: CapacityMetric;
  endurance: CapacityMetric;
  mobility: CapacityMetric;
  cardiovascular?: CapacityMetric;
}

export interface CapacityMetric {
  level: 'low' | 'moderate' | 'good' | 'excellent';
  trend: TrendDirection;
  lastAssessment?: Date;
  notes?: string;
}

export interface BodyComposition {
  weight?: {
    current: number;
    unit: 'kg' | 'lb';
    trend: TrendDirection;
    history: WeightEntry[];
  };
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    legs?: number;
    unit: 'cm' | 'in';
  };
  bodyFat?: {
    percentage: number;
    trend: TrendDirection;
    method: 'manual' | 'scale' | 'caliper';
  };
}

export interface WeightEntry {
  date: Date;
  value: number;
}

export interface RecoveryData {
  status: RecoveryStatus;
  restDays: number; // last 7 days
  sleepQuality: number; // 0-100 (integration)
  fatigue: number; // 0-100
  overtrainingRisk: boolean;
  lastRestDay?: Date;
}

export interface PainEntry {
  id: string;
  location: string;
  intensity: PainIntensity;
  frequency: 'constant' | 'frequent' | 'occasional';
  startDate: Date;
  impactOnRoutine: 'none' | 'low' | 'medium' | 'high';
  notes?: string;
  resolved?: boolean;
  resolvedDate?: Date;
}

export interface DailyCheckIn {
  date: Date;
  physicalEnergy: number; // 1-5 scale
  pain?: {
    hasPain: boolean;
    location?: string;
    intensity?: PainIntensity;
  };
  movement: {
    expected: boolean;
    completed: boolean;
    type?: string;
  };
  notes?: string;
}

export interface PhysicalGoal {
  id: string;
  title: string;
  category: 'general' | 'performance' | 'rehabilitation' | 'aesthetic' | 'longevity';
  status: 'active' | 'paused' | 'completed';
  progress: number; // 0-100
  startDate: Date;
  targetDate?: Date;
  relatedHabits: string[]; // habit IDs
  relatedRoutines: string[]; // routine IDs
}

export interface PhysicalTrend {
  period: 'week' | 'month' | 'quarter';
  movementConsistency: {
    value: number; // percentage
    trend: TrendDirection;
  };
  energyLevel: {
    average: number;
    trend: TrendDirection;
  };
  recoveryBalance: {
    effortToRestRatio: number;
    balanced: boolean;
  };
}
