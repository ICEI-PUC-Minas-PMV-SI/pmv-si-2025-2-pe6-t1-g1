import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

export default function ItemCard({ item, onPress }) {
  const titulo = item.nameItem || item.name || item.title || 'Item';
  const descricao = item.description || item.descricao || '';
  const categoria = item.category || '';
  const preco = item.value != null ? item.value : (item.price != null ? item.price : null);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => onPress && onPress(item)}>
      {item.image ? <Image source={{ uri: item.image }} style={styles.cardImage} /> : null}
      <View style={styles.cardBody}>
        <Text style={styles.itemTitle}>{titulo}</Text>
        {categoria ? <Text style={styles.itemCategory}>Categoria: {categoria}</Text> : null}
        {descricao ? <Text style={styles.itemDesc}>{descricao}</Text> : null}
        {preco !== null ? <Text style={styles.itemPrice}>R$ {preco}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  cardBody: { flex: 1 },
  itemTitle: { fontSize: 18, fontWeight: '600', color: '#222' },
  itemCategory: { fontSize: 13, color: '#777', marginTop: 4 },
  itemDesc: { fontSize: 14, color: '#666', marginTop: 4 },
  itemPrice: { marginTop: 8, fontSize: 15, fontWeight: '700', color: '#EB3738' },
});
