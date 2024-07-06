import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, ActivityIndicator } from 'react-native-paper';
import imageData from '../../api/images';
import iconDelete from '../../assets/icon-delete.png';
import iconEdit from '../../assets/icon-edit-cart.png';

const ProductCart = ({ item, onPress }) => {
  const [imagenUrl, setImagenUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarImagen = async () => {
      try {
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
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={{ uri: imagenUrl }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.productTitle}>{item.NOMBRE}</Text>
          <Text style={styles.productPrice}>Cantidad: {item.CANTIDAD}</Text>
          <Text style={styles.productPrice}>${item.PRECIO}</Text>
        </View>
        <View tyle={styles.infoContainer}>
        <TouchableOpacity onPress={() => onPress(item.ID)} style={styles.editButton}>
          <Image source={iconEdit} style={styles.imagenDelete} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPress(item.ID)} style={styles.deleteButton}>
          <Image source={iconDelete} style={styles.imagenDelete} />
        </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    zIndex:2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#000',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  deleteButton: {
    size: 24,
    marginLeft: 10,
    
  },
  editButton: {
    size: 24,
    marginLeft: 10,
    marginTop:5,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#f00',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagenDelete: {
    width: 24,
    height: 24,
  }
});

export default ProductCart;
