import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import fetchData from '../../api/components';


const ProfileScreen = ({ logueado, setLogueado }) => {
  // URL de la API para el usuario
  const USER_API = 'servicios/publica/cliente.php';
  // Manejo de cierre de sesión
  const handleLogOut = async () => {
    try {
      const data = await fetchData(USER_API, 'logOut');
      if (data.status) {
        setLogueado(false);
      } else {
        console.log('Error de sesión: ', data.error);
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pantalla del perfil xd
      </Text>
      <Text style={styles.descripcion} onPress={handleLogOut}>
        Cliquea este texto para cerrar la sesión.
      </Text>
    </View>
  );
}

export default ProfileScreen;


// Estilos para los componentes.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 15
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    textTransform: 'uppercase',
  },
  descripcion: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'justify',
    marginTop: 10,
  },
  negrita: {
    fontWeight: 'bold'
  }
});
