import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ title, children }) => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      {children}
    </View>
  );
};

interface LineChartProps {
  data: any;
  height?: number;
  bezier?: boolean;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  withDotColor?: string;
  withScrollableDot?: boolean;
  withInnerLines?: boolean;
  withOuterLines?: boolean;
  withVerticalLines?: boolean;
  withHorizontalLines?: boolean;
  withShadow?: boolean;
  withGradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  gradientFromOpacity?: number;
  gradientToOpacity?: number;
  yAxisPosition?: 'left' | 'right';
  chartColor?: string;
}

export const AssetLineChart: React.FC<LineChartProps> = ({ 
  data, 
  height = 220, 
  bezier = true,
  yAxisLabel = '',
  yAxisSuffix = '',
  withDotColor = '#007AFF',
  withScrollableDot = false,
  withInnerLines = true,
  withOuterLines = true,
  withVerticalLines = true,
  withHorizontalLines = true,
  withShadow = true,
  withGradient = true,
  gradientFrom = '#007AFF',
  gradientTo = '#FFFFFF',
  gradientFromOpacity = 0.6,
  gradientToOpacity = 0.1,
  yAxisPosition = 'left',
  chartColor = '#007AFF'
}) => {
  const { width } = useWindowDimensions();
  const chartWidth = width - 32; // 考虑内边距
  
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${parseInt(chartColor.slice(1, 3), 16)}, ${parseInt(chartColor.slice(3, 5), 16)}, ${parseInt(chartColor.slice(5, 7), 16)}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: withDotColor
    },
    fillShadowGradient: withGradient ? gradientFrom : 'transparent',
    fillShadowGradientOpacity: gradientFromOpacity,
    fillShadowGradientTo: withGradient ? gradientTo : 'transparent',
    fillShadowGradientToOpacity: gradientToOpacity,
    // 使用alignmentX属性来控制Y轴位置
    alignmentX: yAxisPosition === 'right' ? 'right' : 'left'
  };

  return (
    <LineChart
      data={data}
      width={chartWidth}
      height={height}
      chartConfig={chartConfig}
      bezier={bezier}
      style={styles.chart}
      yAxisLabel={yAxisLabel}
      yAxisSuffix={yAxisSuffix}
      withInnerLines={withInnerLines}
      withOuterLines={withOuterLines}
      withVerticalLines={withVerticalLines}
      withHorizontalLines={withHorizontalLines}
      withShadow={withShadow}
      withScrollableDot={withScrollableDot}
    />
  );
};

interface BarChartProps {
  data: any;
  height?: number;
  verticalLabelRotation?: number;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  barColor?: string;
}

export const AssetBarChart: React.FC<BarChartProps> = ({ 
  data, 
  height = 220, 
  verticalLabelRotation = 30,
  yAxisLabel = '',
  yAxisSuffix = '',
  barColor = '#4CAF50' // 默认绿色
}) => {
  const { width } = useWindowDimensions();
  const chartWidth = width - 32; // 考虑内边距
  
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${parseInt(barColor.slice(1, 3), 16)}, ${parseInt(barColor.slice(3, 5), 16)}, ${parseInt(barColor.slice(5, 7), 16)}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    }
  };

  return (
    <BarChart
      data={data}
      width={chartWidth}
      height={height}
      chartConfig={chartConfig}
      style={styles.chart}
      verticalLabelRotation={verticalLabelRotation}
      yAxisLabel={yAxisLabel}
      yAxisSuffix={yAxisSuffix}
    />
  );
};

interface PieChartProps {
  data: any;
  height?: number;
  accessor?: string;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  chartColors?: string[];
}

export const AssetPieChart: React.FC<PieChartProps> = ({ 
  data, 
  height = 220, 
  accessor = 'population',
  yAxisLabel = '',
  yAxisSuffix = '' 
}) => {
  const { width } = useWindowDimensions();
  const chartWidth = width - 32; // 考虑内边距
  
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <PieChart
      data={data}
      width={chartWidth}
      height={height}
      chartConfig={chartConfig}
      accessor={accessor}
      backgroundColor="transparent"
      paddingLeft="15"
      style={styles.chart}
      yAxisLabel={yAxisLabel}
      yAxisSuffix={yAxisSuffix}
    />
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333333',
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
    alignSelf: 'center',
  },
});