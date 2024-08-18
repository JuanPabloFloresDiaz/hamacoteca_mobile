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
    setLoading(true);
    try {
      const data = await fetchData(API, 'getUser');
      if (data.session) {
        setLogueado(true);
        console.log(data.nombre);

        setTimeout(()=>{
          setLoading(false)
        }, 1500)
      } else {
        setLogueado(false);
        setTimeout(()=>{
          setLoading(false)
        }, 1500)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      await verifyLogged();
    };
    initializeApp();
  }, []);

  if (loading) {
    return <SplashScreen/>
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
