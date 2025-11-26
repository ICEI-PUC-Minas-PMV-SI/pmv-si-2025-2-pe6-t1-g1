import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import Login from '../screens/Login';
import CadastroUsuario from '../screens/CadastroUsuario';
import Items from '../screens/Items';
import Cart from '../screens/Cart';
import Orders from '../screens/Orders';
import Profile from '../screens/Profile';

// Components
import TabBarCustom from '../components/TabBarCustom';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator com TabBar customizado
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBarCustom {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Items" component={Items} />
      <Tab.Screen name="Orders" component={Orders} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

// Stack Navigator principal
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#EB3738',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CadastroUsuario"
          component={CadastroUsuario}
          options={{ title: 'Cadastro' }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
