import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ItemModal({ visible, item, onClose, onAdd }) {
  if (!item) return null;
  const title = item.nameItem || 'Títulos do item';
  const desc = item.description || 'Sem descrição';
  const price = item.value != null ? item.value : (item.price != null ? item.price : null);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalDesc}>{desc}</Text>
          {price !== null ? <Text style={styles.modalPrice}>R$ {price}</Text> : null}

          <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
              <Text style={styles.modalActionText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalActionButton} onPress={() => onAdd && onAdd(item)}>
              <Text style={styles.modalActionText}>Adicionar ao carrinho</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 8 },
  modalDesc: { fontSize: 14, color: '#555' },
  modalPrice: { marginTop: 12, fontSize: 16, fontWeight: '700', color: '#EB3738' },
  modalCloseButton: { paddingVertical: 8, paddingHorizontal: 12, marginRight: 8 },
  modalActionButton: { backgroundColor: '#EB3738', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  modalActionText: { color: '#fff', fontWeight: '600' },
});
