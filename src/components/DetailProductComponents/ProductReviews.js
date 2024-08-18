import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Dimensions, Modal, TextInput, TouchableOpacity } from 'react-native';
import imageData from '../../../api/images';
import { Ionicons } from '@expo/vector-icons';
import fetchData from '../../../api/components';
import StarRating from './StarRating';
import AlertComponent from '../AlertComponent';
import { useFocusEffect, useNavigation, CommonActions } from '@react-navigation/native';
import { Button, Dialog, Paragraph, Portal, PaperProvider } from 'react-native-paper';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const VALORACIONES_API = 'servicios/publica/valoracion.php';

const ProductReviews = ({ reviews, clienteId, productId, onRefresh }) => {
  const [avatarUrls, setAvatarUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(1);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState(1);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertCallback, setAlertCallback] = useState(null);
  const navigation = useNavigation();

  // Estados para manejar la visibilidad de los modales y diálogos
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [idToUpdate, setIdToUpdate] = useState(null);

  // Limpiar campos del formulario
  const limpiarCampos = async () => {
    setIdToUpdate(null);
    setIdToDelete(null);
    setNewComment('');
    setNewRating(1);
  };

  const showDeleteDialog = (id) => {
    setIdToDelete(id);
    setDeleteDialogVisible(true);
  };
  const hideDeleteDialog = () => setDeleteDialogVisible(false);

  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertCallback) alertCallback();
  };


  // Confirmar eliminación de registros
  const confirmarEliminacion = () => {
    deleteComment(idToDelete);
  };

  
  const modalVisibleAndRecharge = async() => {
    limpiarCampos();
    setModalVisible(false);
    if (onRefresh) onRefresh();
  }
  // Eliminar registros de la API
  const deleteComment = async (id) => {
    try {
      const form = new FormData();
      form.append('producto', productId);
      form.append('idComentario', id);
      const data = await fetchData(VALORACIONES_API, 'deleteRow', form);
      if (data.status) {
        limpiarCampos();
        setAlertType(1);
        setAlertMessage(`${data.message}`);
        setAlertCallback(() => () => modalVisibleAndRecharge());
        setAlertVisible(true);
      } else {
        limpiarCampos();
        setAlertType(2);
        setAlertMessage(`${data.error} ${data.exception}`);
        setAlertCallback(null);
        setAlertVisible(true);
      }
    } catch (error) {
      limpiarCampos();
      setAlertType(2);
      setAlertMessage(`${error}`);
      setAlertCallback(null);
      setAlertVisible(true);
    }
    hideDeleteDialog();
  };


  // Manejo de edición de un ítem
  const openUpdate = async (id) => {
    console.log('id actualizar', id);
    const form = new FormData();
    form.append('idValoracion', id);
    const data = await fetchData(VALORACIONES_API, 'readOneComment', form);
    if (data.status) {
      const row = data.dataset;
      setIdToUpdate(id);
      setNewComment(row.COMENTARIO);
      setNewRating(row.CALIFICACIÓN);
    } else {
      Alert.alert('Error', data.error);
    }
  };

  // Actualizar registros en la API
  const updateComment = async () => {
    try {
      console.log('Comentario actualizado ', idToUpdate);
      console.log('Comentario actualizado ', newRating);
      console.log('Comentario actualizado ', newComment);
      const form = new FormData();
      form.append('valoracion', newRating);
      form.append('comentario', newComment);
      form.append('producto', productId);
      form.append('idComentario', idToUpdate);
      const data = await fetchData(VALORACIONES_API, 'updateRow', form);
      if (data.status) {
        limpiarCampos();
        setAlertType(1);
        setAlertMessage(`${data.message}`);
        setAlertCallback(() => () => modalVisibleAndRecharge());
        setAlertVisible(true);
      } else {
        limpiarCampos();
        setAlertType(2);
        setAlertMessage(`${data.error} ${data.exception}`);
        setAlertCallback(null);
        setAlertVisible(true);
      }
    } catch (error) {
      limpiarCampos();
      setAlertType(2);
      setAlertMessage(`${error}`);
      setAlertCallback(null);
      setAlertVisible(true);
    }
  };

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

  
  useFocusEffect(
    useCallback(() => {
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
    }, [reviews])
  );

  const handleRatingChange = (rating) => {
    setNewRating(rating);
    console.log(rating);
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

  const addComment = async () => {
    try {
      const form = new FormData();
      form.append('valoracion', newRating);
      form.append('comentario', newComment);
      form.append('producto', productId);
      const data = await fetchData(VALORACIONES_API, 'createRow', form);
      if (data.status) {
        limpiarCampos();
        setAlertType(1);
        setAlertMessage(`${data.message}`);
        setAlertCallback(() => () => modalVisibleAndRecharge());
        setAlertVisible(true);
      } else {
        limpiarCampos();
        setAlertType(2);
        setAlertMessage(`${data.error} ${data.exception}`);
        setAlertCallback(null);
        setAlertVisible(true);
      }
    } catch (error) {
      limpiarCampos();
      setAlertType(2);
      setAlertMessage(`${error}`);
      setAlertCallback(null);
      setAlertVisible(true);
    }
  };


  // Identificador de si se ingresa o se actualiza
  const handleSubmit = () => {
    if (idToUpdate) {
      updateComment();
    } else {
      addComment();
    }
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
          <Text style={styles.modalTitle}>{idToUpdate ? 'Editar comentario' : 'Añadir comentario'}</Text>
          <StarRating
            rating={newRating}
            onChange={handleRatingChange}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Escribe tu comentario aquí..."
            multiline={true}
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
            <Text style={styles.addButtonText}>{idToUpdate ? 'Editar comentario' : 'Añadir comentario'}</Text>
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
                    <TouchableOpacity style={styles.editButton} onPress={() => openUpdate(review.ID)}>
                      <Ionicons name="pencil" size={20} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => showDeleteDialog(review.ID)}>
                      <Ionicons name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.fecha}>{formatFecha(review.FECHA)}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.backButton} onPress={() => modalVisibleAndRecharge()}>
            <Ionicons name="arrow-back" size={24} color="black" />
            <Text style={styles.backButtonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
        <AlertComponent
          visible={alertVisible}
          type={alertType}
          message={alertMessage}
          onClose={handleAlertClose}
        />
        <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Confirmar Eliminación</Dialog.Title>
          <Dialog.Content>
            <Paragraph>¿Estás seguro de que deseas eliminar este comentario?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog}>Cancelar</Button>
            <Button onPress={confirmarEliminacion}>Aceptar</Button>
          </Dialog.Actions>
        </Dialog>
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
    borderLeftColor: '#4CAF50',
    borderLeftWidth: 5,
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
    backgroundColor: '#000',
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
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dialogButtonCancel: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  dialogButtonConfirm: {
    backgroundColor: '#d9534f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  dialogButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProductReviews;
