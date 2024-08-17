// StarRating.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const StarRating = ({ rating, onChange }) => {
  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, index) => (
        <TouchableOpacity key={index} onPress={() => onChange(index + 1)}>
          <Text style={[styles.star, { color: index < rating ? '#ffcc00' : '#ccc' }]}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 30,
    marginHorizontal: 2,
  },
});

export default StarRating;
