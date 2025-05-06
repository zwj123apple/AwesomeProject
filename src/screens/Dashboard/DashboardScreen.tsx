import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ROUTES, RootStackParamList } from '../../navigation/routes';
import { StackNavigationProp } from '@react-navigation/stack';

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  // 使用StackNavigationProp而不是NavigationProp以获得更精确的类型检查
  type DashboardNavigationProp = StackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<DashboardNavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>首页</Text>
        <Text style={styles.subtitle}>欢迎使用我们的应用</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>公告</Text>
          <Text style={styles.cardText}>这是首页内容，无需登录即可访问。</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>最新活动</Text>
          <Text style={styles.cardText}>参与我们的最新活动，获取更多奖励！</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Transaction')}
        >
          <Text style={styles.cardTitle}>交易记录</Text>
          <Text style={styles.cardText}>查看您的所有交易记录</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('AssetAnalysis')}
        >
          <Text style={styles.cardTitle}>资产分析</Text>
          <Text style={styles.cardText}>查看您的资产分布和趋势分析</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('IncomeAnalysis')}
        >
          <Text style={styles.cardTitle}>收益分析</Text>
          <Text style={styles.cardText}>查看您的产品收益情况和趋势</Text>
        </TouchableOpacity>
        
        {user && (
          <View style={styles.userSection}>
            <Text style={styles.welcomeText}>欢迎您，{user.name}</Text>
            <Button 
              title="退出登录" 
              onPress={logout} 
              type="outline"
              style={styles.logoutButton}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    maxWidth: 500,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  cardText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  userSection: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  logoutButton: {
    width: '100%',
  },
});

export default DashboardScreen;