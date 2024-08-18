import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';

const SplashScreen = () => {
  const rotation = new Animated.Value(0);

  useEffect(() => {
    // Animación de rotación del logo
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
    //Después de 3 segundos cambiar a la pantalla del login
    const timer = setTimeout(() => {
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/fondo-hamok.png')} style={styles.backgroundImage} />
      <Animated.Image source={require('../../assets/logo.png')} style={[styles.logo, { transform: [{ rotate }] }]} />
    </View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});
