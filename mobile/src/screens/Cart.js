import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import EmptyCart from '../components/EmptyCart';

export default function Cart() {
  const { cart, removeItem, clearCart, adjustQuantity, updateQuantity } = useContext(CartContext);

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

  return ( // Tela do carrinho
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
                  <CartItem entry={item} index={index} onRemove={handleRemove} onAdjust={handleAdjust} onUpdate={handleUpdate} />
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
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%'
  },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#222' },
  itemPrice: { marginTop: 4, color: '#EB3738', fontWeight: '700' },
  removeButton: { backgroundColor: '#EB3738', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  clearButton: { backgroundColor: '#333', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginTop: 12, alignItems: 'center' },
});
