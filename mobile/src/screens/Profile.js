import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  TextInput, Button, Text, Avatar, Card, IconButton, 
  Portal, Modal, ActivityIndicator, Provider 
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ URL DO NGROK
const API_URL = 'https://rosann-nonbiological-loyce.ngrok-free.dev/api'; 

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  
  // Dados do Usuário
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });

  // Dados dos Endereços
  const [addresses, setAddresses] = useState([]);

  // Controle do Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  const [addrForm, setAddrForm] = useState({
    street: '', number: '', zipCode: '', city: '', state: '', complement: '', neighborhood: ''
  });

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
        Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
        window.location.href = '/frontend/LoginScreen/index.html#'; 
        return null; 
    }
    return token;
  };

  // --- MUDANÇA PRINCIPAL AQUI ---
  const loadProfile = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      let id = await AsyncStorage.getItem('userId'); 
      if (!id) id = "1";
      setUserId(id);

      // 1. BUSCAR DADOS DO USUÁRIO (/me)
      const userResponse = await fetch(`${API_URL}/User/me`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserData({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role
        });
      }

      // 2. BUSCAR ENDEREÇOS SEPARADAMENTE (/addresses)
      // Aqui usamos o endpoint novo que você criou no C#
      const addressResponse = await fetch(`${API_URL}/User/addresses`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (addressResponse.ok) {
        const addressData = await addressResponse.json();
        // A API retorna a lista direta de endereços, então setamos direto
        setAddresses(addressData || []); 
      } else {
        console.log("Erro ao buscar endereços:", addressResponse.status);
      }

    } catch (error) {
      console.error("Erro de conexão:", error);
      Alert.alert('Erro', 'Falha na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  // --- RESTO DO CÓDIGO (Update User, CRUD Address) ---

  const handleUpdateUser = async () => {
    try {
        const token = await getToken();
        // PUT /api/User (Atualiza perfil)
        const response = await fetch(`${API_URL}/User`, { 
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                name: userData.name,
                phone: userData.phone,
                role: userData.role 
            })
        });

        if (response.ok) {
            Alert.alert('Sucesso', 'Dados pessoais atualizados!');
        } else {
            const err = await response.json();
            Alert.alert('Erro', err.message || 'Falha ao atualizar dados.');
        }
    } catch (error) {
        Alert.alert('Erro', 'Erro de conexão.');
    }
  };

  const openAddressModal = (address = null) => {
    if (address) {
        setEditingAddress(address);
        setAddrForm({
            street: address.street, number: address.number, zipCode: address.zipCode,
            city: address.city, state: address.state || '', complement: address.complement || '',
            neighborhood: address.neighborhood || ''
        });
    } else {
        setEditingAddress(null);
        setAddrForm({ street: '', number: '', zipCode: '', city: '', state: '', complement: '', neighborhood: '' });
    }
    setModalVisible(true);
  };

  const handleSaveAddress = async () => {
    setAddressLoading(true);
    const token = await getToken();
    
    try {
        let url, method;
        
        if (editingAddress) {
            // ATUALIZAR: PUT /api/UserAddress/{id}
            url = `${API_URL}/UserAddress/${editingAddress.id}`;
            method = 'PUT';
        } else {
            // CRIAR: POST /api/User/address
            url = `${API_URL}/User/address`;
            method = 'POST';
        }

        const body = editingAddress 
            ? { ...addrForm, id: editingAddress.id, userId: parseInt(userId) } 
            : { ...addrForm }; 

        const response = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            setModalVisible(false);
            loadProfile(); // Recarrega a lista chamando o GET /addresses de novo
            Alert.alert('Sucesso', editingAddress ? 'Endereço atualizado!' : 'Novo endereço adicionado!');
        } else {
            const err = await response.json();
            Alert.alert('Erro', err.message || 'Falha ao salvar endereço.');
        }

    } catch (error) {
        Alert.alert('Erro', 'Falha na conexão.');
    } finally {
        setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    Alert.alert(
        'Excluir Endereço',
        'Tem certeza?',
        [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sim, Excluir', style: 'destructive', onPress: async () => {
                try {
                    const token = await getToken();
                    // DELETE /api/UserAddress/{id}
                    const response = await fetch(`${API_URL}/UserAddress/${addressId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.ok) {
                        loadProfile(); 
                    } else {
                        Alert.alert('Erro', 'Não foi possível apagar o endereço.');
                    }
                } catch (error) {
                    Alert.alert('Erro', 'Falha na conexão.');
                }
            }}
        ]
    );
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    window.location.href = '/frontend/LoginScreen/index.html#'; 
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#EB3738" /></View>;
  }

  return (
    <Provider>
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Avatar.Icon size={80} icon="account" style={{backgroundColor: '#EB3738'}} />
                <Text variant="headlineSmall" style={{marginTop: 10, fontWeight: 'bold'}}>{userData.name}</Text>
                <Text style={{color: 'gray'}}>{userData.email}</Text>
                <Button mode="text" textColor="red" onPress={handleLogout}>Sair da Conta</Button>
            </View>

            <View style={styles.card}>
                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={styles.cardTitle}>Dados Pessoais</Text>
                    <IconButton icon="content-save" iconColor="#EB3738" size={24} onPress={handleUpdateUser} />
                </View>
                
                <TextInput label="Nome" value={userData.name} onChangeText={t => setUserData({...userData, name: t})} mode="outlined" style={styles.input} activeOutlineColor="#EB3738" />
                <TextInput label="Telefone" value={userData.phone} onChangeText={t => setUserData({...userData, phone: t})} mode="outlined" keyboardType="phone-pad" style={styles.input} activeOutlineColor="#EB3738" />
            </View>

            <View style={styles.addressHeader}>
                <Text variant="titleMedium" style={{fontWeight: 'bold'}}>Meus Endereços</Text>
                <Button mode="text" textColor="#EB3738" icon="plus" onPress={() => openAddressModal()}>Novo</Button>
            </View>

            {addresses.length === 0 ? (
                <Text style={{textAlign: 'center', color: 'gray', marginTop: 10}}>Nenhum endereço cadastrado.</Text>
            ) : (
                addresses.map((addr, index) => (
                    <Card key={addr.id || index} style={styles.addrCard}>
                        <Card.Content>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <View style={{flex: 1}}>
                                    <Text variant="titleMedium" style={{fontWeight:'bold'}}>{addr.street}, {addr.number}</Text>
                                    <Text>{addr.neighborhood} - {addr.city}/{addr.state}</Text>
                                    <Text style={{color: 'gray'}}>CEP: {addr.zipCode}</Text>
                                    {addr.complement ? <Text style={{fontStyle:'italic'}}>({addr.complement})</Text> : null}
                                </View>
                                <View>
                                    <IconButton icon="pencil" iconColor="blue" size={20} onPress={() => openAddressModal(addr)} />
                                    <IconButton icon="delete" iconColor="red" size={20} onPress={() => handleDeleteAddress(addr.id)} />
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                ))
            )}
            
            <View style={{height: 50}} />
        </ScrollView>

        <Portal>
            <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                <Text variant="headlineSmall" style={{marginBottom: 15, color: '#EB3738', fontWeight:'bold'}}>
                    {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
                </Text>
                <ScrollView>
                    <TextInput label="CEP" value={addrForm.zipCode} onChangeText={t => setAddrForm({...addrForm, zipCode: t})} mode="outlined" style={styles.input} keyboardType="numeric" activeOutlineColor="#EB3738" />
                    <View style={styles.row}>
                        <TextInput label="Rua" value={addrForm.street} onChangeText={t => setAddrForm({...addrForm, street: t})} mode="outlined" style={[styles.input, {flex: 2, marginRight: 5}]} activeOutlineColor="#EB3738" />
                        <TextInput label="Nº" value={addrForm.number} onChangeText={t => setAddrForm({...addrForm, number: t})} mode="outlined" style={[styles.input, {flex: 1}]} activeOutlineColor="#EB3738" />
                    </View>
                    <TextInput label="Bairro" value={addrForm.neighborhood} onChangeText={t => setAddrForm({...addrForm, neighborhood: t})} mode="outlined" style={styles.input} activeOutlineColor="#EB3738" />
                    <TextInput label="Cidade" value={addrForm.city} onChangeText={t => setAddrForm({...addrForm, city: t})} mode="outlined" style={styles.input} activeOutlineColor="#EB3738" />
                    <TextInput label="Estado (UF)" value={addrForm.state} onChangeText={t => setAddrForm({...addrForm, state: t})} mode="outlined" style={styles.input} activeOutlineColor="#EB3738" />
                    <TextInput label="Complemento" value={addrForm.complement} onChangeText={t => setAddrForm({...addrForm, complement: t})} mode="outlined" style={styles.input} activeOutlineColor="#EB3738" />
                    
                    <Button mode="contained" onPress={handleSaveAddress} loading={addressLoading} style={{marginTop: 10, backgroundColor: '#EB3738'}}>
                        Salvar Endereço
                    </Button>
                    <Button onPress={() => setModalVisible(false)} style={{marginTop: 5}} textColor="gray">Cancelar</Button>
                </ScrollView>
            </Modal>
        </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', padding: 20, backgroundColor: 'white', marginBottom: 10, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 3 },
  card: { backgroundColor: 'white', padding: 15, marginHorizontal: 15, marginTop: 10, borderRadius: 10, elevation: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontWeight: 'bold', color: '#333' },
  input: { marginBottom: 10, backgroundColor: 'white', fontSize: 14 },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginTop: 20, marginBottom: 5 },
  addrCard: { marginHorizontal: 15, marginBottom: 10, backgroundColor: 'white', borderLeftWidth: 5, borderLeftColor: '#EB3738' },
  modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10, maxHeight: '85%' },
  row: { flexDirection: 'row' }
});