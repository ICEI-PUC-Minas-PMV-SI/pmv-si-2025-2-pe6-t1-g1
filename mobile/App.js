import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext'; // Importando o Contexto

export default function App() {
  const [isServerUp, setIsServerUp] = useState(true);
  
  // SEU IP LOCAL
  const API_URL = 'http://192.168.15.14:7144/api/Hello/status';

  const checkServer = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(API_URL, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        setIsServerUp(true);
      } else {
        setIsServerUp(false);
      }
    } catch (error) {
      setIsServerUp(false);
    }
  };

  useEffect(() => {
    checkServer(); 
    const interval = setInterval(checkServer, 5000); 
    return () => clearInterval(interval); 
  }, []);

  return (
    /* O CartProvider precisa envolver toda a navegação para o estado ser global */
    <CartProvider>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          
          {!isServerUp && (
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineText}>
                🔴 Servidor não encontrado (Tentando conectar em 7144...)
              </Text>
            </View>
          )}

          <AppNavigator />
        </SafeAreaView>
      </PaperProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  offlineBanner: {
    backgroundColor: '#333',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    top: Platform.OS === 'android' ? 0 : 40,
    zIndex: 999,
  },
  offlineText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  }
});