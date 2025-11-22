import React from 'react';
import { SafeAreaView } from 'react-native';
import CadastroUsuario from './src/screens/CadastroUsuario'; // caminho correto

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CadastroUsuario />
    </SafeAreaView>
  );
}
