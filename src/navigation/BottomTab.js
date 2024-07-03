import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/CartScreen';
import ShoppingScreen from '../screens/ShoppingScreen';
import LoginNav from '../navigation/LoginNav';

// Navegador Bottom Tabs Navigator
const Tab = createBottomTabNavigator();

export default function BottomTab({ logueado, setLogueado }) {
  // Función para renderizar HomeScreen con props
  const RenderHomeScreen = props => (
      <HomeScreen {...props} setLogueado={setLogueado} logueado={logueado} />
  );
  // Función para renderizar HomeScreen con props
  const RenderProfileScreen = props => (
      <ProfileScreen {...props} setLogueado={setLogueado} logueado={logueado} />
  );
  // Función para renderizar HomeScreen con props
  const RenderCartScreen = props => (
      <CartScreen {...props} setLogueado={setLogueado} logueado={logueado} />
  );
  // Función para renderizar HomeScreen con props
  const RenderShoppingScreen = props => (
      <ShoppingScreen {...props} setLogueado={setLogueado} logueado={logueado} />
  );
  return (
      <Tab.Navigator
          initialRouteName="Inicio"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Inicio') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Tienda') {
                iconName = focused ? 'bag-check' : 'bag-check-outline';
              } else if (route.name === 'Carrito') {
                iconName = focused ? 'cart' : 'cart-outline';
              } else if (route.name === 'Perfil') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#FFF',
            tabBarInactiveTintColor: '#eee',
            tabBarStyle: styles.tabBar,
            headerStyle: {
              backgroundColor: 'rgba(56, 163, 76, 0.8)',
              borderBottomRightRadius: 35,
              borderBottomLeftRadius: 35,
            },
            headerTintColor: '#fff',
            tabBarLabelStyle: styles.tabBarLabel,
            headerTitleAlign: 'center',
          })}
      >
        <Tab.Screen
            name="Inicio"
            component={RenderHomeScreen}
            options={{
              title: 'Inicio',
              headerShown: true
            }}
        />
        <Tab.Screen
            name="Tienda"
            component={RenderShoppingScreen}
            options={{
              title: 'Tienda',
              headerShown: true
            }}
        />
        <Tab.Screen
            name="Carrito"
            component={RenderCartScreen}
            options={{
              title: 'Carrito',
              headerShown: true
            }}
        />
        <Tab.Screen
            name="Perfil"
            component={RenderProfileScreen}
            options={{
              title: 'Perfil',
              headerShown:false
            }}
        />


        {/*Pantalla fuera del BottomTab*/}
        {/*Accedemos al Stack navigation que se encuentra en LoginNav  */}
        <Tab.Screen
            name="LoginNav"
            component={LoginNav}
            //Escondemos la opcion para que no aparezca en el BottomTab
            options={({ route }) => ({
              tabBarButton: () => null,
              headerShown: false
            })}
        />
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: '#000000',
    borderRadius: 15,
    height: 70,
    padding: 10,
    paddingBottom: 15,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  customButtonContainer: {
    top: -16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000080',
    padding: 10
  },
  customButtonTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000080',
    borderRadius: 35,
  },
  customButtonIcon: {
    color: '#FFC300',
  },
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
