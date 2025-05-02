import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import transactionService from '../../services/transaction.service';
import Button from '../../components/common/Button';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  description: string;
  status: string;
}

const TransactionScreen = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // 初始加载所有交易记录
  useEffect(() => {
    fetchTransactions();
  }, []);

  // 获取交易记录
  const fetchTransactions = async (start?: string, end?: string) => {
    setLoading(true);
    try {
      const response = await transactionService.getTransactions(start, end);
      if (response.success) {
        setTransactions(response.data);
      } else {
        console.error('获取交易记录失败:', response.message);
      }
    } catch (error) {
      console.error('获取交易记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理查询按钮点击
  const handleSearch = () => {
    const formattedStartDate = startDate ? formatDate(startDate) : undefined;
    const formattedEndDate = endDate ? formatDate(endDate) : undefined;
    fetchTransactions(formattedStartDate, formattedEndDate);
  };

  // 日期格式化函数
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 显示日期选择器
  const showDatePicker = (type: 'start' | 'end') => {
    if (type === 'start') {
      setShowStartPicker(true);
    } else {
      setShowEndPicker(true);
    }
  };

  // 处理日期变更
  const onDateChange = (event: any, selectedDate?: Date, type?: 'start' | 'end') => {
    if (type === 'start') {
      setShowStartPicker(false);
      if (selectedDate) {
        setStartDate(selectedDate);
      }
    } else {
      setShowEndPicker(false);
      if (selectedDate) {
        setEndDate(selectedDate);
      }
    }
  };

  // 渲染交易记录项
  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionDate}>{item.date}</Text>
        <Text style={[styles.transactionAmount, { color: item.amount > 0 ? '#4CAF50' : '#F44336' }]}>
          {item.amount > 0 ? `+${item.amount}` : item.amount}
        </Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionStatus}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>交易记录</Text>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.filterLabel}>开始日期:</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => showDatePicker('start')}
          >
            <Text style={styles.dateText}>
              {startDate ? formatDate(startDate) : '选择开始日期'}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => onDateChange(event, date, 'start')}
            />
          )}
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.filterLabel}>结束日期:</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => showDatePicker('end')}
          >
            <Text style={styles.dateText}>
              {endDate ? formatDate(endDate) : '选择结束日期'}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => onDateChange(event, date, 'end')}
            />
          )}
        </View>

        <Button 
          title="查询" 
          onPress={handleSearch} 
          style={styles.searchButton}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>暂无交易记录</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  dateContainer: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  dateText: {
    fontSize: 14,
    color: '#333333',
  },
  searchButton: {
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666',
  },
  listContainer: {
    padding: 16,
  },
  transactionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
    color: '#4CAF50',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
});

export default TransactionScreen;