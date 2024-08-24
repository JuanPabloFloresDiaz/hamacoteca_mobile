// Importaciones necesarias
import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, Dimensions, RefreshControl, ScrollView, Alert } from 'react-native';
import { Button, Searchbar, Menu, Provider, Modal, Portal } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import fetchData from '../../api/components'; // Importa función para realizar peticiones API
import CarritoCard from '../components/DetailProductCart/CarritoCard';
import ModalEditarCantidad from '../components/DetailProductCart/ModalEditar';
import * as Constantes from '../../api/constantes';
// URL base del servidor
const SERVER_URL = Constantes.SERVER_URL;


//Constante para manejar el alto de la pantalla
const windowHeight = Dimensions.get('window').height;

const Carrito = ({ navigation, logueado, setLogueado, setCategoryId }) => {
  // Estado para almacenar los detalles del carrito
  const [dataDetalleCarrito, setDataDetalleCarrito] = useState([]);
  // Estado para el id del detalle seleccionado para modificar
  const [idDetalle, setIdDetalle] = useState(null);
  // Estado para la cantidad del producto seleccionado en el carrito
  const [cantidadProductoCarrito, setCantidadProductoCarrito] = useState(0);
  // Estado para las existencias del producto seleccionado en el carrito
  const [existencias, setExistencias] = useState(0);
  // Estado para controlar la visibilidad del modal de edición de cantidad
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  //Url de la api
  const PEDIDO_API = 'servicios/publica/pedido.php';
  // Función para navegar hacia atrás a la pantalla de productos
  const backProducts = () => {
    navigation.navigate('RecoverPassword');
  };

  useEffect(() => {
    getDetalleCarrito();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getDetalleCarrito();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true); // Activar el estado de refresco

    // Lógica para recargar los datos
    getDetalleCarrito();

    setRefreshing(false); // Desactivar el estado de refresco cuando se complete
  }, []);

  // Efecto para cargar los detalles del carrito al cargar la pantalla o al enfocarse en ella
  useFocusEffect(
    // La función useFocusEffect ejecuta un efecto cada vez que la pantalla se enfoca.
    React.useCallback(() => {
      getDetalleCarrito(); // Llama a la función getDetalleCarrito.
      setCategoryId(null);
    }, [])
  );

  // Función para obtener los detalles del carrito desde el servidor
  const getDetalleCarrito = async () => {
    try {
      const data = await fetchData(PEDIDO_API, 'readDetail');
      if (data.status) {
        setDataDetalleCarrito(data.dataset);
      } else {
        console.log("No hay detalles del carrito disponibles")
        //Alert.alert('ADVERTENCIA', data.error);
      }
    } catch (error) {
      console.log(error, "Error desde Catch");
      Alert.alert('Error', 'Ocurrió un error al listar las categorias');
    }
  };



  // Función para finalizar el pedido
  const finalizarPedido = async () => {
    try {
      // Mostrar un mensaje de confirmación antes de eliminar
      Alert.alert(
        'Confirmación',
        '¿Está seguro de finalizar el pedido?',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Aceptar',
            onPress: async () => {
              // Realización de la petición de finalizar pedido
              const data = await fetchData(PEDIDO_API, 'finishOrder');
              if (data.status) {
                Alert.alert("Pedido finalizado correctamente")
                setDataDetalleCarrito([]); // Limpia la lista de detalles del carrito
                //navigation.navigate('TabNavigator', { screen: 'Productos' });
                // Abre la URL de la factura en el navegador predeterminado
                const invoiceUrl = `${SERVER_URL}reportes/publica/factura_de_comprobante_de_compra.php`;
                //Navegar a la factura
                navigation.navigate("LoginNav", {
                  screen: "PDFViewer",
                  params: { pdfUrl: invoiceUrl },
                });
              } else {
                Alert.alert('Error', data.error);
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error al eliminar del carrito")
    }
  };

  // Función para manejar la modificación de un detalle del carrito
  const handleEditarDetalle = (idDetalle, cantidadDetalle, existencias) => {
    setModalVisible(true);
    setIdDetalle(idDetalle);
    setCantidadProductoCarrito(cantidadDetalle);
    setExistencias(existencias);
  };

  // Función para renderizar cada elemento del carrito
  const renderItem = ({ item }) => (
    <CarritoCard
      item={item}
      cargarCategorias={getDetalleCarrito}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      setCantidadProductoCarrito={setCantidadProductoCarrito}
      cantidadProductoCarrito={cantidadProductoCarrito}
      idDetalle={idDetalle}
      setIdDetalle={setIdDetalle}
      accionBotonDetalle={handleEditarDetalle}
      getDetalleCarrito={getDetalleCarrito}
      updateDataDetalleCarrito={setDataDetalleCarrito}
    // Nueva prop para actualizar la lista
    />
  );

  // Función para calcular el total de productos en el carrito
  const getTotalDinero = () => {
    return dataDetalleCarrito.reduce((total, item) => {
      const precio = Number(item.PRECIO);
      const cantidad = Number(item.CANTIDAD);
      return total + ((isNaN(precio) || isNaN(cantidad)) ? 0 : precio * cantidad);
    }, 0).toFixed(2);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <ModalEditarCantidad
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          idDetalle={idDetalle}
          setIdDetalle={setIdDetalle}
          setCantidadProductoCarrito={setCantidadProductoCarrito}
          cantidadProductoCarrito={cantidadProductoCarrito}
          getDetalleCarrito={getDetalleCarrito}
          existencias={existencias}
        />
        {dataDetalleCarrito.length > 0 && (
          <Text style={styles.resultsText}>Tus pedidos</Text>
        )}
        {dataDetalleCarrito.length > 0 ? (
          <FlatList
            data={dataDetalleCarrito}
            renderItem={renderItem}
            keyExtractor={(item) => item.ID.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#9Bd35A', '#689F38']}
                progressBackgroundColor="#EBF0FF"
              />
            }
          />
        ) : (
          <Text style={styles.titleDetalle}>No hay productos en el carrito.</Text>
        )}
        {dataDetalleCarrito.length > 0 && (
          <Text style={styles.titleTotal}>Total: ${getTotalDinero()}</Text>
        )}
        {dataDetalleCarrito.length > 0 && (
          <Button mode="contained" onPress={finalizarPedido} style={styles.button}>
            Finalizar pedido
          </Button>
        )}
      </View>
    </Provider>

  );
};

export default Carrito;

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: windowHeight * 0.11,
  },
  resultsText: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#5C3D2E',
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'black',
  },
  titleDetalle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 300,
    textAlign: 'center',
    marginVertical: 16,
    color: '#000',
  },
  titleTotal: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 1,
    marginVertical: 16,
    color: '#000',
  },
  containerButtons: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
