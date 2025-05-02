import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import apiService, { ApiBackendConfig } from '../services/api.service';

/**
 * 多后端API示例组件
 * 演示如何在React Native应用中使用多后端API服务
 */
const MultiBackendApiExample: React.FC = () => {
  // 状态管理
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [productData, setProductData] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [backends, setBackends] = useState<ApiBackendConfig[]>([]);

  // 获取所有可用后端
  useEffect(() => {
    const availableBackends = apiService.getAvailableBackends();
    setBackends(availableBackends);
  }, []);

  // 从默认后端获取用户数据
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 使用默认后端
      const response = await apiService.get('/users/1');
      setUserData(response.data);
    } catch (err: any) {
      setError(`获取用户数据失败: ${err.message}`);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // 从第二后端获取产品数据
  const fetchProductData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 使用backend2后端
      const response = await apiService.get('/products', undefined, 'backend2');
      setProductData(response.data);
    } catch (err: any) {
      setError(`获取产品数据失败: ${err.message}`);
      setProductData(null);
    } finally {
      setLoading(false);
    }
  };

  // 从第三后端获取订单数据
  const fetchOrderData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 使用backend3后端
      const response = await apiService.get('/orders', undefined, 'backend3');
      setOrderData(response.data);
    } catch (err: any) {
      setError(`获取订单数据失败: ${err.message}`);
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  // 从所有后端获取数据
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 并行请求多个后端
      const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
        apiService.get('/users/1'),
        apiService.get('/products', undefined, 'backend2'),
        apiService.get('/orders', undefined, 'backend3')
      ]);
      
      setUserData(usersResponse.data);
      setProductData(productsResponse.data);
      setOrderData(ordersResponse.data);
    } catch (err: any) {
      setError(`获取所有数据失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 添加自定义后端
  const addCustomBackend = () => {
    const newBackend: ApiBackendConfig = {
      id: 'custom-backend',
      name: '自定义后端',
      baseURL: 'https://custom-api.example.com',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'CustomValue'
      }
    };
    
    apiService.addBackend(newBackend);
    // 刷新后端列表
    setBackends(apiService.getAvailableBackends());
  };

  // 渲染数据显示区域
  const renderDataSection = (title: string, data: any) => {
    return (
      <View style={styles.dataSection}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {data ? (
          <Text style={styles.dataText}>{JSON.stringify(data, null, 2)}</Text>
        ) : (
          <Text style={styles.noDataText}>暂无数据</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>多后端API示例</Text>
      
      {/* 后端列表 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>可用后端列表</Text>
        {backends.map((backend) => (
          <View key={backend.id} style={styles.backendItem}>
            <Text style={styles.backendName}>{backend.name}</Text>
            <Text style={styles.backendUrl}>{backend.baseURL}</Text>
          </View>
        ))}
        <Button title="添加自定义后端" onPress={addCustomBackend} />
      </View>

      {/* 操作按钮 */}
      <View style={styles.buttonContainer}>
        <Button title="获取用户数据 (默认后端)" onPress={fetchUserData} />
        <View style={styles.buttonSpacer} />
        <Button title="获取产品数据 (后端2)" onPress={fetchProductData} />
        <View style={styles.buttonSpacer} />
        <Button title="获取订单数据 (后端3)" onPress={fetchOrderData} />
        <View style={styles.buttonSpacer} />
        <Button title="获取所有数据" onPress={fetchAllData} />
      </View>

      {/* 加载指示器 */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      )}

      {/* 错误信息 */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* 数据显示区域 */}
      <View style={styles.dataContainer}>
        {renderDataSection('用户数据 (默认后端)', userData)}
        {renderDataSection('产品数据 (后端2)', productData)}
        {renderDataSection('订单数据 (后端3)', orderData)}
      </View>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  backendItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  backendName: {
    fontWeight: 'bold',
  },
  backendUrl: {
    color: '#666',
    fontSize: 12,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  buttonSpacer: {
    height: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 8,
    color: '#0000ff',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#d32f2f',
  },
  dataContainer: {
    marginBottom: 20,
  },
  dataSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  dataText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  noDataText: {
    fontStyle: 'italic',
    color: '#999',
  },
});

export default MultiBackendApiExample;