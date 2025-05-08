import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';

const UserInfoScreen = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>个人信息</Text>
          <Text style={styles.message}>请先登录以查看个人信息</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>个人信息</Text>
        
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>用户名</Text>
            <TextInput
              style={styles.input}
              value={user.username}
              editable={false}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>姓名</Text>
            <TextInput
              style={styles.input}
              value={user.name}
              editable={false}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>邮箱</Text>
            <TextInput
              style={styles.input}
              value={user.email || ''}
              editable={false}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>用户ID</Text>
            <TextInput
              style={styles.input}
              value={user.id}
              editable={false}
            />
          </View>
        </View>
        
        <Button
          title="编辑个人信息"
          onPress={() => {}}
          style={styles.button}
        />
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
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    color: '#666666',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#F5F5F5',
  },
  button: {
    marginTop: 8,
    marginBottom: 32,
  },
});

export default UserInfoScreen;