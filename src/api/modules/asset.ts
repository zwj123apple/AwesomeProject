/**
 * 资产分析API模块
 * 提供资产数据获取和分析相关的API请求
 */

import { apiService } from '..';

// 资产数据类型
export interface Asset {
  id: string;
  name: string;
  value: number;
  type: string;
  date: string;
}

// 资产趋势数据类型
export interface AssetTrend {
  date: string;
  value: number;
}

// 资产类别分布数据类型
export interface AssetDistribution {
  type: string;
  value: number;
  percentage: number;
}

// 模拟资产数据
const mockAssets: Asset[] = [
  {
    id: '1',
    name: '股票',
    value: 50000,
    type: '投资',
    date: '2023-10-01'
  },
  {
    id: '2',
    name: '存款',
    value: 100000,
    type: '现金',
    date: '2023-10-01'
  },
  {
    id: '3',
    name: '基金',
    value: 30000,
    type: '投资',
    date: '2023-10-01'
  },
  {
    id: '4',
    name: '房产',
    value: 2000000,
    type: '不动产',
    date: '2023-10-01'
  }
];

/**
 * 获取资产列表
 * @returns 资产列表
 */
export const getAssets = async () => {
  try {
    // 实际项目中应该调用API
    // const response = await apiService.get('/assets');
    // return response.data;
    
    // 使用模拟数据
    return mockAssets;
  } catch (error) {
    console.error('获取资产列表失败:', error);
    throw error;
  }
};

/**
 * 获取资产详情
 * @param assetId 资产ID
 * @returns 资产详情
 */
export const getAssetById = async (assetId: string) => {
  try {
    // 实际项目中应该调用API
    // const response = await apiService.get(`/assets/${assetId}`);
    // return response.data;
    
    // 使用模拟数据
    const asset = mockAssets.find(a => a.id === assetId);
    if (!asset) {
      throw new Error('资产不存在');
    }
    return asset;
  } catch (error) {
    console.error('获取资产详情失败:', error);
    throw error;
  }
};

/**
 * 获取资产趋势数据
 * @param period 周期（day, week, month, year）
 * @returns 资产趋势数据
 */
export const getAssetTrend = async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
  try {
    // 实际项目中应该调用API
    // const response = await apiService.get(`/assets/trend?period=${period}`);
    // return response.data;
    
    // 使用模拟数据
    const mockTrend: AssetTrend[] = [
      { date: '2023-05-01', value: 2100000 },
      { date: '2023-06-01', value: 2150000 },
      { date: '2023-07-01', value: 2180000 },
      { date: '2023-08-01', value: 2160000 },
      { date: '2023-09-01', value: 2200000 },
      { date: '2023-10-01', value: 2180000 }
    ];
    return mockTrend;
  } catch (error) {
    console.error('获取资产趋势数据失败:', error);
    throw error;
  }
};

/**
 * 获取资产类别分布
 * @returns 资产类别分布数据
 */
export const getAssetDistribution = async () => {
  try {
    // 实际项目中应该调用API
    // const response = await apiService.get('/assets/distribution');
    // return response.data;
    
    // 使用模拟数据
    const totalValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0);
    
    // 按类型分组并计算总值
    const groupedByType = mockAssets.reduce((groups, asset) => {
      if (!groups[asset.type]) {
        groups[asset.type] = 0;
      }
      groups[asset.type] += asset.value;
      return groups;
    }, {} as Record<string, number>);
    
    // 转换为分布数据格式
    const distribution: AssetDistribution[] = Object.entries(groupedByType).map(([type, value]) => ({
      type,
      value,
      percentage: Math.round((value / totalValue) * 10000) / 100 // 保留两位小数的百分比
    }));
    
    return distribution;
  } catch (error) {
    console.error('获取资产类别分布失败:', error);
    throw error;
  }
};

/**
 * 获取资产占比
 * @returns 资产占比数据
 */
export const getAssetAllocation = async () => {
  try {
    // 实际项目中应该调用API
    // const response = await apiService.get('/assets/allocation');
    // return response.data;
    
    // 使用模拟数据 - 这里简化为与分布相同
    return getAssetDistribution();
  } catch (error) {
    console.error('获取资产占比失败:', error);
    throw error;
  }
};