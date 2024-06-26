import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ImageBackground, TextInput as RNTextInput, TouchableOpacity } from 'react-native';
import { Button, PaperProvider } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AlertComponent from '../components/AlertComponent';
import fetchData from '../../api/components';

const LoginScreen = ({ logueado, setLogueado }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState(1);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertCallback, setAlertCallback] = useState(null);

  // URL de la API para el usuario
  const USER_API = 'servicios/publica/cliente.php';


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Manejo de inicio de sesión
  const handleLogin = async () => {
    // Verifica que los campos no estén vacíos
    if (!email || !password) {
      setAlertType(2);
      setAlertMessage(`Campos requeridos, Por favor, complete todos los campos.`);
      setAlertCallback(null);
      setAlertVisible(true);
      return;
    } else {
      // Creación del formulario para la petición
      const formData = new FormData();
      formData.append('correo', email);
      formData.append('clave', password);

      try {
        // Realización de la petición de inicio de sesión
        const data = await fetchData(USER_API, 'logIn', formData);
        if (data.status) {
          setAlertType(1);
          setAlertMessage(`${data.message}`);
          setAlertCallback(() => () => setLogueado(!logueado));
          setAlertVisible(true);
        } else {
          console.log(data);
          setAlertType(2);
          setAlertMessage(`Error sesión: ${data.error}`);
          setAlertCallback(null);
          setAlertVisible(true);
        }
      } catch (error) {
        console.log('Error: ', error);
        setAlertType(2);
        setAlertMessage(`Error: ${error}`);
        setAlertCallback(null);
        setAlertVisible(true);
      }
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertCallback) alertCallback();
  };


  const handleForgotPassword = () => {
    // Navegar a la pantalla de recuperación de contraseña
    navigation.navigate('RecoverPassword');
  };


  const handleSignUp = () => {
    // Navegar a la pantalla de recuperación de contraseña
    navigation.navigate('SignUp');
  };

  return (
    <PaperProvider>
      <ImageBackground source={require('../../assets/fondo-hamok.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <Text style={styles.title}>Inicio de sesión</Text>
          <Text style={styles.subtitle}>Bienvenido al inicio de sesión</Text>
          <Text style={styles.textLabel}>Correo o alias</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} style={styles.icon} />
            <RNTextInput
              placeholder="Correo o alias"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>
          <Text style={styles.textLabel}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} style={styles.icon} />
            <RNTextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              style={styles.input}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Ionicons name={passwordVisible ? "eye-outline" : "eye-off-outline"} size={20} style={styles.iconRight} />
            </TouchableOpacity>
          </View>
          <Text style={styles.footerText} onPress={handleForgotPassword}>¿Recuperar su clave?</Text>
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Iniciar sesión
          </Button>
          <Text style={styles.footerText} onPress={handleSignUp}>
            ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrese aquí</Text>
          </Text>
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
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    textTransform: 'uppercase',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
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
  iconRight: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: 'black',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#777',
  },
  registerLink: {
    color: '#000',
    fontWeight: 'bold',
  },
});
