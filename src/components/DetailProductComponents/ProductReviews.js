import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import imageData from '../../../api/images';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
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



  // Método para asignar el número de estrellas que se mostraran
  const getStars = (CALIFICACIÓN) => {
    if (CALIFICACIÓN <= 1) return '★'; // Mostrar solo 1 estrella
    if (CALIFICACIÓN <= 2) return '★★'; // Mostrar 2 estrellas
    if (CALIFICACIÓN <= 3) return '★★★'; // Mostrar 3 estrellas
    if (CALIFICACIÓN <= 4) return '★★★★'; // Mostrar 4 estrellas
    if (CALIFICACIÓN <= 5) return '★★★★★'; // Mostrar 5 estrellas
  };

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
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Valoraciones</Text>
        <Text style={styles.verMas}>Ver mas</Text>
      </View>
      <ScrollView horizontal>
        {reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <View style={styles.headerContainer}>
              <Image source={{ uri: avatarUrls[review.avatar] }} style={styles.avatar} />
              <View>
                <Text style={styles.name}>{review.NOMBRE}</Text>
                <Text style={styles.rating}>{getStars(review.CALIFICACIÓN)}</Text>
              </View>
            </View>
            <Text style={styles.comment}>{review.COMENTARIO}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 2,
    padding: 5,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    maxWidth: windowWidth * 0.3,
  },
  verMas: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334195',
    maxWidth: windowWidth * 0.3,
  },
  reviewCard: {
    maxWidth: windowWidth * 0.75,
    margin: 2,
    marginRight: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    maxWidth: windowWidth * 0.5,
  },
  rating: {
    fontSize: 14,
    color: '#ffcc00',
  },
  comment: {
    maxWidth: windowWidth * 0.55,
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row', // Alinea horizontalmente
    alignItems: 'center', // Centra verticalmente
    justifyContent: 'space-between',
    marginBottom: 5, // Añade un margen inferior
  },
});

export default ProductReviews;
