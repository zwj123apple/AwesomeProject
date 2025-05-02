import React from 'react';
import { View, Text, StyleSheet, Modal as RNModal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Button from './Button';

interface ModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  type?: 'info' | 'success' | 'warning' | 'error';
}

/**
 * 自定义弹出框组件
 * 用于展示提示信息、确认操作或错误信息
 */
const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  message,
  onClose,
  confirmText = '确定',
  cancelText,
  onConfirm,
  type = 'info',
}) => {
  // 根据类型设置不同的标题颜色
  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return '#4CD964';
      case 'warning':
        return '#FF9500';
      case 'error':
        return '#FF3B30';
      default:
        return '#007AFF';
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {title && (
                <Text style={[styles.title, { color: getTitleColor() }]}>{title}</Text>
              )}
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttonContainer}>
                {cancelText && (
                  <Button
                    title={cancelText}
                    onPress={onClose}
                    type="outline"
                    style={StyleSheet.flatten(styles.button)}
                  />
                )}
                <Button
                  title={confirmText}
                  onPress={onConfirm || onClose}
                  style={StyleSheet.flatten(cancelText ? [styles.button, styles.confirmButton] : styles.button)}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  confirmButton: {
    marginLeft: 10,
  },
});

export default Modal;