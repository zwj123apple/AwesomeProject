# 图表组件使用指南

## 目录结构

```
src/
├── components/
│   └── charts/
│       ├── ChartComponents.tsx  # 可复用图表组件
│       └── README.md           # 本文档
├── models/
│   └── chartData.ts           # 图表数据模型和模拟数据
└── screens/
    └── AssetAnalysis/
        └── AssetAnalysisScreen.tsx  # 资产分析页面
```

## 组件说明

### ChartContainer
通用图表容器组件，提供统一的样式和标题。

```tsx
<ChartContainer title="图表标题">
  {/* 图表内容 */}
</ChartContainer>
```

### AssetLineChart
折线图组件，用于展示资产趋势等时间序列数据。

```tsx
<AssetLineChart data={lineChartData} />
```

### AssetBarChart
柱状图组件，用于展示资产类别分布等分类数据。

```tsx
<AssetBarChart data={barChartData} />
```

### AssetPieChart
饼图组件，用于展示资产占比等比例数据。

```tsx
<AssetPieChart data={pieChartData} />
```

## 数据模型

在 `src/models/chartData.ts` 中定义了图表数据的接口和模拟数据：

- `LineChartData`: 折线图数据接口
- `BarChartData`: 柱状图数据接口
- `PieChartItem`: 饼图数据项接口

### 使用示例

```tsx
import { getAssetTrendData, getAssetCategoryData, getAssetProportionData } from '../../models/chartData';

// 获取模拟数据
const lineChartData = getAssetTrendData();
const barChartData = getAssetCategoryData();
const pieChartData = getAssetProportionData();
```

## 扩展指南

1. 添加新的图表类型：在 `ChartComponents.tsx` 中创建新的图表组件
2. 添加新的数据模型：在 `chartData.ts` 中定义新的数据接口和模拟数据
3. 创建新的图表页面：参考 `AssetAnalysisScreen.tsx` 的实现方式