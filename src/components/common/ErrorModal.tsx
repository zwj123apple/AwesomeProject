import React from 'react';
import Modal from './Modal';
import { ApiError, getFriendlyErrorMessage } from '../../services/apiErrorHandler';

interface ErrorModalProps {
  visible: boolean;
  error: ApiError | null;
  onClose: () => void;
}

/**
 * API错误弹窗组件
 * 用于统一展示API错误信息
 */
const ErrorModal: React.FC<ErrorModalProps> = ({ visible, error, onClose }) => {
  if (!error) return null;

  // 获取友好的错误消息
  const errorMessage = getFriendlyErrorMessage(error);
  
  // 根据错误类型设置标题
  const getErrorTitle = () => {
    if (error.status === 401 || error.code === 'UNAUTHORIZED') {
      return '登录失效';
    }
    
    if (error.status === 403 || error.code === 'FORBIDDEN') {
      return '权限不足';
    }
    
    if (error.status === 404 || error.code === 'NOT_FOUND') {
      return '资源不存在';
    }
    
    if (error.status === 0 || error.code === 'NETWORK_ERROR') {
      return '网络错误';
    }
    
    return '操作失败';
  };

  return (
    <Modal
      visible={visible}
      title={getErrorTitle()}
      message={errorMessage}
      onClose={onClose}
      type="error"
    />
  );
};

export default ErrorModal;