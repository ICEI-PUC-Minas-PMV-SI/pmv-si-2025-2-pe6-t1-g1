import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Importante para recarregar ao voltar para tela
import { CartContext } from '../context/CartContext';
import CartSummary from '../components/CartSummary';
import EmptyCart from '../components/EmptyCart';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cart({ navigation }) {
  // Contexto para ações locais (limpar visualmente)
  const { clearCart } = useContext(CartContext); 
  
  // Estado para armazenar os itens VINDOS DA API (A verdade absoluta)
  const [serverItems, setServerItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'https://rosann-nonbiological-loyce.ngrok-free.dev/api';

  // --- BUSCAR CARRINHO REAL DA API ---
  const fetchServerCart = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Chama o GET que seu colega criou: CartController -> GetUserCart
      const response = await fetch(`${API_BASE}/cart`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setServerItems(data); // Salva os dados do banco no estado da tela
      } else {
        console.log("Erro ao buscar carrinho do banco:", response.status);
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
    } finally {
      setLoading(false);
    }
  };

  // Recarrega sempre que a tela ganha foco (ex: usuário voltou do cardápio)
  useFocusEffect(
    useCallback(() => {
      fetchServerCart();
    }, [])
  );

  // Calcula o total baseado nos dados DO SERVIDOR
  const total = serverItems.reduce((sum, item) => {
    // Nota: O backend retorna 'totalPrice' pronto ou calculamos:
    return sum + (item.totalPrice || (item.itemPrice * item.quantity));
  }, 0);

  // --- FINALIZAR PEDIDO ---
  const handleCheckout = async () => {
    if (serverItems.length === 0) {
      Alert.alert('Carrinho vazio', 'O banco de dados não registrou nenhum item.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      // POST /orders (O backend lê a tabela UserCarts que acabamos de confirmar que tem itens)
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}) 
      });

      if (response.ok) {
        Alert.alert('Sucesso!', 'Pedido realizado!', [
          { text: 'OK', onPress: () => {
              setServerItems([]); // Limpa lista visual
              clearCart(); // Limpa contexto global
              navigation.navigate('Orders'); 
          }}
        ]);
      } else {
        const txt = await response.text();
        Alert.alert('Erro', txt);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na conexão.');
    } finally {
      setLoading(false);
    }
  };

  // --- FUNÇÃO PARA REMOVER ITEM (DO BANCO) ---
  const handleRemoveItem = async (cartItemId) => {
      try {
        const token = await AsyncStorage.getItem('token');
        // DELETE api/cart/item/{id}
        await fetch(`${API_BASE}/cart/item/${cartItemId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchServerCart(); // Recarrega a lista
      } catch (error) {
          Alert.alert("Erro", "Não foi possível remover.");
      }
  };

  if (loading) {
      return <View style={styles.center}><ActivityIndicator size="large" color="#EB3738"/></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho (Banco de Dados)</Text>
      
      {serverItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <FlatList
            style={{ width: '100%', marginTop: 12 }}
            data={serverItems}
            keyExtractor={(item) => String(item.id)} // ID do item no carrinho
            renderItem={({ item }) => (
              // Renderização simples para testar
              <View style={styles.cartItem}>
                  <View style={{flex: 1}}>
                    <Text style={{fontWeight: 'bold'}}>{item.itemName}</Text>
                    <Text>Qtd: {item.quantity} | Total: R$ {item.totalPrice?.toFixed(2)}</Text>
                  </View>
                  <Button text="X" size="small" onPress={() => handleRemoveItem(item.id)} style={{width: 40, backgroundColor: '#999'}}/>
              </View>
            )}
          />

          <CartSummary total={total} onClear={() => {/* Lógica de limpar tudo opcional */}} />

          <View style={styles.checkoutContainer}>
            <Button 
              text="Finalizar Pedido"
              size="large"
              onPress={handleCheckout}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#EB3738', marginBottom: 8 },
  cartItem: { flexDirection: 'row', backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, alignItems: 'center', width: '100%' },
  checkoutContainer: { width: '100%', marginTop: 20, marginBottom: 10, alignItems: 'center' }
});