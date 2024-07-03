import React from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';

const ProductDetailCarousel = ({ images }) => {
  return (
    <ScrollView horizontal pagingEnabled style={styles.carousel}>
      {images.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={styles.image} />
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
});

export default ProductDetailCarousel;
