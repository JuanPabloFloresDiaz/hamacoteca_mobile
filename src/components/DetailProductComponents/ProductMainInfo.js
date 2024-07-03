import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ProductMainInfo = ({ name, price, rating }) => {
  const [quantity, setQuantity] = useState(1);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FontAwesome key={i} name="star" style={styles.star} />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<FontAwesome key={i} name="star-half-full" style={styles.star} />);
      } else {
        stars.push(<FontAwesome key={i} name="star-o" style={styles.star} />);
      }
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.productTitle}>{name}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.favoriteButton} onPress={() => console.log('Comprar', quantity)} >
            <FontAwesome name="shopping-bag" style={styles.shoppingIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton} onPress={() => console.log('Añadir a favoritos')}>
            <FontAwesome name="bookmark" style={styles.favoriteIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        {renderStars(rating)}
      </View>
      <Text style={styles.productPrice}>${price.toFixed(2)}</Text>
      <View style={styles.quantityContainer}>
        <Text>Cantidad a comprar:</Text>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={String(quantity)}
          onChangeText={(text) => setQuantity(Number(text))}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#334195',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  star: {
    fontSize: 24,
    color: '#FFD700', // color dorado para las estrellas
    marginHorizontal: 2,
  },
  productPrice: {
    fontSize: 22,
    color: '#334195',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginLeft: 10,
    width: 50,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  favoriteButton: {
    marginLeft: 20,
  },
  shoppingIcon: {
    fontSize: 24,
    color: '#38A34C',
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#7E7E7E',
  },
});

export default ProductMainInfo;
