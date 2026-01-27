import { Card, CardContent } from '@/ui/components/components/ui';
import { Smile, Zap, Brain, Battery } from 'lucide-react';
import { cn } from '@nexus/shared';

interface MentalIndicatorsCardProps {
  indicators: {
    averageMood: number;
    stressLevel: number;
    mentalClarity: number;
    emotionalEnergy: number;
  };
}

export function MentalIndicatorsCard({ indicators }: MentalIndicatorsCardProps) {
  const getIndicatorColor = (value: number, inverted = false) => {
    if (inverted) {
      // For stress (higher is worse)
      if (value >= 70) return { bg: 'bg-red-500/10', bar: 'bg-red-500', text: 'text-red-600' };
      if (value >= 50) return { bg: 'bg-amber-500/10', bar: 'bg-amber-500', text: 'text-amber-600' };
      return { bg: 'bg-green-500/10', bar: 'bg-green-500', text: 'text-green-600' };
    }
    // For mood, clarity, energy (higher is better)
    if (value >= 70) return { bg: 'bg-green-500/10', bar: 'bg-green-500', text: 'text-green-600' };
    if (value >= 40) return { bg: 'bg-amber-500/10', bar: 'bg-amber-500', text: 'text-amber-600' };
    return { bg: 'bg-red-500/10', bar: 'bg-red-500', text: 'text-red-600' };
  };

  const indicators_data = [
    {
      icon: Smile,
      label: 'Humor Médio',
      value: indicators.averageMood,
      colors: getIndicatorColor(indicators.averageMood),
    },
    {
      icon: Zap,
      label: 'Nível de Estresse',
      value: indicators.stressLevel,
      colors: getIndicatorColor(indicators.stressLevel, true),
    },
    {
      icon: Brain,
      label: 'Clareza Mental',
      value: indicators.mentalClarity,
      colors: getIndicatorColor(indicators.mentalClarity),
    },
    {
      icon: Battery,
      label: 'Energia Emocional',
      value: indicators.emotionalEnergy,
      colors: getIndicatorColor(indicators.emotionalEnergy),
    },
  ];

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <h3 className="text-sm font-semibold">Indicadores Emocionais</h3>

        <div className="grid grid-cols-2 gap-3">
          {indicators_data.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={cn('p-3 rounded-lg', item.colors.bg)}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn('h-3.5 w-3.5', item.colors.text)} />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
                <p className={cn('text-lg font-bold', item.colors.text)}>{item.value}%</p>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', item.colors.bar)}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
