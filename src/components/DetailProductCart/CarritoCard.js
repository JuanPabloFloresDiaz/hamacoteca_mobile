import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Card, ActivityIndicator, PaperProvider } from 'react-native-paper';
import Constants from 'expo-constants';
import fetchData from '../../../api/components'; // Importa función para realizar peticiones API
import imageData from '../../../api/images'; // Importa función para obtener datos de imagen
import iconDelete from '../../../assets/icon-delete.png';
import iconEdit from '../../../assets/icon-edit-cart.png';
import AlertComponent from '../AlertComponent';

const CarritoCard = ({item, cargarCategorias, 
  modalVisible,
  setModalVisible,
  cantidadProductoCarrito,
  setCantidadProductoCarrito, 
  accionBotonDetalle,
  idDetalle,
  setIdDetalle, getDetalleCarrito, updateDataDetalleCarrito}) => {
 
    //Constantes para el manejo de la imagen
    const [imagenUrl, setImagenUrl] = useState(null);

    //Constantes para el manejo de datos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState(1);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertCallback, setAlertCallback] = useState(null);

    //Url de la api
    const PEDIDO_API = 'servicios/publica/pedido.php';

    const handleAlertClose = () => {
      setAlertVisible(false);
      if (alertCallback) alertCallback();
    };

    // Función para eliminar un detalle del carrito
    const handleDeleteDetalleCarrito = async (idDetalle) => {
      try {
        // Mostrar un mensaje de confirmación antes de eliminar
        Alert.alert(
          'Confirmación',
          '¿Estás seguro de que deseas eliminar este elemento del carrito?',
          [
            {
              text: 'Cancelar',
              style: 'cancel'
            },
            {
              text: 'Eliminar',
              onPress: async () => {
                // Creación del formulario para la petición
                const formData = new FormData();
                formData.append('idPedido', idDetalle);
                // Realización de la petición de eliminar
                const data = await fetchData(PEDIDO_API, 'deleteDetail', formData);
                if (data.status) {
                  Alert.alert('Producto removido correctamente');
                  // Llamar a la función de actualización para actualizar la lista
                  updateDataDetalleCarrito(prevData => prevData.filter(item => item.ID !== idDetalle));
                } else {
                  Alert.alert('Error al eliminar del carrito', data.error);
                }
              }
            }
          ]
        );
      } catch (error) {
        Alert.alert("Error al eliminar del carrito")
      }
    };

    //Metodo para cargar la imagen y manejar el error en caso de que no se encuentren
    useEffect(() => {
      const cargarImagen = async () => {
        try {
          const uri = await imageData('hamacas', item.IMAGEN);
          setImagenUrl(uri);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
  
      cargarImagen();
    }, [item.IMAGEN]);

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  
    if (error) {
      return <Text>Error al cargar la imagen</Text>;
    }
  
    return (
      <PaperProvider>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <Image source={{ uri: imagenUrl }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.productTitle}>{item.NOMBRE}</Text>
              <Text style={styles.productPrice}>Cantidad: {item.CANTIDAD}</Text>
              <Text style={styles.productPrice}>${item.PRECIO}</Text>
            </View>
            <View tyle={styles.infoContainer}>
            <TouchableOpacity onPress={()=>accionBotonDetalle(item.ID, item.CANTIDAD)} style={styles.editButton}>
              <Image source={iconEdit} style={styles.imagenDelete} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>handleDeleteDetalleCarrito(item.ID)} style={styles.deleteButton}>
              <Image source={iconDelete} style={styles.imagenDelete} />
            </TouchableOpacity>
            </View>
          </View>
        </Card>
      </PaperProvider>
    );
};

export default CarritoCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    zIndex:2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#000',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  deleteButton: {
    size: 24,
    marginLeft: 10,
    
  },
  editButton: {
    size: 24,
    marginLeft: 10,
    marginTop:5,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#f00',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagenDelete: {
    width: 24,
    height: 24,
  }
});
