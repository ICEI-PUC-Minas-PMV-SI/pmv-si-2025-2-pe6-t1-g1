import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../components/Button';

export default function Orders({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = 'http://192.168.15.14:7144/api/orders';

  const fetchOrders = async () => {

    if (!global.userToken) {
      setLoading(false);
      setRefreshing(false);
      Alert.alert('Aviso', 'Faça login para ver seus pedidos.', [
        { text: 'Ir para Login', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${global.userToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.log('Erro ao buscar pedidos:', response.status);
      }
    } catch (error) {
      console.log('Erro de conexão:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const handleCancelOrder = async (orderId) => {
    Alert.alert(
      'Cancelar Pedido',
      'Tem certeza que deseja cancelar este pedido?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {

              const response = await fetch(`${API_URL}/${orderId}/status`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${global.userToken}`
                },
                body: JSON.stringify({ status: 'CANCELLED' })
              });

              if (response.ok) {
                Alert.alert('Sucesso', 'Pedido cancelado.');
                fetchOrders(); 

              } else {

                if (response.status === 403) {

                   Alert.alert('Erro', 'Não foi possível cancelar. Entre em contato com a pizzaria.');
                } else {
                   const errorData = await response.json();
                   Alert.alert('Erro', errorData.message || 'Erro ao cancelar.');
                }
              }
            } catch (error) {
              Alert.alert('Erro', 'Falha na conexão.');
            }
          }
        }
      ]
    );
  };

  const activeStatuses = ['PENDING', 'CONFIRMED', 'PREPARING'];
  const activeOrders = orders.filter(o => activeStatuses.includes(o.status?.toUpperCase()));
  const pastOrders = orders.filter(o => !activeStatuses.includes(o.status?.toUpperCase()));

  const renderOrderItem = ({ item }) => {
    const isPending = item.status?.toUpperCase() === 'PENDING';
    const statusColor = getStatusColor(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderNumber}>Pedido #{item.id}</Text>
          <Text style={styles.orderDate}>{new Date(item.orderDate).toLocaleDateString('pt-BR')}</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {translateStatus(item.status)}
          </Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.infoText}>Itens: {item.itemCount || item.items?.length || 0}</Text>
          <Text style={styles.totalText}>Total: R$ {item.totalAmount?.toFixed(2)}</Text>
        </View>

        {}
        {isPending && (
          <View style={styles.actions}>
            <Button 
              text="Cancelar" 
              size="small" 
              onPress={() => handleCancelOrder(item.id)}
              style={{ backgroundColor: '#666', marginTop: 0 }} 

            />
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#EB3738" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Pedidos</Text>

      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOrders(); }} />
        }
        data={null} 

        ListHeaderComponent={
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Em Andamento</Text>
            </View>
            {activeOrders.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum pedido em andamento.</Text>
            ) : (
              activeOrders.map(item => <View key={item.id}>{renderOrderItem({ item })}</View>)
            )}

            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
              <Text style={styles.sectionTitle}>Histórico</Text>
            </View>
            {pastOrders.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum pedido anterior.</Text>
            ) : (
              pastOrders.map(item => <View key={item.id}>{renderOrderItem({ item })}</View>)
            )}
          </>
        }
      />
    </View>
  );
}

function getStatusColor(status) {
  switch (status?.toUpperCase()) {
    case 'PENDING': return '#FFA500'; 

    case 'CONFIRMED': return '#1E90FF'; 

    case 'PREPARING': return '#8A2BE2'; 

    case 'READY': return '#32CD32'; 

    case 'DELIVERED': return '#228B22'; 

    case 'CANCELLED': return '#FF0000'; 

    default: return '#666';
  }
}

function translateStatus(status) {
  const map = {
    'PENDING': 'Pendente',
    'CONFIRMED': 'Confirmado',
    'PREPARING': 'Preparando',
    'READY': 'Pronto',
    'DELIVERED': 'Entregue',
    'CANCELLED': 'Cancelado',
  };
  return map[status?.toUpperCase()] || status;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EB3738',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    paddingBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  orderDate: {
    color: '#666',
    fontSize: 14,
  },
  statusContainer: {
    marginBottom: 8,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    color: '#555',
  },
  totalText: {
    fontWeight: 'bold',
    color: '#EB3738',
    fontSize: 16,
  },
  actions: {
    marginTop: 12,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  }
});
