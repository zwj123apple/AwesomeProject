import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface ErrorMessageProps {
  message: string;
  style?: ViewStyle;
}

/**
 * 错误信息展示组件
 * 用于在表单或其他位置统一展示错误信息
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, style }) => {
  if (!message) return null;
  
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFEBEE',
    borderRadius: 4,
    padding: 6,
    marginTop: 2,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  text: {
    color: '#D32F2F',
    fontSize: 14,
  },
});

export default ErrorMessage;