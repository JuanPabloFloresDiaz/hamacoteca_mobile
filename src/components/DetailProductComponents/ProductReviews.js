import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import imageData from '../../../api/images';

//Componente que muestra los comentarios
const ProductReviews = ({ reviews }) => {
  const [avatarUrls, setAvatarUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarAvatares = async () => {
      try {
        const urls = {};
        for (const review of reviews) {
          urls[review.avatar] = await imageData('clientes', review.IMAGEN);
        }
        setAvatarUrls(urls);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    cargarAvatares();
  }, [reviews]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text>Error al cargar los avatares</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Valoraciones</Text>
      <ScrollView horizontal>
        {reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <Image source={{ uri: avatarUrls[review.avatar] }} style={styles.avatar} />
            <Text style={styles.name}>{review.NOMBRE}</Text>
            <Text style={styles.rating}>{review.CALIFICACIÓN} ★</Text>
            <Text style={styles.comment}>{review.COMENTARIO}</Text>
          </View>
        ))}
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductReviews;
