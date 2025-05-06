/**
 * 双后端API使用示例
 * 演示如何在应用中使用两个不同端口的后端服务
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { apiService, api8080Service } from '../api';
import { initApiService, getApiServiceStatus } from '../api/initApi';
import { BACKEND_IDS } from '../config/apiConfig';

const DualBackendApiExample = () => {
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [port5000Data, setPort5000Data] = useState<any>(null);
  const [port8080Data, setPort8080Data] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // 初始化API服务
  useEffect(() => {
    // 在组件挂载时初始化API服务
    initApiService();
    // 获取API服务状态
    setApiStatus(getApiServiceStatus());
  }, []);

  // 从端口5000获取数据
  const fetchDataFromPort5000 = async () => {
    setLoading(true);
    setError('');
    try {
      // 使用默认服务（端口5000）
      const response = await apiService.get('/data');
      setPort5000Data(response.data);
    } catch (err: any) {
      setError(`从端口5000获取数据失败: ${err.message}`);
      console.error('从端口5000获取数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 从端口8080获取数据（方式1：通过backendId参数）
  const fetchDataFromPort8080WithParam = async () => {
    setLoading(true);
    setError('');
    try {
      // 通过backendId参数指定使用8080端口服务
      const response = await apiService.get('/data', {}, BACKEND_IDS.PORT_8080);
      setPort8080Data(response.data);
    } catch (err: any) {
      setError(`从端口8080获取数据失败: ${err.message}`);
      console.error('从端口8080获取数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 从端口8080获取数据（方式2：直接使用api8080Service）
  const fetchDataFromPort8080Direct = async () => {
    setLoading(true);
    setError('');
    try {
      // 直接使用api8080Service，固定使用8080端口服务
      const response = await api8080Service.get('/data');
      setPort8080Data(response.data);
    } catch (err: any) {
      setError(`从端口8080获取数据失败: ${err.message}`);
      console.error('从端口8080获取数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>双后端API使用示例</Text>
      
      {/* API状态信息 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API服务状态</Text>
        {apiStatus && (
          <View style={styles.infoContainer}>
            <Text>初始化状态: {apiStatus.initialized ? '已初始化' : '未初始化'}</Text>
            <Text>后端服务数量: {apiStatus.backendsCount}</Text>
            <Text>默认后端ID: {apiStatus.defaultBackendId}</Text>
          </View>
        )}
      </View>

      {/* 端口5000数据 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>端口5000数据</Text>
        <Button 
          title="从端口5000获取数据" 
          onPress={fetchDataFromPort5000} 
          disabled={loading}
        />
        {port5000Data && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>响应数据:</Text>
            <Text>{JSON.stringify(port5000Data, null, 2)}</Text>
          </View>
        )}
      </View>

      {/* 端口8080数据 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>端口8080数据</Text>
        <View style={styles.buttonGroup}>
          <Button 
            title="方式1: 通过参数" 
            onPress={fetchDataFromPort8080WithParam} 
            disabled={loading}
          />
          <View style={styles.buttonSpacer} />
          <Button 
            title="方式2: 直接使用" 
            onPress={fetchDataFromPort8080Direct} 
            disabled={loading}
          />
        </View>
        {port8080Data && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>响应数据:</Text>
            <Text>{JSON.stringify(port8080Data, null, 2)}</Text>
          </View>
        )}
      </View>

      {/* 错误信息 */}
      {error !== '' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* 加载状态 */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Text>加载中...</Text>
        </View>
      )}
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
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoContainer: {
    marginTop: 8,
  },
  dataContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  dataTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  buttonSpacer: {
    width: 8,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#d32f2f',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
  },
});

export default DualBackendApiExample;