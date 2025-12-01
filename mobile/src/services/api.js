import { Platform } from 'react-native';

// CONFIGURAÇÃO DA API
// Se estiver no Emulador Android: use 'http://10.0.2.2:7144/api'
// Se estiver no Celular físico: use o IP da sua máquina (ex: https://192.168.15.10:7144/api)
// Se estiver na Web: use 'https://localhost:7144/api'

const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'https://localhost:7144/api'; 
  }
  
  // COLOQUE AQUI O IP DA SUA MÁQUINA ONDE A API ESTÁ RODANDO
  // Para descobrir o IP no Windows, abra o terminal e digite: ipconfig
  // Procure por IPv4 Address (Endereço IPv4)
  // Certifique-se de usar HTTPS e a porta correta (7144)
  
  return 'https://192.168.15.1:7144/api'; // <--- VERIFIQUE SE ESTE É O SEU IP ATUAL
};

export const API_URL = getBaseUrl();

export const getHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};