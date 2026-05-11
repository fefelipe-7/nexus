export type Module = 'vida' | 'mente' | 'saude' | 'acao' | 'financa';

export type CardType = 'metric' | 'action' | 'summary' | 'module' | 'quick-action';

export type MetricCard = {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down';
  icon?: string;
  color?: string;
};

export type ActionCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
};

export type SummaryCard = {
  id: string;
  title: string;
  content: string;
  icon?: string;
  color?: string;
};

export type ModuleCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  module: Module;
};

export type QuickAction = {
  id: string;
  title: string;
  icon: string;
  color: string;
  action: () => void;
};

export type HomeData = {
  greeting: string;
  daySummary: string;
  metrics: MetricCard[];
  quickActions: QuickAction[];
  attentionSection: {
    title: string;
    items: { title: string; description: string; icon: string }[];
  };
  modulePreviews: ModuleCard[];
};

export type ModuleData = {
  title: string;
  description: string;
  cards: (MetricCard | ActionCard)[];
  quickActions: QuickAction[];
};