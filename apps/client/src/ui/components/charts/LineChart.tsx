import { useMemo } from 'react';
import { cn } from '@nexus/shared';
import { max, min, normalize } from '@/utils/data';
import type { SeriesDataPoint, ChartSeries } from './types';

interface LineChartProps {
  data?: SeriesDataPoint[];
  series?: ChartSeries[];
  height?: number;
  showGrid?: boolean;
  showPoints?: boolean;
  showArea?: boolean;
  smooth?: boolean;
  animated?: boolean;
  onPointClick?: (point: SeriesDataPoint, seriesIndex?: number) => void;
  formatValue?: (value: number) => string;
  colors?: string[];
  className?: string;
}

export function LineChart({
  data,
  series,
  height = 200,
  showGrid = true,
  showPoints = true,
  showArea = false,
  smooth = true,
  animated = true,
  onPointClick,
  formatValue = (v) => v.toString(),
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  className,
}: LineChartProps) {
  const chartData = useMemo(() => {
    if (series) return series;
    if (data) return [{ name: 'Series 1', data, color: colors[0] }];
    return [];
  }, [data, series, colors]);

  const { minValue, maxValue } = useMemo(() => {
    const allValues = chartData.flatMap(s => s.data.map(d => d.y));
    return {
      minValue: min(allValues),
      maxValue: max(allValues),
    };
  }, [chartData]);

  const getY = (value: number) => {
    return (1 - normalize(value, minValue, maxValue)) * 100;
  };

  const generatePath = (points: SeriesDataPoint[], area: boolean = false) => {
    if (points.length === 0) return '';

    const width = 100;
    const step = width / (points.length - 1 || 1);

    let path = '';

    if (smooth) {
      points.forEach((point, i) => {
        const x = i * step;
        const y = getY(point.y);

        if (i === 0) {
          path += `M ${x} ${y}`;
        } else {
          const prevX = (i - 1) * step;
          const prevY = getY(points[i - 1].y);
          const cpX1 = prevX + step / 3;
          const cpX2 = x - step / 3;
          path += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
        }
      });
    } else {
      points.forEach((point, i) => {
        const x = i * step;
        const y = getY(point.y);
        path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
      });
    }

    if (area) {
      const lastX = (points.length - 1) * step;
      path += ` L ${lastX} 100 L 0 100 Z`;
    }

    return path;
  };

  return (
    <div className={cn('relative w-full', className)} style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        {showGrid && (
          <g className="opacity-20">
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="currentColor"
                strokeWidth="0.2"
                className="text-muted-foreground"
              />
            ))}
          </g>
        )}

        {chartData.map((serie, seriesIndex) => {
          const color = serie.color || colors[seriesIndex % colors.length];

          return (
            <g key={seriesIndex}>
              {showArea && (
                <path
                  d={generatePath(serie.data, true)}
                  fill={color}
                  fillOpacity="0.1"
                  className={cn(animated && 'transition-all duration-500')}
                />
              )}

              <path
                d={generatePath(serie.data, false)}
                fill="none"
                stroke={color}
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(animated && 'transition-all duration-500')}
              />

              {showPoints &&
                serie.data.map((point, pointIndex) => {
                  const width = 100;
                  const step = width / (serie.data.length - 1 || 1);
                  const x = pointIndex * step;
                  const y = getY(point.y);

                  return (
                    <circle
                      key={pointIndex}
                      cx={x}
                      cy={y}
                      r="1"
                      fill={color}
                      className={cn(
                        'cursor-pointer hover:r-1.5 transition-all',
                        animated && 'duration-300'
                      )}
                      onClick={() => onPointClick?.(point, seriesIndex)}
                    />
                  );
                })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
