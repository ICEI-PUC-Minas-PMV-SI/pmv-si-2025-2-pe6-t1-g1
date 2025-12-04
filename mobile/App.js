import React from 'react';
// 1. Importe o SafeAreaProvider
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    // 2. Envolva tudo com o SafeAreaProvider
    <SafeAreaProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}