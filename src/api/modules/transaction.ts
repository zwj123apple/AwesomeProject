/**
 * 交易记录API模块
 * 提供交易记录相关的API请求
 */

import { apiService } from '..';

// 交易记录类型
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  description: string;
  status: string;
}

// 模拟交易数据
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2023-10-01',
    amount: 1000,
    type: '收入',
    description: '工资',
    status: '已完成'
  },
  {
    id: '2',
    date: '2023-10-05',
    amount: -200,
    type: '支出',
    description: '购物',
    status: '已完成'
  },
  {
    id: '3',
    date: '2023-10-10',
    amount: -150,
    type: '支出',
    description: '餐饮',
    status: '已完成'
  },
  {
    id: '4',
    date: '2023-10-15',
    amount: 500,
    type: '收入',
    description: '兼职',
    status: '已完成'
  },
  {
    id: '5',
    date: '2023-10-20',
    amount: -300,
    type: '支出',
    description: '交通',
    status: '已完成'
  },
  {
    id: '6',
    date: '2023-11-01',
    amount: 1000,
    type: '收入',
    description: '工资',
    status: '已完成'
  },
  {
    id: '7',
    date: '2023-11-10',
    amount: -400,
    type: '支出',
    description: '购物',
    status: '已完成'
  },
  {
    id: '8',
    date: '2023-11-15',
    amount: -100,
    type: '支出',
    description: '餐饮',
    status: '已完成'
  },
  {
    id: '9',
    date: '2023-11-20',
    amount: 300,
    type: '收入',
    description: '兼职',
    status: '已完成'
  },
  {
    id: '10',
    date: '2023-11-25',
    amount: -250,
    type: '支出',
    description: '交通',
    status: '已完成'
  }
];

// 响应类型
export interface TransactionResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

/**
 * 获取交易记录列表
 * @param startDate 开始日期 (YYYY-MM-DD)
 * @param endDate 结束日期 (YYYY-MM-DD)
 * @returns 交易记录列表
 */
export const getTransactions = async (startDate?: string, endDate?: string): Promise<TransactionResponse<Transaction[]>> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    // 如果没有提供日期筛选条件，返回所有交易记录
    if (!startDate && !endDate) {
      return {
        data: mockTransactions,
        success: true,
        message: '获取交易记录成功'
      };
    }
    
    // 根据日期筛选交易记录
    const filteredTransactions = mockTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      // 检查开始日期
      if (startDate) {
        const start = new Date(startDate);
        if (transactionDate < start) return false;
      }
      
      // 检查结束日期
      if (endDate) {
        const end = new Date(endDate);
        if (transactionDate > end) return false;
      }
      
      return true;
    });
    
    return {
      data: filteredTransactions,
      success: true,
      message: '获取交易记录成功'
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      message: '获取交易记录失败'
    };
  }
};

/**
 * 获取交易详情
 * @param id 交易ID
 * @returns 交易详情
 */
export const getTransactionDetail = async (id: string): Promise<TransactionResponse<Transaction | null>> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const transaction = mockTransactions.find(t => t.id === id);
    
    if (!transaction) {
      return {
        data: null,
        success: false,
        message: '交易记录不存在'
      };
    }
    
    return {
      data: transaction,
      success: true,
      message: '获取交易详情成功'
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: '获取交易详情失败'
    };
  }
};