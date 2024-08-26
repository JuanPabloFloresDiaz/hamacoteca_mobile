import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

// Asegúrate de tener las imágenes en la carpeta assets
import successImage from '../../assets/success.jpg';
import errorImage from '../../assets/error.jpg';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
// Descargar el pdf de la factura
const PDFViewerScreen = ({ route }) => {
  const { pdfUrl } = route.params;
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simula el tiempo de descarga
      setLoading(false);
      // Aquí puedes hacer la verificación real si la descarga fue exitosa
      // Por simplicidad, estamos asumiendo éxito para esta simulación
      setDownloadStatus('success');
    }, 3000); // Ajusta el tiempo de espera según sea necesario

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      )}
      {!loading && downloadStatus === 'success' && (
        <View style={styles.messageContainer}>
          <Image source={successImage} style={styles.image} />
          <Text style={styles.message}>Descarga con éxito</Text>
        </View>
      )}
      {!loading && downloadStatus === 'error' && (
        <View style={styles.messageContainer}>
          <Image source={errorImage} style={styles.image} />
          <Text style={styles.message}>No se pudo descargar el archivo</Text>
        </View>
      )}
      <WebView
        source={{ uri: pdfUrl }}
        style={styles.webview}
        onLoadEnd={() => {
          console.log('Descarga iniciada');
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log('WebView error: ', nativeEvent);
          setDownloadStatus('error');
        }}
        startInLoadingState
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
    width: 0,
    height: 0,
    opacity: 0,
  },
  messageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '0%',
  },
  image: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.5,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    maxWidth: windowWidth * 0.4,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default PDFViewerScreen;
