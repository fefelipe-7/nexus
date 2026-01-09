import { useNavigate } from 'react-router-dom';
import { Card } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@nexus/shared';

interface IndicatorCardProps {
  domain: string;
  label: string;
  status: 'positive' | 'attention' | 'critical' | 'neutral';
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  value: string;
}

export function IndicatorCard({ domain, label, status, trend, icon: Icon, value }: IndicatorCardProps) {
  const navigate = useNavigate();

  const getStatusColor = () => {
    switch (status) {
      case 'positive':
        return 'border-l-green-500 bg-green-500/5';
      case 'attention':
        return 'border-l-amber-500 bg-amber-500/5';
      case 'critical':
        return 'border-l-red-500 bg-red-500/5';
      default:
        return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  const getIconBgColor = () => {
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

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card
      className={cn(
        'border-l-4 active:scale-98 transition-all',
        getStatusColor()
      )}
      onClick={() => navigate(`/${domain}`)}
    >
      <div className="p-4 flex items-center gap-3">
        <div className={cn('p-2.5 rounded-lg', getIconBgColor())}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{label}</p>
          <p className="text-xs text-muted-foreground">{value}</p>
        </div>
        {getTrendIcon()}
      </div>
    </Card>
  );
}
