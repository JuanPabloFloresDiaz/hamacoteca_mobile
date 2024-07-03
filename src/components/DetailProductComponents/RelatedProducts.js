import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ProductItem from '../ProductItem'; // Asegúrate de importar el componente ProductItem

const RelatedProducts = ({ products, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Podría interesarte</Text>
      <ScrollView horizontal>
        {products.map((product, index) => (
          <ProductItem key={index} item={product} onPress={onPress} />
        ))}
      </ScrollView>
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
});

export default RelatedProducts;
