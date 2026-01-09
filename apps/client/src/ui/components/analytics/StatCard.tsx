import { ReactNode } from 'react';
import { Card, CardContent } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@nexus/shared';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/data';

export type StatFormat = 'number' | 'currency' | 'percentage' | 'custom';
export type TrendDirection = 'up' | 'down' | 'stable';

interface StatCardProps {
  label: string;
  value: number | string;
  trend?: {
    direction: TrendDirection;
    value: number;
    label?: string;
  };
  icon?: LucideIcon;
  color?: string;
  format?: StatFormat;
  formatFn?: (value: any) => string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'filled';
}

const sizeClasses = {
  sm: {
    value: 'text-xl',
    label: 'text-xs',
    icon: 'h-4 w-4',
    trend: 'text-xs',
  },
  md: {
    value: 'text-2xl',
    label: 'text-sm',
    icon: 'h-5 w-5',
    trend: 'text-sm',
  },
  lg: {
    value: 'text-3xl',
    label: 'text-base',
    icon: 'h-6 w-6',
    trend: 'text-base',
  },
};

export function StatCard({
  label,
  value,
  trend,
  icon: Icon,
  color = 'primary',
  format = 'number',
  formatFn,
  onClick,
  className,
  size = 'md',
  variant = 'default',
}: StatCardProps) {
  const formatValue = (val: number | string): string => {
    if (formatFn) return formatFn(val);
    if (typeof val === 'string') return val;

    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val);
      case 'number':
        return formatNumber(val);
      default:
        return val.toString();
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className={cn(sizeClasses[size].trend, 'text-green-500')} />;
      case 'down':
        return <TrendingDown className={cn(sizeClasses[size].trend, 'text-red-500')} />;
      default:
        return <Minus className={cn(sizeClasses[size].trend, 'text-gray-500')} />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    switch (trend.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const variantClasses = {
    default: '',
    bordered: `border-l-4 border-l-${color}`,
    filled: `bg-${color}/10`,
  };

  return (
    <Card
      className={cn(
        'transition-all',
        onClick && 'cursor-pointer hover:shadow-md',
        variantClasses[variant],
        className
      )}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-2">
          <p className={cn('text-muted-foreground', sizeClasses[size].label)}>{label}</p>
          {Icon && (
            <div className={cn('p-2 rounded-lg bg-primary/10')}>
              <Icon className={cn(sizeClasses[size].icon, 'text-primary')} />
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          <p className={cn('font-bold text-foreground', sizeClasses[size].value)}>
            {formatValue(value)}
          </p>

          {trend && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <div className={cn('font-medium', getTrendColor(), sizeClasses[size].trend)}>
                {trend.value > 0 && '+'}
                {formatPercentage(trend.value, 1)}
              </div>
            </div>
          )}
        </div>

        {trend?.label && (
          <p className="text-xs text-muted-foreground mt-2">{trend.label}</p>
        )}
      </CardContent>
    </Card>
  );
}
