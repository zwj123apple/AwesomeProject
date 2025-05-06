import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ErrorModal from './ErrorModal';
import { RootState } from '../../store';
import { setGlobalError } from '../../store/slices/uiSlice';
import { ApiError } from '../../services/apiErrorHandler';

/**
 * 全局API错误处理组件
 * 用于统一展示后端API错误信息
 */
const GlobalErrorHandler: React.FC = () => {
  const dispatch = useDispatch();
  const globalError = useSelector((state: RootState) => state.ui.globalError);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (globalError) {
      // 创建ApiError对象
      const apiError: ApiError = {
        code: 'API_ERROR',
        message: globalError,
        details: null,
      };
      setError(apiError);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [globalError]);

  const handleClose = () => {
    setVisible(false);
    // 清除全局错误状态
    dispatch(setGlobalError(null));
  };

  return (
    <ErrorModal
      visible={visible}
      error={error}
      onClose={handleClose}
    />
  );
};

export default GlobalErrorHandler;