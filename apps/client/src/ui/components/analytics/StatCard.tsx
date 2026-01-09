import { ReactNode } from 'react';
import { Card, CardContent } from '@/ui/components/components/ui';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@nexus/shared';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/data';

export type StatFormat = 'number' | 'currency' | 'percentage' | 'custom';
export type TrendDirection = 'up' | 'down' | 'stable';
export type StatVariant = 'default' | 'bordered' | 'filled' | 'glass' | 'gradient' | 'glow';
export type HoverEffect = 'none' | 'lift' | 'scale' | 'glow';

interface StatCardProps {
  label: string;
  value: number | string;
  trend?: {
    direction: TrendDirection;
    value: number;
    label?: string;
    animated?: boolean;
  };
  icon?: LucideIcon;
  color?: string;
  format?: StatFormat;
  formatFn?: (value: any) => string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: StatVariant;
  gradient?: string;
  glassEffect?: boolean;
  glowEffect?: boolean;
  iconGradient?: boolean;
  hoverEffect?: HoverEffect;
  animateValue?: boolean;
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
  gradient,
  glassEffect = false,
  glowEffect = false,
  iconGradient = false,
  hoverEffect = 'none',
  animateValue = false,
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

  const getVariantClasses = () => {
    const base = {
      default: '',
      bordered: 'border-l-4',
      filled: 'bg-gradient-to-br',
      glass: 'backdrop-blur-md bg-white/5 border border-white/10',
      gradient: 'bg-gradient-to-br border border-white/10',
      glow: 'border border-white/20',
    };

    const gradients = {
      green: 'from-green-500/20 via-emerald-500/10 to-transparent',
      red: 'from-red-500/20 via-rose-500/10 to-transparent',
      blue: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      amber: 'from-amber-500/20 via-orange-500/10 to-transparent',
      purple: 'from-purple-500/20 via-violet-500/10 to-transparent',
      primary: 'from-primary/20 via-primary/10 to-transparent',
    };

    let classes = base[variant];

    if (variant === 'bordered') {
      classes += ` border-l-${color}-500`;
    }

    if (variant === 'gradient' || variant === 'filled') {
      classes += ` ${gradient || gradients[color as keyof typeof gradients] || gradients.primary}`;
    }

    return classes;
  };

  const getHoverEffectClasses = () => {
    switch (hoverEffect) {
      case 'lift':
        return 'hover:-translate-y-1 hover:shadow-xl';
      case 'scale':
        return 'hover:scale-[1.02]';
      case 'glow':
        return 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]';
      default:
        return onClick ? 'hover:shadow-md' : '';
    }
  };

  const getGlowClasses = () => {
    if (!glowEffect) return '';
    const glowColors = {
      green: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
      red: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
      blue: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      amber: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
      purple: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
      primary: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    };
    return glowColors[color as keyof typeof glowColors] || glowColors.primary;
  };

  return (
    <Card
      className={cn(
        'transition-all duration-300 ease-out',
        onClick && 'cursor-pointer',
        getVariantClasses(),
        getHoverEffectClasses(),
        glowEffect && getGlowClasses(),
        glassEffect && 'backdrop-blur-lg',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="pt-6 relative overflow-hidden">
        <div className="flex items-start justify-between mb-2">
          <p className={cn('text-muted-foreground font-medium', sizeClasses[size].label)}>{label}</p>
          {Icon && (
            <div className={cn(
              'p-2 rounded-lg transition-all duration-300',
              iconGradient
                ? 'bg-gradient-to-br from-primary/20 to-primary/5'
                : 'bg-primary/10',
              onClick && 'group-hover:scale-110'
            )}>
              <Icon className={cn(
                sizeClasses[size].icon,
                iconGradient
                  ? 'text-transparent bg-gradient-to-br from-primary to-primary/60 bg-clip-text'
                  : 'text-primary'
              )} />
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          <p className={cn(
            'font-bold text-foreground',
            sizeClasses[size].value,
            animateValue && 'transition-all duration-500'
          )}>
            {formatValue(value)}
          </p>

          {trend && (
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full',
              'bg-gradient-to-r',
              trend.direction === 'up' && 'from-green-500/20 to-emerald-500/10',
              trend.direction === 'down' && 'from-red-500/20 to-rose-500/10',
              trend.direction === 'stable' && 'from-gray-500/20 to-slate-500/10',
              trend.animated && 'animate-pulse'
            )}>
              {getTrendIcon()}
              <div className={cn('font-semibold', getTrendColor(), sizeClasses[size].trend)}>
                {trend.value > 0 && '+'}
                {formatPercentage(trend.value, 1)}
              </div>
            </div>
          )}
        </div>

        {trend?.label && (
          <p className="text-xs text-muted-foreground mt-2 font-medium">{trend.label}</p>
        )}

        {(variant === 'gradient' || variant === 'glass') && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        )}
      </CardContent>
    </Card>
  );
}
