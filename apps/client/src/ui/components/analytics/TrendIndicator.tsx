import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@nexus/shared';
import { formatPercentage } from '@/utils/data';

export type TrendDirection = 'up' | 'down' | 'stable';
export type TrendSize = 'sm' | 'md' | 'lg';

interface TrendIndicatorProps {
  direction: TrendDirection;
  value: number;
  label?: string;
  size?: TrendSize;
  showIcon?: boolean;
  showValue?: boolean;
  className?: string;
}

const sizeClasses: Record<TrendSize, { icon: string; text: string }> = {
  sm: { icon: 'h-3 w-3', text: 'text-xs' },
  md: { icon: 'h-4 w-4', text: 'text-sm' },
  lg: { icon: 'h-5 w-5', text: 'text-base' },
};

export function TrendIndicator({
  direction,
  value,
  label,
  size = 'md',
  showIcon = true,
  showValue = true,
  className,
}: TrendIndicatorProps) {
  const getIcon = () => {
    switch (direction) {
      case 'up':
        return <TrendingUp className={cn(sizeClasses[size].icon, 'text-green-500')} />;
      case 'down':
        return <TrendingDown className={cn(sizeClasses[size].icon, 'text-red-500')} />;
      default:
        return <Minus className={cn(sizeClasses[size].icon, 'text-gray-500')} />;
    }
  };

  const getColor = () => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBgColor = () => {
    switch (direction) {
      case 'up':
        return 'bg-green-500/10';
      case 'down':
        return 'bg-red-500/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full',
        getBgColor(),
        className
      )}
    >
      {showIcon && getIcon()}
      {showValue && (
        <span className={cn('font-medium', getColor(), sizeClasses[size].text)}>
          {value > 0 && direction === 'up' && '+'}
          {value < 0 && direction === 'down' && '-'}
          {formatPercentage(Math.abs(value), 1)}
        </span>
      )}
      {label && (
        <span className={cn('text-muted-foreground', sizeClasses[size].text)}>
          {label}
        </span>
      )}
    </div>
  );
}
