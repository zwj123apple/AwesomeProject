// 图表数据模型和模拟数据

// 折线图数据接口
export interface LineChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity?: number) => string;
    strokeWidth?: number;
  }[];
  legend?: string[];
}

// 柱状图数据接口
export interface BarChartData {
  labels: string[];
  datasets: {
    data: number[];
    colors?: string[];
  }[];
}

// 饼图数据项接口
export interface PieChartItem {
  name: string;
  population: number;
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

// 模拟资产趋势数据 - 交易金额
export const getAssetTrendData = (): LineChartData => ({
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2
    }
  ],
  legend: ['交易金额趋势']
});

// 模拟资产趋势数据 - 交易次数
export const getTransactionCountData = (): LineChartData => ({
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      data: [5, 12, 8, 15, 20, 10],
      color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`,
      strokeWidth: 2
    }
  ],
  legend: ['交易次数趋势']
});

// 模拟资产类别分布数据 - 交易金额
export const getAssetCategoryData = (): BarChartData => ({
  labels: ['股票', '基金', '债券', '现金', '其他'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99]
    }
  ]
});

// 模拟资产类别分布数据 - 交易次数
export const getTransactionCategoryData = (): BarChartData => ({
  labels: ['股票', '基金', '债券', '现金', '其他'],
  datasets: [
    {
      data: [8, 15, 6, 12, 10]
    }
  ]
});

// 模拟资产占比数据 - 交易金额
export const getAssetProportionData = (): PieChartItem[] => [
  {
    name: '股票',
    population: 20,
    color: '#FF6384',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  },
  {
    name: '基金',
    population: 45,
    color: '#36A2EB',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  },
  {
    name: '债券',
    population: 28,
    color: '#FFCE56',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  },
  {
    name: '现金',
    population: 80,
    color: '#4BC0C0',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  },
  {
    name: '其他',
    population: 99,
    color: '#9966FF',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  }
];

// 模拟资产占比数据 - 交易次数
export const getTransactionProportionData = (): PieChartItem[] => [
  {
    name: '股票',
    population: 8,
    color: '#FF6384',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  },
  {
    name: '基金',
    population: 15,
    color: '#36A2EB',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  },
  {
    name: '债券',
    population: 6,
    color: '#FFCE56',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  },
  {
    name: '现金',
    population: 12,
    color: '#4BC0C0',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  },
  {
    name: '其他',
    population: 10,
    color: '#9966FF',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  }
];