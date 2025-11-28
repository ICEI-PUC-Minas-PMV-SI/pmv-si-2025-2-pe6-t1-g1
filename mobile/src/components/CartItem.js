import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function CartItem({ entry, index, onRemove, onAdjust, onUpdate }) {
  const item = entry && entry.product ? entry.product : entry;
  const qty = entry && entry.quantity != null ? entry.quantity : 1;
  const title = item.nameItem || item.name || item.title || 'Item';
  const price = item.value != null ? Number(item.value) : (item.price != null ? Number(item.price) : null);

  return (
    <View style={styles.row}>
      {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {price !== null ? <Text style={styles.price}>R$ {price.toFixed(2)}</Text> : null}
      </View>

      <View style={{ alignItems: 'center', marginRight: 8 }}>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyButton} onPress={() => onAdjust && onAdjust(index, -1)}>
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{qty}</Text>
          <TouchableOpacity style={styles.qtyButton} onPress={() => onAdjust && onAdjust(index, +1)}>
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.remove} onPress={() => onRemove && onRemove(index)}>
        <Text style={styles.removeText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%'
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#eee'
  },
  body: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#222' },
  price: { marginTop: 4, color: '#EB3738', fontWeight: '700' },
  remove: { backgroundColor: '#EB3738', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  removeText: { color: '#fff' }
  ,
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: { backgroundColor: '#eee', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  qtyText: { fontSize: 18, fontWeight: '700' },
  qtyValue: { marginHorizontal: 8, minWidth: 20, textAlign: 'center' }
});
