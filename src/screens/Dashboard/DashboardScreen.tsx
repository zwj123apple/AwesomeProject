import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ROUTES, RootStackParamList } from '../../navigation/routes';

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  type HomeNavigationProp = NavigationProp<RootStackParamList, 'HomeScreen'>;
  const navigation = useNavigation<HomeNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
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
          onPress={() => navigation.navigate('HomeScreen', { screen: 'Transaction' })}
        >
          <Text style={styles.cardTitle}>交易记录</Text>
          <Text style={styles.cardText}>查看您的所有交易记录</Text>
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