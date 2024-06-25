// Hooks de React
import { useEffect, useState } from 'react';
// Utilidades de React Navigation
import { NavigationContainer } from '@react-navigation/native';

import LoginNav from './src/navigation/LoginNav';
import BottomTab from './src/navigation/BottomTab';
import fetchData from './api/components';

//Componente principal
export default function App() {

  // URL de la API para el usuario
  const API = 'servicios/publica/cliente.php';
  // logueado: Variable para indicar si la sesion ya está lista
  // setLogueado: Función para actualizar la variable logueado
  const [logueado, setLogueado] = useState(false);

  // Función que ayuda a verificar si existe previamente una sesión abierta
  const verifyLogged = async () => {
    try {
      const data = await fetchData(API, 'getUser');
      if (data.session) {
        setLogueado(true)
        console.log(data.nombre);
      } else {
        setLogueado(false)
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    verifyLogged();
  }, [])

  // Retorna el contenedor de navegación
  return (
    <NavigationContainer>
      {logueado ?
        // Si la aplicación está lista, muestra el componente BottomTab
        <BottomTab
          logueado={logueado}
          setLogueado={setLogueado} />
        :
        // Si la aplicación no está lista, muestra el componente NavStack
        <LoginNav
          logueado={logueado}
          setLogueado={setLogueado}
        />
      }
    </NavigationContainer>
  );
}
