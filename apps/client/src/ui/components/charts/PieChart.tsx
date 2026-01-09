import { useMemo } from 'react';
import { cn } from '@nexus/shared';
import type { ChartDataPoint } from './types';

interface PieChartProps {
  data: ChartDataPoint[];
  size?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  onSliceClick?: (item: ChartDataPoint, index: number) => void;
  formatValue?: (value: number) => string;
  colors?: string[];
  className?: string;
  innerRadius?: number; // 0 = pie, >0 = donut
}

export function PieChart({
  data,
  size = 200,
  showLabels = false,
  showValues = false,
  showLegend = true,
  animated = true,
  onSliceClick,
  formatValue = (v) => v.toString(),
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'],
  className,
  innerRadius = 0,
}: PieChartProps) {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

  const slices = useMemo(() => {
    let currentAngle = -90; // Start at top

    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      currentAngle = endAngle;

      return {
        ...item,
        percentage,
        startAngle,
        endAngle,
        color: item.color || colors[index % colors.length],
      };
    });
  }, [data, total, colors]);

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    if (innerRadius > 0) {
      const innerStart = polarToCartesian(x, y, innerRadius, endAngle);
      const innerEnd = polarToCartesian(x, y, innerRadius, startAngle);
      
      return [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        'L', innerEnd.x, innerEnd.y,
        'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        'Z'
      ].join(' ');
    }

    return [
      'M', x, y,
      'L', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ');
  };

  const center = size / 2;
  const radius = (size / 2) - 10;

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice, index) => {
          const path = describeArc(center, center, radius, slice.startAngle, slice.endAngle);
          
          return (
            <g key={index}>
              <path
                d={path}
                fill={slice.color}
                className={cn(
                  'transition-all cursor-pointer',
                  animated && 'duration-300',
                  'hover:opacity-80'
                )}
                onClick={() => onSliceClick?.(slice, index)}
              />
              
              {showLabels && slice.percentage > 5 && (
                <text
                  x={center}
                  y={center}
                  transform={`rotate(${slice.startAngle + (slice.endAngle - slice.startAngle) / 2} ${center} ${center})`}
                  textAnchor="middle"
                  className="text-xs font-medium fill-white"
                  dy="0.3em"
                >
                  {slice.percentage.toFixed(0)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {showLegend && (
        <div className="grid grid-cols-2 gap-2 w-full">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{slice.label}</p>
                {showValues && (
                  <p className="text-xs text-muted-foreground">
                    {formatValue(slice.value)} ({slice.percentage.toFixed(1)}%)
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
