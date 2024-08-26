import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { HelperText } from 'react-native-paper';

//Componente de slider
const PriceSlider = ({ minPrice = 0, maxPrice = 1000, onValueChange }) => {
  //Definir constantes para la lógica del slider
  const [selectedMinPrice, setSelectedMinPrice] = useState(minPrice);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(maxPrice);
  const [error, setError] = useState('');

  //Rango de precio para el minimo valor
  const handleMinPriceChange = (value) => {
    if (value > selectedMaxPrice) {
      setError('El valor mínimo no puede ser mayor al valor máximo');
    } else {
      setError('');
      setSelectedMinPrice(value);
      onValueChange(value, selectedMaxPrice);
    }
  };
  //Rango de precio para el maximo valor
  const handleMaxPriceChange = (value) => {
    if (value < selectedMinPrice) {
      setError('El valor máximo no puede ser menor al valor mínimo');
    } else {
      setError('');
      setSelectedMaxPrice(value);
      onValueChange(selectedMinPrice, value);
    }
  };

  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.priceText}>${selectedMinPrice} - ${selectedMaxPrice}</Text>
      <Slider
        style={styles.slider}
        minimumValue={minPrice}
        maximumValue={maxPrice}
        value={selectedMinPrice}
        step={50}
        minimumTrackTintColor="#334195"
        maximumTrackTintColor="#334195"
        thumbTintColor="#334195"
        onValueChange={handleMinPriceChange}
      />
      <Slider
        style={styles.slider}
        minimumValue={minPrice}
        maximumValue={maxPrice}
        value={selectedMaxPrice}
        step={50}
        minimumTrackTintColor="#334195"
        maximumTrackTintColor="#334195"
        thumbTintColor="#334195"
        onValueChange={handleMaxPriceChange}
      />
      {error ? (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default PriceSlider;
