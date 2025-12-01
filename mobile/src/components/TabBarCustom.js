import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import necessário

const TabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets(); // Pega as medidas seguras da tela (topo, baixo, etc)

  const tabs = [
    { name: 'Items', label: 'Cardápio', icon: 'silverware-fork-knife' },
    { name: 'Orders', label: 'Pedidos', icon: 'clipboard-text' },
    { name: 'Cart', label: 'Carrinho', icon: 'cart' },
    { name: 'Profile', label: 'Perfil', icon: 'account' },
  ];

  return (
    <View style={[
      styles.container, 
      { paddingBottom: Math.max(insets.bottom, 10) } // Adiciona padding dinâmico na parte inferior
    ]}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: tab.name,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(tab.name);
          }
        };

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <IconButton
              icon={tab.icon}
              size={24}
              iconColor={isFocused ? '#EB3738' : '#666666'}
              style={styles.icon}
            />
            <Text
              style={[
                styles.label,
                isFocused && styles.activeLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 4, // Mudado de paddingVertical para controlar topo e baixo separadamente
    paddingHorizontal: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  icon: {
    margin: 0,
  },
  label: {
    fontSize: 12,
    color: '#666666',
    marginTop: -8,
    marginBottom: 4, // Espaçamento extra para o texto não colar
  },
  activeLabel: {
    color: '#EB3738',
    fontWeight: '600',
  },
});

export default TabBar;