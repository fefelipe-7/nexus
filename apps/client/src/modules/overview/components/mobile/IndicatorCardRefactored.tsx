import { useNavigate } from 'react-router-dom';
import { Card } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@nexus/shared';
import type { LucideIcon } from 'lucide-react';

interface IndicatorCardProps {
  domain: string;
  label: string;
  status: string;
  trend: string;
  icon: LucideIcon;
  value: string;
}

export function IndicatorCard({
  domain,
  label,
  status,
  trend,
  icon: Icon,
  value,
}: IndicatorCardProps) {
  const navigate = useNavigate();

  const getStatusColor = () => {
    switch (status) {
      case 'positive':
        return 'border-green-500/30 bg-green-500/5';
      case 'attention':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'critical':
        return 'border-red-500/30 bg-red-500/5';
      default:
        return 'border-blue-500/30 bg-blue-500/5';
    }
  };

  const getStatusBadgeColor = () => {
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
        'cursor-pointer active:scale-98 transition-all border-l-4',
        getStatusColor()
      )}
      onClick={() => navigate(`/${domain}`)}
    >
      <div className="p-4 flex items-center gap-3">
        <div className={cn('p-2 rounded-lg', getStatusBadgeColor())}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground line-clamp-2">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">{value}</p>
        </div>
        <div className="flex-shrink-0">
          {getTrendIcon()}
        </div>
      </div>
    </Card>
  );
}
