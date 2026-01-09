import { useNavigate } from 'react-router-dom';
import { Card } from '@/ui/components/components/ui';
import { HoverCard } from '@/ui/components/desktop';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { cn } from '@nexus/shared';

interface Indicator {
  domain: string;
  label: string;
  status: 'positive' | 'attention' | 'critical' | 'neutral';
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  value: string;
}

interface IndicatorGridProps {
  indicators: Indicator[];
}

export function IndicatorGrid({ indicators }: IndicatorGridProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive':
        return 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10';
      case 'attention':
        return 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10';
      case 'critical':
        return 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'positive':
        return 'bg-green-500/20 text-green-700';
      case 'attention':
        return 'bg-amber-500/20 text-amber-700';
      case 'critical':
        return 'bg-red-500/20 text-red-700';
      default:
        return 'bg-blue-500/20 text-blue-700';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'Melhorando';
      case 'down':
        return 'Piorando';
      default:
        return 'Estável';
    }
  };

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
      {indicators.map((indicator) => {
        const Icon = indicator.icon;
        
        return (
          <HoverCard
            key={indicator.domain}
            trigger={
              <Card
                className={cn(
                  'cursor-pointer transition-all p-3',
                  getStatusColor(indicator.status)
                )}
                onClick={() => navigate(`/${indicator.domain}`)}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div className={cn('p-1.5 rounded-lg', getStatusBadgeColor(indicator.status))}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {getTrendIcon(indicator.trend)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground line-clamp-2">{indicator.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{indicator.value}</p>
                  </div>
                </div>
              </Card>
            }
            content={
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{indicator.label}</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">Valor atual: <span className="font-medium text-foreground">{indicator.value}</span></p>
                  <p className="text-muted-foreground">Tendência: <span className="font-medium text-foreground">{getTrendLabel(indicator.trend)}</span></p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                  <BarChart3 className="h-3 w-3" />
                  <span>Clique para ver detalhes</span>
                </div>
              </div>
            }
            side="top"
            align="center"
          />
        );
      })}
    </div>
  );
}
