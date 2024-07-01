import React from 'react';
import { View, Text, StyleSheet, Image, TextInput as RNTextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { Button, PaperProvider } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


const RecoveryPasswordScreen = ({ logueado, setLogueado }) => {
  const [confirmarPassword, setconfirmarPassword] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleForgotVerificacion = () => {
    // Navegar a la pantalla de recuperación de contraseña
    navigation.navigate('VerificationCode');
  };

  const handleForgotLogin = () => {
    // Navegar a la pantalla de recuperación de contraseña
    navigation.navigate('LoginScreen');
  };

  return (
    <PaperProvider>
      <ImageBackground source={require('../../assets/fondo-change.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleForgotVerificacion}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
        <Image source={require('../../assets/icon-password.png')} style={styles.logo} />
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
          <Text style={styles.textLabel}>Confirmar contraseña</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} style={styles.icon} />
            <RNTextInput
              placeholder="Confirmar contraseña"
              value={confirmarPassword}
              onChangeText={setconfirmarPassword}
              secureTextEntry={!passwordVisible}
              style={styles.input}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Ionicons name={passwordVisible ? "eye-outline" : "eye-off-outline"} size={20} style={styles.iconRight} />
            </TouchableOpacity>
          </View>
          <Button mode="contained" onPress={handleForgotLogin} style={styles.button}>
            Enviar
          </Button>
        </View>
      </ImageBackground>

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
  iconRight: {
    marginLeft: 10,
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
  