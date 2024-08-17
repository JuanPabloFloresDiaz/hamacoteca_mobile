import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput as RNTextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { Button, PaperProvider } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import fetchData from '../../api/components';
import AlertComponent from '../components/AlertComponent';


const RecoveryPasswordScreen = ({ logueado, setLogueado }) => {
  const [email, setEmail] = React.useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState(1);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertCallback, setAlertCallback] = useState(null);
  const API = 'servicios/recuperacion/recuperacion.php';
  const navigation = useNavigation();

  const handleForgotVerification = async () => {
    if (email === '') {
      setAlertType(3);
      setAlertMessage(`El campo no puede estar vacio`);
      setAlertCallback(null);
      setAlertVisible(true);
      return;
    }

    const fechaActualUTC = new Date();
    const formData = new FormData();
    formData.append('correo', email);
    formData.append('nivel', 2);
    formData.append('fecha', fechaActualUTC.toISOString());

    console.log('Esto contiene el correo: ' + email);
    console.log('Esto contiene la fecha actual en UTC: ' + fechaActualUTC.toISOString());

    try {
      const data = await fetchData(API, 'envioCorreo', formData);
      if (data.status) {
        setAlertType(1);
        setAlertMessage(`${data.message}`);
        setAlertCallback(() => () => navigation.navigate('LoginScreen'));
        setAlertVisible(true);
      } else {
        setAlertType(2);
        setAlertMessage(`${data.error}`);
        setAlertCallback(null);
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertType(2);
      setAlertMessage(`Error: ${error}`);
      setAlertCallback(null);
      setAlertVisible(true);
    }
  };

  // Función para manejar el cierre de la alerta
  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertCallback) alertCallback();
  };

  const handleForgotLogin = () => {
    // Navegar a la pantalla de recuperación de contraseña
    navigation.navigate('LoginScreen');
  };

  return (
    <PaperProvider>
      <ImageBackground source={require('../../assets/fondo-change.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={handleForgotLogin}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Image source={require('../../assets/icon-correo.png')} style={styles.logo} />
          <Text style={styles.textLabel}>Ingrese su correo</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} style={styles.icon} />
            <RNTextInput
              placeholder="correo electrónico "
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>
          <Button mode="contained" onPress={handleForgotVerification} style={styles.button}>
            Enviar
          </Button>
        </View>
      </ImageBackground>
      <AlertComponent
        visible={alertVisible}
        type={alertType}
        message={alertMessage}
        onClose={handleAlertClose}
      />
    </PaperProvider>
  );
}

export default RecoveryPasswordScreen;


// Estilos para los componentes.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'rigth',
    marginTop: 10,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  logo: {
    marginBottom: 150,
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
  },
  backText: {
    fontSize: 35,
    color: '#000',
  }
});
