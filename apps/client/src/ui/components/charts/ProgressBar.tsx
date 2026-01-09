import { cn } from '@nexus/shared';
import { clamp } from '@/utils/data';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
  formatValue?: (value: number) => string;
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  showPercentage = false,
  size = 'md',
  color,
  animated = true,
  striped = false,
  className,
  formatValue = (v) => v.toString(),
}: ProgressBarProps) {
  const percentage = clamp((value / max) * 100, 0, 100);

  const getColor = () => {
    if (color) return color;
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('space-y-1', className)}>
      {(label || showValue || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium text-foreground">{label}</span>}
          <div className="flex items-center gap-2 text-muted-foreground">
            {showValue && <span>{formatValue(value)}</span>}
            {showPercentage && <span>{percentage.toFixed(0)}%</span>}
          </div>
        </div>
      )}
      
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all',
            getColor(),
            animated && 'duration-500 ease-out',
            striped && 'bg-stripe'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
