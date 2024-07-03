import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginNav from './src/navigation/LoginNav';
import BottomTab from './src/navigation/BottomTab';
import fetchData from './api/components';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createStackNavigator();

export default function App() {
  const API = 'servicios/publica/cliente.php';
  const [logueado, setLogueado] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyLogged = async () => {
    try {
      const data = await fetchData(API, 'getUser');
      if (data.session) {
        setLogueado(true);
        console.log(data.nombre);
      } else {
        setLogueado(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      await verifyLogged();
      setLoading(false);
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {logueado ?
        <BottomTab logueado={logueado} setLogueado={setLogueado} />
        :
        <LoginNav logueado={logueado} setLogueado={setLogueado} />
      }
    </NavigationContainer>
  );
}
