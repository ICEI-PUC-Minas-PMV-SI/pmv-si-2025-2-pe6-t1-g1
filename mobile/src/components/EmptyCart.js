import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyCart({ message = 'Seu carrinho está vazio.' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', marginTop: 16 },
  text: { color: '#666' }
});
