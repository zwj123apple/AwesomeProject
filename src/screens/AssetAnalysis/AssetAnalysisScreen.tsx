import React, { useState } from 'react';
import { Text, StyleSheet, SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { ChartContainer, AssetLineChart, AssetBarChart, AssetPieChart } from '../../components/charts/ChartComponents';
import { 
  getAssetTrendData, 
  getAssetCategoryData, 
  getAssetProportionData,
  getTransactionCountData,
  getTransactionCategoryData,
  getTransactionProportionData
} from '../../models/chartData';

const AssetAnalysisScreen = () => {
  // 定义当前选中的标签
  const [activeTab, setActiveTab] = useState<'amount' | 'count'>('amount');
  
  // 根据当前选中的标签获取对应的数据
  const lineChartData = activeTab === 'amount' ? getAssetTrendData() : getTransactionCountData();
  const barChartData = activeTab === 'amount' ? getAssetCategoryData() : getTransactionCategoryData();
  const pieChartData = activeTab === 'amount' ? getAssetProportionData() : getTransactionProportionData();
  
  // 标签标题
  const tabTitle = activeTab === 'amount' ? '交易金额' : '交易次数';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>资产分析</Text>
        <Text style={styles.subtitle}>查看您的资产分布和趋势</Text>
        
        {/* 标签切换 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'amount' && styles.activeTab]} 
            onPress={() => setActiveTab('amount')}
          >
            <Text style={[styles.tabText, activeTab === 'amount' && styles.activeTabText]}>交易金额</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'count' && styles.activeTab]} 
            onPress={() => setActiveTab('count')}
          >
            <Text style={[styles.tabText, activeTab === 'count' && styles.activeTabText]}>交易次数</Text>
          </TouchableOpacity>
        </View>
        
        <ChartContainer title={`${tabTitle}趋势`}>
          <AssetLineChart 
            data={lineChartData} 
            withGradient={true}
            gradientFrom={activeTab === 'amount' ? '#007AFF' : '#4CAF50'}
            gradientTo={activeTab === 'amount' ? '#FFFFFF' : '#FFFFFF'}
            gradientFromOpacity={0.6}
            gradientToOpacity={0.1}
            chartColor={activeTab === 'amount' ? '#007AFF' : '#4CAF50'}
            yAxisPosition={activeTab === 'count' ? 'right' : 'left'}
          />
        </ChartContainer>
        
        <ChartContainer title={`${tabTitle}类别分布`}>
          <AssetBarChart 
            data={barChartData} 
            barColor="#4CAF50"
          />
        </ChartContainer>
        
        <ChartContainer title={`${tabTitle}占比`}>
          <AssetPieChart data={pieChartData} />
        </ChartContainer>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});

export default AssetAnalysisScreen;