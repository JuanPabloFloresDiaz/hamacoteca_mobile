import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, ActivityIndicator } from 'react-native-paper';
import imageData from '../../api/images';
import iconDelete from '../../assets/icon-delete.png';

const ProductCart = ({ item, onPress }) => {
  const [imagenUrl, setImagenUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

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
          <Text style={styles.productPrice}>${item.PRECIO}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => onPress(item.ID)} style={styles.deleteButton}>
          <Image source={iconDelete} style={styles.imagenDelete} />
        </TouchableOpacity>
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
    color: '#334195',
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
