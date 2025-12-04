import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';

export default function CadastroUsuario({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://rosann-nonbiological-loyce.ngrok-free.dev/api/user';

  const handleRegister = async () => {
    // Validações
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    const data = { name, email, phone, password };
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          'Sucesso!',
          'Usuário cadastrado com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Limpa campos
                setName('');
                setEmail('');
                setPhone('');
                setPassword('');
                setConfirmPassword('');
                // Navega para login ou home
                navigation?.navigate('Login');
              },
            },
          ]
        );
      } else {
        Alert.alert('Erro', result.message || 'Erro ao cadastrar usuário.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na conexão com o servidor.');
      console.error('Erro ao cadastrar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cadastro de Usuário</Text>
        <Text style={styles.subtitle}>Crie sua conta na Pizzaria</Text>

        <View style={styles.form}>
          <Input
            label="Nome Completo"
            placeholder="Digite seu nome"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

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
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            mode="outlined"
            style={styles.input}
          />

          <Input
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />

          <Input
            label="Confirmar Senha"
            placeholder="Digite a senha novamente"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />

          <View style={styles.buttonContainer}>
            <Button
              text={loading ? 'Cadastrando...' : 'Cadastrar'}
              size="large"
              onPress={handleRegister}
              disabled={loading}
            />
          </View>

          <Text style={styles.loginText}>
            Já tem uma conta?{' '}
            <Text
              style={styles.loginLink}
              onPress={() => navigation?.navigate('Login')}
            >
              Faça login
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EB3738',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  loginText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#EB3738',
    fontWeight: 'bold',
  },
});
