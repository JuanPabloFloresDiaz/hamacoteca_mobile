import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const ProductReviews = ({ reviews }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Valoraciones</Text>
      <ScrollView horizontal>
        {reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <Image source={{ uri: review.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{review.name}</Text>
            <Text style={styles.rating}>{review.rating} ★</Text>
            <Text style={styles.comment}>{review.comment}</Text>
          </View>
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
  reviewCard: {
    width: 200,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 14,
    color: '#ffcc00',
  },
  comment: {
    fontSize: 14,
    color: '#333',
  },
});

export default ProductReviews;
