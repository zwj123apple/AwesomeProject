/**
 * 示例API模块
 * 演示如何使用不同端口的后端服务
 */

import { apiService, api8080Service } from '..';
import { BACKEND_IDS } from '../../config/apiConfig';
import { ApiResponse } from '../../types';

// 使用默认5000端口服务的API
export const getDataFromDefault = async () => {
  try {
    // 默认使用5000端口服务
    const response = await apiService.get('/data');
    return response.data;
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error;
  }
};

// 明确指定使用5000端口服务的API
export const getDataFrom5000 = async () => {
  try {
    // 明确指定使用5000端口服务
    const response = await apiService.get('/data', {}, BACKEND_IDS.PORT_5000);
    return response.data;
  } catch (error) {
    console.error('从5000端口获取数据失败:', error);
    throw error;
  }
};

// 使用8080端口服务的API (方式1：通过backendId参数)
export const getDataFrom8080 = async () => {
  try {
    // 通过backendId参数指定使用8080端口服务
    const response = await apiService.get('/data', {}, BACKEND_IDS.PORT_8080);
    return response.data;
  } catch (error) {
    console.error('从8080端口获取数据失败:', error);
    throw error;
  }
};

// 使用8080端口服务的API (方式2：直接使用api8080Service)
export const getDataFrom8080Direct = async () => {
  try {
    // 直接使用api8080Service，固定使用8080端口服务
    const response = await api8080Service.get('/data');
    return response.data;
  } catch (error) {
    console.error('从8080端口获取数据失败:', error);
    throw error;
  }
};

// 发送数据到8080端口服务
export const sendDataTo8080 = async (data: any) => {
  try {
    // 直接使用api8080Service发送数据
    const response = await api8080Service.post('/data', data);
    return response.data;
  } catch (error) {
    console.error('向8080端口发送数据失败:', error);
    throw error;
  }
};