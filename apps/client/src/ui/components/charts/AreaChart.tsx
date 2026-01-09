import { LineChart } from './LineChart';
import type { SeriesDataPoint, ChartSeries } from './types';

interface AreaChartProps {
  data?: SeriesDataPoint[];
  series?: ChartSeries[];
  height?: number;
  showGrid?: boolean;
  showPoints?: boolean;
  smooth?: boolean;
  animated?: boolean;
  stacked?: boolean;
  onPointClick?: (point: SeriesDataPoint, seriesIndex?: number) => void;
  formatValue?: (value: number) => string;
  colors?: string[];
  className?: string;
}

export function AreaChart(props: AreaChartProps) {
  return <LineChart {...props} showArea />;
}
