import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductSpecifications = ({ category, material, description }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Especificaciones</Text>
      <Text style={styles.label}>Categoría:</Text>
      <Text style={styles.value}>{category}</Text>
      <Text style={styles.label}>Material:</Text>
      <Text style={styles.value}>{material}</Text>
      <Text style={styles.label}>Descripción:</Text>
      <Text style={styles.value}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: '#777',
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
});

export default ProductSpecifications;
