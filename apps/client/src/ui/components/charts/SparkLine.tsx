import { useMemo } from 'react';
import { cn } from '@nexus/shared';
import { max, min, normalize } from '@/utils/data';

interface SparkLineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
  showDots?: boolean;
  animated?: boolean;
  className?: string;
}

export function SparkLine({
  data,
  width = 100,
  height = 30,
  color = '#3b82f6',
  showArea = true,
  showDots = false,
  animated = true,
  className,
}: SparkLineProps) {
  const { minValue, maxValue } = useMemo(() => ({
    minValue: min(data),
    maxValue: max(data),
  }), [data]);

  const points = useMemo(() => {
    const step = width / (data.length - 1 || 1);
    return data.map((value, i) => ({
      x: i * step,
      y: height - normalize(value, minValue, maxValue) * height,
    }));
  }, [data, width, height, minValue, maxValue]);

  const linePath = useMemo(() => {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [points]);

  const areaPath = useMemo(() => {
    if (!showArea) return '';
    const lastPoint = points[points.length - 1];
    return `${linePath} L ${lastPoint.x} ${height} L 0 ${height} Z`;
  }, [linePath, points, height, showArea]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('overflow-visible', className)}
    >
      {showArea && (
        <path
          d={areaPath}
          fill={color}
          fillOpacity="0.2"
          className={cn(animated && 'transition-all duration-500')}
        />
      )}
      
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(animated && 'transition-all duration-500')}
      />

      {showDots && points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="2"
          fill={color}
          className={cn(animated && 'transition-all duration-300')}
        />
      ))}
    </svg>
  );
}
