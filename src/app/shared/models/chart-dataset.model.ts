import { ChartDataset } from 'chart.js';
export interface PartialChartDataset
    extends Partial<Pick<ChartDataset, 'data' | 'label'>> {}
