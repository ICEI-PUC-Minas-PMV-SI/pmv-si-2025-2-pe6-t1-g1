import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function CadastroUsuario() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'

  const API_URL = 'https://192.168.0.3:7144/api/user'; // seu IP da API

  const handleRegister = async () => {
    // Limpa a mensagem
    setMessage('');
    setMessageType('');

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem!');
      setMessageType('error');
      return;
    }

    const data = { name, email, phone, password };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage('Usuário cadastrado com sucesso!');
        setMessageType('success');
        // limpa campos
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
      } else {
        const err = await response.json();
        setMessage(err.message || 'Erro ao cadastrar.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Falha na conexão com o servidor.');
      setMessageType('error');
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      {message !== '' && (
        <Text style={[styles.msg, messageType === 'error' ? styles.error : styles.success]}>
          {message}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#A00000',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: '#FFD500',
    borderRadius: 8,
    backgroundColor: '#E8F0FE',
  },
  button: {
    width: '100%',
    backgroundColor: '#FF0000',
    padding: 12,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  msg: {
    marginTop: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  },
});
