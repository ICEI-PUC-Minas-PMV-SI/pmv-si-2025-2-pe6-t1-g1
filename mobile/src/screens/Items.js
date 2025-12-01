import React, { useEffect, useState, useMemo, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import ItemCard from '../components/ItemCard';
import CategoryBar from '../components/CategoryBar';
import ItemModal from '../components/ItemModal';
import { CartContext } from '../context/CartContext';

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { addItem } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // URL da API - ajuste conforme necessário
  const API_URL = `http://192.168.15.14:7144/api/Items`;

  useEffect(() => {
    let mounted = true;

    async function fetchItems() { // Busca itens da API
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(API_URL);
        if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
        const data = await resp.json();
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err.message || 'Erro ao buscar itens');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchItems();
    return () => (mounted = false);
  }, [API_URL]);

  const categories = useMemo(() => { // Extrai categorias únicas dos itens
    const s = new Set(items.map(i => (i.category || '').trim()).filter(Boolean));
    return ['Todos', ...Array.from(s)];
  }, [items]);

  const filteredItems = useMemo(() => { // Filtra itens pela categoria selecionada
    if (!selectedCategory || selectedCategory === 'Todos') return items;
    return items.filter(i => (i.category || '').trim() === selectedCategory);
  }, [items, selectedCategory]);

  function renderItem({ item }) {
    return <ItemCard item={item} onPress={(it) => { setSelectedItem(it); setModalVisible(true); }} />;
  }

  // addToCart handled via CartContext in ItemModal onAdd

  return ( // Tela principal
    <View style={styles.container}>
      <Text style={styles.title}>Cardápio</Text>
      <Text style={styles.subtitle}>Lista de itens disponíveis</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#EB3738" style={{ marginTop: 20 }} />
      ) : error ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: '#c00' }}>Falha ao carregar itens:</Text>
          <Text style={{ color: '#666' }}>{error}</Text>
          <Text style={{ color: '#666', marginTop: 8 }}>
            Verifique se a API está rodando e acessível pelo emulador/dispositivo.
          </Text>
        </View>
      ) : (
        <>
          <CategoryBar categories={categories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />

          <FlatList
            style={{ width: '100%', marginTop: 12 }}
            contentContainerStyle={{ paddingBottom: 40 }}
            data={filteredItems}
            keyExtractor={(item, index) => (item.id ? String(item.id) : String(index))}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={{ color: '#666' }}>Nenhum item encontrado.</Text>}
          />
        </>
      )}

      <ItemModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => { setModalVisible(false); setSelectedItem(null); }}
        onAdd={(it) => { addItem(it); const title = it.name || it.nameItem || it.title || 'Item'; Alert.alert('Carrinho', `${title} adicionado ao carrinho.`); setModalVisible(false); setSelectedItem(null); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
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
  cardBody: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  itemDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemPrice: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#EB3738',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: '#555',
  },
  modalPrice: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#EB3738',
  },
  modalCloseButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  modalActionButton: {
    backgroundColor: '#EB3738',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  modalActionText: {
    color: '#fff',
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  categoryPill: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryPillActive: {
    backgroundColor: '#EB3738',
    borderColor: '#EB3738',
  },
  categoryText: {
    color: '#444',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
