import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { createDomainApiService, createBackendSelector, withErrorHandling } from '../utils/apiUtils';
import { getData } from '../utils/storage';

/**
 * 业务模块示例
 * 展示如何在不同业务模块中使用多后端API服务
 */

// 创建用户模块API服务（使用默认后端）
const userApiService = createDomainApiService('users', 'default');

// 创建产品模块API服务（使用第二后端）
const productApiService = createDomainApiService('products', 'backend2');

// 创建订单模块API服务（使用第三后端）
const orderApiService = createDomainApiService('orders', 'backend3');

// 创建基于用户角色的后端选择器
const userRoleBackendSelector = createBackendSelector({
  defaultBackendId: 'default',
  selectionRules: [
    {
      // 管理员用户使用backend2
      condition: async () => {
        const userRole = await getData('USER_ROLE');
        return userRole === 'admin';
      },
      backendId: 'backend2',
      priority: 10
    },
    {
      // VIP用户使用backend3
      condition: async () => {
        const userRole = await getData('USER_ROLE');
        return userRole === 'vip';
      },
      backendId: 'backend3',
      priority: 5
    }
  ]
});

// 业务模块示例组件
const BusinessModuleExample: React.FC = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState<string>('users');
  const [userData, setUserData] = useState<any>(null);
  const [productData, setProductData] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 加载用户数据
  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await withErrorHandling(async () => {
      return await userApiService.getAll();
    })();
    
    if (error) {
      setError(`获取用户数据失败: ${error.message}`);
    } else {
      setUserData(data);
    }
    
    setLoading(false);
  };

  // 加载产品数据
  const loadProductData = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await withErrorHandling(async () => {
      return await productApiService.getAll();
    })();
    
    if (error) {
      setError(`获取产品数据失败: ${error.message}`);
    } else {
      setProductData(data);
    }
    
    setLoading(false);
  };

  // 加载订单数据
  const loadOrderData = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await withErrorHandling(async () => {
      return await orderApiService.getAll();
    })();
    
    if (error) {
      setError(`获取订单数据失败: ${error.message}`);
    } else {
      setOrderData(data);
    }
    
    setLoading(false);
  };

  // 根据当前选项卡加载数据
  useEffect(() => {
    switch (activeTab) {
      case 'users':
        loadUserData();
        break;
      case 'products':
        loadProductData();
        break;
      case 'orders':
        loadOrderData();
        break;
    }
  }, [activeTab]);

  // 渲染选项卡
  const renderTabs = () => {
    const tabs = [
      { id: 'users', label: '用户管理', backend: '默认后端' },
      { id: 'products', label: '产品管理', backend: '后端2' },
      { id: 'orders', label: '订单管理', backend: '后端3' },
    ];

    return (
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
            <Text style={styles.backendText}>{tab.backend}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // 渲染内容
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <Text>加载中...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    let data = null;
    let title = '';

    switch (activeTab) {
      case 'users':
        data = userData;
        title = '用户数据';
        break;
      case 'products':
        data = productData;
        title = '产品数据';
        break;
      case 'orders':
        data = orderData;
        title = '订单数据';
        break;
    }

    if (!data) {
      return (
        <View style={styles.centerContent}>
          <Text>暂无数据</Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.contentTitle}>{title}</Text>
        <Text style={styles.dataText}>{JSON.stringify(data, null, 2)}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>业务模块示例</Text>
      <Text style={styles.description}>
        此示例展示了如何在不同业务模块中使用多后端API服务。
        每个业务模块连接到不同的后端服务。
      </Text>
      
      {renderTabs()}
      {renderContent()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 12,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#2196F3',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  backendText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  contentContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  centerContent: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  errorText: {
    color: '#d32f2f',
  },
  dataText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});

export default BusinessModuleExample;