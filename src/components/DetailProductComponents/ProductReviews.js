import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Dimensions, Modal, TextInput, TouchableOpacity } from 'react-native';
import imageData from '../../../api/images';
import { Ionicons } from '@expo/vector-icons';
import StarRating from './StarRating'; // Asegúrate de que la ruta es correcta

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ProductReviews = ({ reviews, clienteId }) => {
  const [avatarUrls, setAvatarUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

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

  const handleRatingChange = (rating) => {
    setNewRating(rating);
  };

  const formatFecha = (fecha) => {
    const meses = {
      January: 'Enero',
      February: 'Febrero',
      March: 'Marzo',
      April: 'Abril',
      May: 'Mayo',
      June: 'Junio',
      July: 'Julio',
      August: 'Agosto',
      September: 'Septiembre',
      October: 'Octubre',
      November: 'Noviembre',
      December: 'Diciembre'
    };
  
    // Reemplaza el nombre del mes en inglés por su equivalente en español
    Object.keys(meses).forEach(ing => {
      if (fecha.includes(ing)) {
        fecha = fecha.replace(ing, meses[ing]);
      }
    });
  
    return fecha;
  };

  const handleAddComment = () => {
    // Lógica para agregar un nuevo comentario (puedes manejar la lógica de agregar aquí o en un API).
    console.log('Nuevo comentario:', newComment);
    console.log('Nueva calificación:', newRating);
    setModalVisible(false); // Cerrar el modal después de agregar el comentario.
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
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.verMas}>Ver más</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal>
        {reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <View style={styles.headerContainer}>
              <Image source={{ uri: avatarUrls[review.avatar] }} style={styles.avatar} />
              <View>
                <Text style={styles.name}>{review.NOMBRE}</Text>
                <Text style={styles.rating}>{'★'.repeat(review.CALIFICACIÓN)}</Text>
              </View>
            </View>
            <Text style={styles.comment}>{review.COMENTARIO}</Text>
            <Text style={styles.fecha}>{formatFecha(review.FECHA)}</Text>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Añadir Comentario</Text>
          <StarRating
            rating={newRating}
            onChange={handleRatingChange}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Escribe tu comentario aquí..."
            multiline={true}
            value={newComment}
            onChangeText={(text) => setNewComment(text)}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddComment}>
            <Text style={styles.addButtonText}>Añadir Comentario</Text>
          </TouchableOpacity>
          <ScrollView style={styles.commentsContainer}>
            {reviews.map((review, index) => (
              <View key={index} style={styles.reviewCard}>
                <View style={styles.headerContainer}>
                  <Image source={{ uri: avatarUrls[review.avatar] }} style={styles.avatar} />
                  <View>
                    <Text style={styles.name}>{review.NOMBRE}</Text>
                    <Text style={styles.rating}>{'★'.repeat(review.CALIFICACIÓN)}</Text>
                  </View>
                </View>
                <Text style={styles.comment}>{review.COMENTARIO}</Text>
                {review.IDENTIFICADOR === clienteId && (
                  <View style={styles.commentButtons}>
                    <TouchableOpacity style={styles.editButton} onPress={() => {/* Lógica para editar */}}>
                      <Ionicons name="pencil" size={20} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => {/* Lógica para eliminar */}}>
                      <Ionicons name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.fecha}>{formatFecha(review.FECHA)}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
            <Ionicons name="arrow-back" size={24} color="black" />
            <Text style={styles.backButtonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    left: windowWidth * 0.47,
  },
  reviewCard: {
    maxWidth: windowWidth * 0.95,
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
    maxWidth: windowWidth * 0.7,
  },
  rating: {
    fontSize: 14,
    color: '#ffcc00',
  },
  comment: {
    maxWidth: windowWidth * 0.9,
    fontSize: 16,
    color: '#333',
  },
  commentButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#334195',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentsContainer: {
    flex: 1,
    marginTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 10,
  },
  fecha: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    maxWidth: windowWidth * 0.9,
  },
});

export default ProductReviews;
