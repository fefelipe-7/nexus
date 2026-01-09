import { useMemo } from 'react';
import { cn } from '@nexus/shared';
import { max, normalize } from '@/utils/data';
import type { ChartDataPoint, ChartOrientation } from './types';

interface BarChartProps {
  data: ChartDataPoint[];
  orientation?: ChartOrientation;
  stacked?: boolean;
  showValues?: boolean;
  showGrid?: boolean;
  animated?: boolean;
  onBarClick?: (item: ChartDataPoint, index: number) => void;
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
  colors?: string[];
  className?: string;
}

export function BarChart({
  data,
  orientation = 'vertical',
  stacked = false,
  showValues = false,
  showGrid = true,
  animated = true,
  onBarClick,
  formatValue = (v) => v.toString(),
  formatLabel = (l) => l,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  className,
}: BarChartProps) {
  const maxValue = useMemo(() => max(data.map(d => d.value)), [data]);

  const getBarColor = (item: ChartDataPoint, index: number) => {
    return item.color || colors[index % colors.length];
  };

  const getBarSize = (value: number) => {
    return normalize(value, 0, maxValue) * 100;
  };

  if (orientation === 'horizontal') {
    return (
      <div className={cn('flex flex-col gap-3 h-full justify-center', className)}>
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground truncate">
                {formatLabel(item.label)}
              </span>
              {showValues && (
                <span className="text-muted-foreground ml-2">
                  {formatValue(item.value)}
                </span>
              )}
            </div>
            <div className="relative h-6 bg-muted rounded-full overflow-hidden">
              {showGrid && (
                <div className="absolute inset-0 flex">
                  {[25, 50, 75].map((percent) => (
                    <div
                      key={percent}
                      className="border-r border-border/50"
                      style={{ width: `${percent}%` }}
                    />
                  ))}
                </div>
              )}
              <div
                className={cn(
                  'h-full rounded-full transition-all cursor-pointer hover:opacity-80',
                  animated && 'duration-500 ease-out'
                )}
                style={{
                  width: `${getBarSize(item.value)}%`,
                  backgroundColor: getBarColor(item, index),
                }}
                onClick={() => onBarClick?.(item, index)}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex items-end justify-between gap-2 h-full px-2', className)}>
      {data.map((item, index) => {
        const barHeight = getBarSize(item.value);
        
        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center gap-2 group"
          >
            <div className="w-full flex flex-col items-center justify-end flex-1 relative">
              {showGrid && (
                <div className="absolute inset-0 flex flex-col">
                  {[25, 50, 75].map((percent) => (
                    <div
                      key={percent}
                      className="border-t border-border/50 flex-1"
                    />
                  ))}
                </div>
              )}
              <div
                className={cn(
                  'w-full rounded-t cursor-pointer transition-all relative z-10',
                  animated && 'duration-500 ease-out',
                  'hover:opacity-80'
                )}
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: getBarColor(item, index),
                }}
                onClick={() => onBarClick?.(item, index)}
              >
                {showValues && barHeight > 15 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {formatValue(item.value)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground text-center truncate w-full">
              {formatLabel(item.label)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
