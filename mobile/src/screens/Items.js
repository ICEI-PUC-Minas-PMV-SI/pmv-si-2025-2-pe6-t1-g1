import React, { useEffect, useState, useMemo, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import ItemCard from '../components/ItemCard';
import CategoryBar from '../components/CategoryBar';
import ItemModal from '../components/ItemModal';
import { CartContext } from '../context/CartContext';
// 1. IMPORTANTE: Importar AsyncStorage para pegar o token
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { addItem } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // URL da API (Use a mesma que está funcionando no resto do app)
  const API_URL = `https://rosann-nonbiological-loyce.ngrok-free.dev/api`;

  useEffect(() => {
    let mounted = true;

    async function fetchItems() { 
      setLoading(true);
      setError(null);
      try {
        // Busca os itens (ENDPOINT PÚBLICO OU PROTEGIDO)
        // Se precisar de token aqui, adicione o header Authorization
        const resp = await fetch(`${API_URL}/Items`);
        
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

  const categories = useMemo(() => { 
    const s = new Set(items.map(i => (i.category || '').trim()).filter(Boolean));
    return ['Todos', ...Array.from(s)];
  }, [items]);

  const filteredItems = useMemo(() => { 
    if (!selectedCategory || selectedCategory === 'Todos') return items;
    return items.filter(i => (i.category || '').trim() === selectedCategory);
  }, [items, selectedCategory]);

  function renderItem({ item }) {
    return <ItemCard item={item} onPress={(it) => { setSelectedItem(it); setModalVisible(true); }} />;
  }

  // --- 2. NOVA FUNÇÃO: SALVAR NO BANCO DE DADOS ---
  const addItemToBackend = async (item, quantity = 1) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
            // Se não tiver token, o usuário não está logado.
            // Opcional: Alertar que precisa logar ou salvar apenas localmente.
            console.log("Usuário não logado, item salvo apenas localmente.");
            return; 
        }

        // Chama o endpoint que criamos no CartController
        const response = await fetch(`${API_URL}/cart/item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                itemId: item.id || item.Id, // Garante que pega o ID certo
                quantity: quantity
            })
        });

        if (!response.ok) {
            console.log("Erro ao salvar no banco:", response.status);
        } else {
            console.log("Item salvo no banco com sucesso!");
        }

    } catch (error) {
        console.error("Erro de conexão ao adicionar item:", error);
    }
  };
  // ----------------------------------------------------

  return ( 
    <View style={styles.container}>
      <Text style={styles.title}>Cardápio</Text>
      <Text style={styles.subtitle}>Lista de itens disponíveis</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#EB3738" style={{ marginTop: 20 }} />
      ) : error ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: '#c00' }}>Falha ao carregar itens:</Text>
          <Text style={{ color: '#666' }}>{error}</Text>
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
        
        // --- 3. MUDANÇA AQUI NO onAdd ---
        onAdd={async (it, qty = 1) => { // Aceita quantidade se o modal passar
            // 1. Atualiza Visual (Contexto)
            addItem(it); 
            
            // 2. Atualiza Banco (API) - O SEGREDO DO SUCESSO
            await addItemToBackend(it, qty); 

            const title = it.name || it.nameItem || it.title || 'Item';
            Alert.alert('Carrinho', `${title} adicionado ao carrinho.`);
            setModalVisible(false);
            setSelectedItem(null);
        }}
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
  // ... (o resto dos seus estilos continua igual)
});