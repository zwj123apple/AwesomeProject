import React, { useEffect } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { AuthProvider } from './src/hooks/useAuth';
import AppNavigator from './src/navigation';
import { GlobalErrorHandler } from './src/components/common';
import { apiService } from './src/api/service';
import {API_BACKENDS, DEFAULT_BACKEND_ID } from './src/config/apiConfig';

function App(): React.JSX.Element {
  // 初始化API服务
  useEffect(() => {
    apiService.initialize(API_BACKENDS, DEFAULT_BACKEND_ID);
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <AppNavigator />
          <GlobalErrorHandler />
        </SafeAreaView>
      </AuthProvider>
    </Provider>
  );
}

export default App;
