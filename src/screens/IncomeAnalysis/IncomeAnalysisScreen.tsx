import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartContainer, AssetLineChart } from '../../components/charts/ChartComponents';
import { LineChartData } from '../../models/chartData';

// 定义时间维度类型
type TimePeriod = 'week' | 'month' | 'quarter' | 'year';

// 定义产品类型
interface Product {
  id: string;
  name: string;
  type: string;
  incomeData: {
    week: LineChartData;
    month: LineChartData;
    quarter: LineChartData;
    year: LineChartData;
  };
}

// 定义总收益数据类型
interface TotalIncomeData {
  week: LineChartData;
  month: LineChartData;
  quarter: LineChartData;
  year: LineChartData;
}

const IncomeAnalysisScreen = () => {
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState<TimePeriod>('week');
  const [products, setProducts] = useState<Product[]>([]);
  const [totalIncomeData, setTotalIncomeData] = useState<TotalIncomeData | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  // 模拟API调用获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 获取模拟数据
        const data = getMockIncomeData();
        setTotalIncomeData(data.totalIncome);
        setProducts(data.products);
      } catch (error) {
        console.error('获取收益数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 处理产品详情展开/收起
  const toggleProductDetails = (productId: string) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(productId);
    }
  };

  // 获取当前时间维度的标签文本
  const getPeriodLabel = () => {
    switch (activePeriod) {
      case 'week':
        return '周';
      case 'month':
        return '月';
      case 'quarter':
        return '季度';
      case 'year':
        return '年';
      default:
        return '';
    }
  };

  // 渲染时间维度选择器
  const renderPeriodSelector = () => {
    return (
      <View style={styles.periodSelectorContainer}>
        <TouchableOpacity 
          style={[styles.periodButton, activePeriod === 'week' && styles.activePeriodButton]} 
          onPress={() => setActivePeriod('week')}
        >
          <Text style={[styles.periodButtonText, activePeriod === 'week' && styles.activePeriodButtonText]}>周</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.periodButton, activePeriod === 'month' && styles.activePeriodButton]} 
          onPress={() => setActivePeriod('month')}
        >
          <Text style={[styles.periodButtonText, activePeriod === 'month' && styles.activePeriodButtonText]}>月</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.periodButton, activePeriod === 'quarter' && styles.activePeriodButton]} 
          onPress={() => setActivePeriod('quarter')}
        >
          <Text style={[styles.periodButtonText, activePeriod === 'quarter' && styles.activePeriodButtonText]}>季度</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.periodButton, activePeriod === 'year' && styles.activePeriodButton]} 
          onPress={() => setActivePeriod('year')}
        >
          <Text style={[styles.periodButtonText, activePeriod === 'year' && styles.activePeriodButtonText]}>年</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 渲染产品列表项
  const renderProductItem = (product: Product) => {
    const isExpanded = expandedProductId === product.id;
    
    return (
      <View key={product.id} style={styles.productItem}>
        <View style={styles.productHeader}>
          <View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productType}>{product.type}</Text>
          </View>
          <TouchableOpacity 
            style={styles.detailButton}
            onPress={() => toggleProductDetails(product.id)}
          >
            <Text style={styles.detailButtonText}>{isExpanded ? '收起' : '查看详情'}</Text>
          </TouchableOpacity>
        </View>
        
        {isExpanded && (
          <View style={styles.productDetails}>
            <ChartContainer title={`${product.name}${getPeriodLabel()}收益`}>
              <AssetLineChart 
                data={product.incomeData[activePeriod]} 
                withGradient={true}
                gradientFrom="#4CAF50"
                gradientTo="#FFFFFF"
                gradientFromOpacity={0.6}
                gradientToOpacity={0.1}
                chartColor="#4CAF50"
              />
            </ChartContainer>
          </View>
        )}
      </View>
    );
  };

  if (loading || !totalIncomeData) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>收益分析</Text>
        <Text style={styles.subtitle}>查看您的产品收益情况</Text>
        
        {renderPeriodSelector()}
        
        <ChartContainer title={`总收益(${getPeriodLabel()})`}>
          <AssetLineChart 
            data={totalIncomeData[activePeriod]} 
            withGradient={true}
            gradientFrom="#007AFF"
            gradientTo="#FFFFFF"
            gradientFromOpacity={0.6}
            gradientToOpacity={0.1}
            chartColor="#007AFF"
          />
        </ChartContainer>
        
        <Text style={styles.sectionTitle}>产品列表</Text>
        {products.map(renderProductItem)}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 24,
    marginBottom: 16,
  },
  periodSelectorContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
    overflow: 'hidden',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePeriodButton: {
    backgroundColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
  },
  productItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  productType: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  detailButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  productDetails: {
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
});

