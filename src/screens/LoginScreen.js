import React from 'react';
import { View, StyleSheet, Image, Text, ImageBackground, TextInput as RNTextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = ({ logueado, setLogueado }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
        <Text style={styles.footerText} onPress={handleForgotPassword}>¿Recuperar su contraseña?</Text>
        <Button mode="contained" onPress={() => setLogueado(true)} style={styles.button}>
          Iniciar sesión
        </Button>
        <Text style={styles.footerText} onPress={handleSignUp}>
          ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrese aquí</Text>
        </Text>
      </View>
    </ImageBackground>
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
