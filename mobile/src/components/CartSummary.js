import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CartSummary({ total = 0, onClear }) {
  return (
    <View style={styles.container}>
      <Text style={styles.total}>Total: R$ {Number(total || 0).toFixed(2)}</Text>
      <TouchableOpacity style={styles.clearButton} onPress={onClear}>
        <Text style={styles.clearText}>Limpar carrinho</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16, width: '100%', alignItems: 'flex-end' },
  total: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  clearButton: { backgroundColor: '#333', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  clearText: { color: '#fff' }
});
