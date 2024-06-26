import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const ChangePasswordScreen = ({ logueado, setLogueado}) => {
    return ( 
        <View style={styles.container}>
        <Text style={styles.title}>
        Pantalla del cambio de contraseña xd
        </Text>
        <Text style={styles.descripcion}>
            Ejemplo de consumo de API externa utilizando la función <Text style={styles.negrita}>FETCH</Text>
        </Text>
        </View>
     );
}
 
export default ChangePasswordScreen;


// Estilos para los componentes.
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 20,
      paddingHorizontal:15
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
      negrita:{
        fontWeight:'bold'
      }
  });
  