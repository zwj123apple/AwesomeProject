import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';

// 模拟持仓数据
const mockPortfolioData = [
  { id: '1', name: '比特币', symbol: 'BTC', amount: '0.25', value: '75000', change: '+5.2%' },
  { id: '2', name: '以太坊', symbol: 'ETH', amount: '2.5', value: '45000', change: '+3.8%' },
  { id: '3', name: '莱特币', symbol: 'LTC', amount: '10', value: '12000', change: '-1.2%' },
  { id: '4', name: '瑞波币', symbol: 'XRP', amount: '1000', value: '8000', change: '+2.5%' },
  { id: '5', name: '卡尔达诺', symbol: 'ADA', amount: '500', value: '5000', change: '+1.7%' },
];

type PortfolioItem = {
  id: string;
  name: string;
  symbol: string;
  amount: string;
  value: string;
  change: string;
};

const PortfolioScreen = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>持仓列表</Text>
          <Text style={styles.message}>请先登录以查看持仓信息</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderPortfolioItem = ({ item }: { item: PortfolioItem }) => {
    const isPositive = item.change.startsWith('+');
    
    return (
      <View style={styles.portfolioItem}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{item.symbol}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.assetName}>{item.name}</Text>
          <Text style={styles.assetAmount}>{item.amount} {item.symbol}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.assetValue}>¥{item.value}</Text>
          <Text style={[styles.assetChange, isPositive ? styles.positive : styles.negative]}>
            {item.change}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>持仓列表</Text>
        
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>总资产</Text>
            <Text style={styles.summaryValue}>¥145,000</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>今日收益</Text>
            <Text style={[styles.summaryValue, styles.positive]}>+¥3,250</Text>
          </View>
        </View>
        
        <FlatList
          data={mockPortfolioData}
          renderItem={renderPortfolioItem}
          keyExtractor={item => item.id}
          style={styles.portfolioList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    color: '#666666',
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  portfolioList: {
    flex: 1,
  },
  portfolioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  symbolContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  detailsContainer: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  assetAmount: {
    fontSize: 14,
    color: '#666666',
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  assetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  assetChange: {
    fontSize: 14,
  },
  positive: {
    color: '#34C759',
  },
  negative: {
    color: '#FF3B30',
  },
});

export default PortfolioScreen;