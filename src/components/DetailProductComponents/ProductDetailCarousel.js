import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator, Text, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import imageData from '../../../api/images';

const { width } = Dimensions.get('window');

const ProductDetailCarousel = ({ images }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarImagenes = async () => {
      try {
        const urls = await Promise.all(images.map(img => imageData('fotos', img.IMAGEN)));
        setImageUrls(urls);
        console.log('URLS: ', urls);
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
    <Swiper 
      style={styles.wrapper} 
      showsButtons={true} 
      autoplay={true} 
      dotColor="white"
      activeDotColor="white"
      dotStyle={styles.dotStyle}
      activeDotStyle={styles.activeDotStyle}
      nextButton={<Text style={styles.buttonText}>›</Text>}
      prevButton={<Text style={styles.buttonText}>‹</Text>}
    >
      {imageUrls.map((url, index) => (
        <View style={styles.slide} key={index}>
          <Image source={{ uri: url }} style={styles.image} />
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 300,
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: 300,
    position: 'absolute',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotStyle: {
    marginBottom: -20, 
  },
  activeDotStyle: {
    marginBottom: -20, 
  },
  buttonText: {
    color: 'white',
    fontSize: 50,
  },
});

export default ProductDetailCarousel;
