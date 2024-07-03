import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import imageData from '../../../api/images';

const ProductDetailCarousel = ({ images }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarImagenes = async () => {
      try {
        const urls = await Promise.all(images.map(IMAGEN => imageData('fotos', IMAGEN)));
        setImageUrls(urls);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    cargarImagenes();
  }, [images]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text>Error al cargar las imágenes</Text>;
  }

  return (
    <ScrollView horizontal pagingEnabled style={styles.carousel}>
      {imageUrls.map((url, index) => (
        <Image key={index} source={{ uri: url }} style={styles.image} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  carousel: {
    width: '100%',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductDetailCarousel;
