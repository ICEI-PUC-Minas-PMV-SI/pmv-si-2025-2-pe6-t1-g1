import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import EmptyCart from '../components/EmptyCart';
import Button from '../components/Button';

export default function Cart({ navigation }) {
  const { cart, removeItem, clearCart, adjustQuantity, updateQuantity } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://192.168.15.14:7144/api/orders';

  const total = cart.reduce((s, entry) => {
    const p = entry.product || entry;
    const qty = entry.quantity != null ? Number(entry.quantity) : 1;
    const price = p && (p.value != null ? Number(p.value) : (p.price != null ? Number(p.price) : 0));
    return s + (isNaN(price) ? 0 : price * (isNaN(qty) ? 1 : qty));
  }, 0);

  function handleRemove(index) {
    removeItem(index);
  }

  function handleAdjust(index, delta) {
    adjustQuantity(index, delta);
  }

  function handleUpdate(index, qty) {
    updateQuantity(index, qty);
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione itens antes de finalizar.');
      return;
    }

    if (!global.userToken) {
      Alert.alert('Erro', 'Sessão expirada. Por favor, faça login novamente.', [
        { text: 'Ir para Login', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }

    setLoading(true);

    try {
      console.log('Enviando pedido para:', API_URL);

      const itemsToSend = cart.map(entry => {

        const prod = entry.product || entry;
        return {
          ItemId: prod.id,
          Quantity: entry.quantity || 1
        };
      });

      console.log('Itens sendo enviados:', itemsToSend);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${global.userToken}`
        },
        body: JSON.stringify(itemsToSend) 

      });

      const responseText = await response.text();
      console.log('Status:', response.status);
      console.log('Resposta:', responseText);

      if (response.ok) {
        Alert.alert('Sucesso!', 'Pedido realizado com sucesso!', [
          {
            text: 'Ver Pedidos',
            onPress: () => {
              clearCart();
              navigation.navigate('Orders');
            }
          }
        ]);
      } else {
        let errorMessage = 'Tente novamente.';
        try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || responseText;
        } catch (e) {
            errorMessage = responseText || `Erro ${response.status}`;
        }

        Alert.alert('Erro ao finalizar', errorMessage);
      }
    } catch (error) {
      console.log('Erro de exceção:', error);
      Alert.alert('Erro', 'Falha na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho</Text>
      <Text style={styles.subtitle}>Seus itens selecionados</Text>

      {cart.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <FlatList
            style={{ width: '100%', marginTop: 12 }}
            data={cart}
            keyExtractor={(item, idx) => String(idx)}
            renderItem={({ item, index }) => (
              <CartItem 
                entry={item} 
                index={index} 
                onRemove={handleRemove} 
                onAdjust={handleAdjust} 
                onUpdate={handleUpdate} 
              />
            )}
          />

          <CartSummary
            total={total}
            onClear={() => {
              Alert.alert('Limpar carrinho', 'Deseja remover todos os itens?', [
                { text: 'Não' },
                { text: 'Sim', onPress: () => clearCart() },
              ]);
            }}
          />

          <View style={styles.checkoutContainer}>
            <Button 
              text={loading ? "Enviando..." : "Finalizar Pedido"}
              size="large"
              onPress={handleCheckout}
              disabled={loading}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EB3738',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  checkoutContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center'
  }
});
