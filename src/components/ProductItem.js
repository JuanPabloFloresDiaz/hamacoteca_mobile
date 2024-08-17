import React, { useState, useEffect } from 'react';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { StyleSheet, View, Dimensions } from 'react-native';
import imageData from '../../api/images';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ProductItem = ({ item, onPress }) => {
  //Constantes para el manejo de la imagen
  const [imagenUrl, setImagenUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    //Metodo para cargar la imagen y manejar el error en caso de que no se encuentren
    const cargarImagen = async () => {
      try {
        //Traer la imagen y aplicarla a la url
        const uri = await imageData('hamacas', item.IMAGEN);
        setImagenUrl(uri);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    cargarImagen();
  }, [item.IMAGEN]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text>Error al cargar la imagen</Text>;
  }

  return (
    <Card style={styles.card} onPress={() => onPress(item.ID)}>
      <Card.Cover source={{ uri: imagenUrl }} />
      <Card.Content>
        <Text style={styles.productTitle}>{item.NOMBRE}</Text>
        <Text style={styles.productPrice}>{item.PRECIO}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    zIndex: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: windowWidth * 0.47,
  },
  productPrice: {
    marginTop: 5,
    fontSize: 16,
    color: '#334195',
  },
});

export default ProductItem;
