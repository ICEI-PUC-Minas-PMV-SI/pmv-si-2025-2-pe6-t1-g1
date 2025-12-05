import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Input from '../components/Input'; // Certifique-se que o caminho está certo
import Button from '../components/Button'; // Certifique-se que o caminho está certo
import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- Importe isso

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- CORREÇÃO 1: A URL BASE ---
  // A URL deve apontar para o endpoint de LOGIN, não de Items
  const API_URL = 'https://rosann-nonbiological-loyce.ngrok-free.dev/api/User/login';

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha email e senha.');
      return;
    }

    setLoading(true);

    try {
      console.log("Tentando login em:", API_URL); // Log para debug

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log("Status:", response.status); // Log para ver se é 200, 401 ou 404

      if (response.ok) {
        const data = await response.json();
        
        // --- CORREÇÃO 2: USAR ASYNCSTORAGE ---
        // A tela de Perfil procura no AsyncStorage, não no global
        await AsyncStorage.setItem('token', data.token);
        
        // Salvamos o ID também para usar no Perfil
        // Verifique se o seu backend retorna 'user.id' ou 'user.Id'
        const userId = data.user.id || data.user.Id; 
        await AsyncStorage.setItem('userId', userId.toString());

        // Navega para a tela principal (Home/Main)
        // Certifique-se que 'Main' está registrado no seu AppNavigator
        navigation.replace('Main'); 
      } else {
        Alert.alert('Erro', 'Credenciais inválidas. Tente novamente.');
      }
    } catch (error) {
      console.log('Erro de conexão:', error);
      Alert.alert('Erro', 'Falha ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <View style={styles.form}>
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
          />

          <Input
            label="Senha"
            placeholder="Sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />

          <View style={styles.buttonContainer}>
            <Button
              text={loading ? 'Entrando...' : 'Entrar'}
              onPress={handleLogin}
              disabled={loading}
              size="large"
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('CadastroUsuario')}>
              <Text style={styles.link}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EB3738',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 16,
  },
  link: {
    color: '#EB3738',
    fontWeight: 'bold',
    fontSize: 16,
  },
});