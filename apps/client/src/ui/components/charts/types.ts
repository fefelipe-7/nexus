export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: any;
}

export interface SeriesDataPoint {
  x: Date | string | number;
  y: number;
  metadata?: any;
}

export interface ChartSeries {
  name: string;
  data: SeriesDataPoint[];
  color?: string;
  type?: 'line' | 'area' | 'bar';
}

export interface ChartConfig {
  height?: number;
  width?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  responsive?: boolean;
}

export interface ChartColors {
  primary?: string;
  secondary?: string;
  success?: string;
  warning?: string;
  danger?: string;
  info?: string;
  grid?: string;
  axis?: string;
  text?: string;
}

export type ChartOrientation = 'vertical' | 'horizontal';
export type ChartSize = 'sm' | 'md' | 'lg' | 'xl';
