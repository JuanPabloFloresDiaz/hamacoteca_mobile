import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text, FlatList, Dimensions, ScrollView, RefreshControl, Alert  } from 'react-native';
import { Button, Searchbar, Menu, Provider, Modal, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import fetchData from '../../api/components';
import ProductItem from '../components/ProductCart';
import AlertComponent from '../components/AlertComponent';

const windowHeight = Dimensions.get('window').height;


const CartScreen = ({ logueado, setLogueado }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [quantityProducts, setQuantityProducts] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState(1);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertCallback, setAlertCallback] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const navigation = useNavigation();
  const [dataProductos, setDataProductos] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onChangeSearch = query => setSearchQuery(query);
  const PEDIDO_API = 'servicios/publica/pedido.php';
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSortOption = (option) => {
    setSortOption(option);
    closeMenu();
    // Implementar la lógica de ordenamiento aquí
  };

  const handleProductPress = async (productId) => {
    Alert.alert(
      'Confirmación',
      '¿Desea eliminar el pedido de forma permanente?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const data = await fetchData(PEDIDO_API, 'deleteDetail', productId);
              if (data.status) {
                Alert.alert('Éxito', data.message);
                fillProducts(); // Recargar la lista de productos
              } else {
                Alert.alert('Error', data.error);
              }
            } catch (error) {
              console.log(error + ' Error al cargar el mensaje');
            }
          },
        },
      ],
      { cancelable: true }
    );
      
    
  };

  

  const fillProducts = async () => {
    try {
      const data = await fetchData(PEDIDO_API, 'readDetail');
      setDataProductos(data.dataset);
      setQuantityProducts(data.message);
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {
    fillProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fillProducts();
    }, [])
  );

  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertCallback) alertCallback();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true); // Activar el estado de refresco

    // Lógica para recargar los datos
    fillProducts();

    setRefreshing(false); // Desactivar el estado de refresco cuando se complete
  }, []);

  const renderProductsItem = ({ item }) => (
    <ProductItem item={item} onPress={handleProductPress} />
  );

  const showModal = () => setFilterModalVisible(true);
  const hideModal = () => setFilterModalVisible(false);

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.resultsText}>Tus pedidos</Text>
        <FlatList
          data={dataProductos}
          renderItem={renderProductsItem}
          keyExtractor={(item) => item.ID}
          numColumns={1}
          contentContainerStyle={styles.productsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#9Bd35A', '#689F38']}
              progressBackgroundColor="#EBF0FF"
            />
          }
        />
      </View>
      <AlertComponent
        visible={alertVisible}
        type={alertType}
        message={alertMessage}
        onClose={handleAlertClose}
      />
    </Provider>
  );
}

export default CartScreen;


// Estilos para los componentes.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: windowHeight * 0.11,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchbar: {
    flex: 1,
    marginVertical: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EBF0FF',
    color: 'gray',
  },
  filterButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultsText: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  productsList: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
  },
  productTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    marginTop: 5,
    fontSize: 16,
    color: '#334195',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceRange: {
    fontSize: 14,
    color: 'gray',
  },
  categoryButton: {
    marginVertical: 5,
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: 'black',
  },
});
