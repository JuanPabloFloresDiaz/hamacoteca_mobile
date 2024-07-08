import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

//Componente que muestra las especificaciones del producto
const ProductSpecifications = ({ category, material, description, existencias }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Especificaciones</Text>
      <View style={styles.mainContainer}>
        <Text style={styles.label}>Categoría:</Text>
        <Text style={styles.value}>{category}</Text>
      </View>
      <View style={styles.mainContainer}>
        <Text style={styles.label}>Material:</Text>
        <Text style={styles.value}>{material}</Text>
      </View>
      <View style={styles.mainContainer}>
        <Text style={styles.label}>Existencias:</Text>
        <Text style={styles.value}>{existencias}</Text>
      </View>
      <Text style={styles.labelDescripcion}>Descripción:</Text>
      <Text style={styles.value}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#777',
  },
  labelDescripcion: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
});

export default ProductSpecifications;
