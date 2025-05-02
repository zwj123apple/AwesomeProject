import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { AuthProvider } from './src/hooks/useAuth';
import AppNavigator from './src/navigation';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <AppNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
}

export default App;
