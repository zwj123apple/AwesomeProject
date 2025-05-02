import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Input, Button, ErrorMessage, Modal, ErrorModal } from '../../components/common';
import { ROUTES } from '../../navigation/routes';
import { ApiError, handleApiError } from '../../services/apiErrorHandler';

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{username?: string; password?: string}>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'}>(
    {title: '', message: '', type: 'info'}
  );
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  
  const { login } = useAuth();

  const validate = () => {
    const newErrors: {username?: string; password?: string} = {};
    
    if (!username) {
      newErrors.username = '请输入用户名';
    }
    
    if (!password) {
      newErrors.password = '请输入密码';
    } else if (password.length < 6) {
      newErrors.password = '密码长度至少为6位';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const result = await login(username, password);
      if (result.success) {
        // 登录成功后，返回到主导航
        navigation.navigate('Main');
      } else {
        // 处理API错误
        const error = handleApiError(result.error);
        setApiError(error);
        setErrorModalVisible(true);
      }
    } catch (error) {
      // 处理未预期的错误
      const apiError = handleApiError(error);
      setApiError(apiError);
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>欢迎回来</Text>
        <Text style={styles.subtitle}>请登录您的账号</Text>
        
        <View style={styles.form}>
          <Input
            label="用户名"
            value={username}
            onChangeText={setUsername}
            placeholder="请输入用户名"
            error={errors.username}
          />
          
          <Input
            label="密码"
            value={password}
            onChangeText={setPassword}
            placeholder="请输入密码"
            secureTextEntry
            error={errors.password}
          />
          
          <Button
            title="登录"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />
        </View>
        
        <Modal
          visible={modalVisible}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          onClose={() => setModalVisible(false)}
        />
        
        <ErrorModal
          visible={errorModalVisible}
          error={apiError}
          onClose={() => setErrorModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
    marginBottom: 32,
  },
  form: {
    marginTop: 16,
  },
  loginButton: {
    marginTop: 24,
    width: '100%',
  },
});

export default LoginScreen;