// 模拟API数据
const getMockIncomeData = () => {
  // 周数据 - 7天
  const weekLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  
  // 月数据 - 4周
  const monthLabels = ['第1周', '第2周', '第3周', '第4周'];
  
  // 季度数据 - 3个月
  const quarterLabels = ['1月', '2月', '3月'];
  
  // 年数据 - 4个季度
  const yearLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
  
  // 总收益数据
  const totalIncome: TotalIncomeData = {
    week: {
      labels: weekLabels,
      datasets: [{ data: [120, 150, 180, 200, 220, 250, 280] }],
      legend: ['总收益']
    },
    month: {
      labels: monthLabels,
      datasets: [{ data: [800, 950, 1100, 1300] }],
      legend: ['总收益']
    },
    quarter: {
      labels: quarterLabels,
      datasets: [{ data: [3500, 4200, 4800] }],
      legend: ['总收益']
    },
    year: {
      labels: yearLabels,
      datasets: [{ data: [12000, 15000, 18000, 21000] }],
      legend: ['总收益']
    }
  };
  
  // 产品数据
  const products: Product[] = [
    {
      id: '1',
      name: '稳健理财产品A',
      type: '固定收益类',
      incomeData: {
        week: {
          labels: weekLabels,
          datasets: [{ data: [50, 55, 60, 65, 70, 75, 80] }],
          legend: ['收益']
        },
        month: {
          labels: monthLabels,
          datasets: [{ data: [250, 280, 310, 350] }],
          legend: ['收益']
        },
        quarter: {
          labels: quarterLabels,
          datasets: [{ data: [1000, 1100, 1200] }],
          legend: ['收益']
        },
        year: {
          labels: yearLabels,
          datasets: [{ data: [3500, 4000, 4500, 5000] }],
          legend: ['收益']
        }
      }
    },
    {
      id: '2',
      name: '成长型基金B',
      type: '混合型',
      incomeData: {
        week: {
          labels: weekLabels,
          datasets: [{ data: [40, 45, 55, 65, 75, 85, 95] }],
          legend: ['收益']
        },
        month: {
          labels: monthLabels,
          datasets: [{ data: [300, 350, 400, 450] }],
          legend: ['收益']
        },
        quarter: {
          labels: quarterLabels,
          datasets: [{ data: [1200, 1400, 1600] }],
          legend: ['收益']
        },
        year: {
          labels: yearLabels,
          datasets: [{ data: [4000, 4800, 5600, 6400] }],
          legend: ['收益']
        }
      }
    },
    {
      id: '3',
      name: '高风险股票C',
      type: '权益类',
      incomeData: {
        week: {
          labels: weekLabels,
          datasets: [{ data: [30, 50, 65, 70, 75, 90, 105] }],
          legend: ['收益']
        },
        month: {
          labels: monthLabels,
          datasets: [{ data: [250, 320, 390, 500] }],
          legend: ['收益']
        },
        quarter: {
          labels: quarterLabels,
          datasets: [{ data: [1300, 1700, 2000] }],
          legend: ['收益']
        },
        year: {
          labels: yearLabels,
          datasets: [{ data: [4500, 6200, 7900, 9600] }],
          legend: ['收益']
        }
      }
    }
  ];
  
  return { totalIncome, products };
};

export default IncomeAnalysisScreen;