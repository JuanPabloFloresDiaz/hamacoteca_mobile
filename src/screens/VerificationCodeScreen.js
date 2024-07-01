import React from 'react';
import { View, Text, StyleSheet, Image, TextInput as RNTextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { Button, PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const VerificationCodeScrenn = ({ logueado, setLogueado}) => {
  const [code, setCode] = React.useState('');
  const navigation = useNavigation();

  const handleForgotPassword = () => {
    // Navegar a la pantalla de recuperación de contraseña
    navigation.navigate('ChangePassword');
  };

  const handleForgotRecovery = () => {
    // Navegar a la pantalla de recuperación de contraseña
    navigation.navigate('RecoverPassword');
  };


  return (
    <PaperProvider>
      <ImageBackground source={require('../../assets/fondo-change.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleForgotRecovery}>
        <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Image source={require('../../assets/icon-verfication.png')} style={styles.logo} />
          <Text style={styles.textLabel}>Ingresa el código de verificación</Text>
          <View style={styles.inputContainer}>  
            <RNTextInput
              placeholder="000 000"
              value={code}
              onChangeText={setCode}
              style={styles.input}
            />
          </View>
          <Button mode="contained" onPress={handleForgotPassword} style={styles.button}>
            Verificar
          </Button>
        </View>
      </ImageBackground>

    </PaperProvider>
  );
}
 
export default VerificationCodeScrenn;


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
  