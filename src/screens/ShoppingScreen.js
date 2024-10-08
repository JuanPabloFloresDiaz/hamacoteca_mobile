import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text, FlatList, Dimensions, ScrollView, RefreshControl, Image } from 'react-native';
import { Button, Searchbar, Menu, Provider, Tooltip, IconButton, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import fetchData from '../../api/components';
import ProductItem from '../components/ProductItem';
import FilterModal from '../components/FilterModal';
//Constante para manejar el alto de la pantalla
const windowHeight = Dimensions.get('window').height;

const ShoppingScreen = ({ categoryId, setCategoryId }) => {
  console.log('idCategoria redirigido a la pantalla shopping: ' + categoryId);
  //Constantes para el manejo de datos
  const [searchQuery, setSearchQuery] = useState('');
  const [quantityProducts, setQuantityProducts] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const navigation = useNavigation();
  const [dataProductos, setDataProductos] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadedItems, setLoadedItems] = useState(4);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(false);
  //Constantes para la busqueda con el elemento de la libreria searchBar
  const onChangeSearch = query => setSearchQuery(query);

  //Constantes para el manejo del menú de ordenar resultados
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  // Función para ordenar los productos
  const sortProducts = (option) => {
    let sortedProducts = [...dataProductos];
    switch (option) {
      case 'alphabetically':
        sortedProducts.sort((a, b) => a.NOMBRE.localeCompare(b.NOMBRE));
        break;
      case 'priceHighToLow':
        sortedProducts.sort((a, b) => b.PRECIO - a.PRECIO);
        break;
      case 'priceLowToHigh':
        sortedProducts.sort((a, b) => a.PRECIO - b.PRECIO);
        break;
      default:
        break;
    }
    setDataProductos(sortedProducts);
  };

  //Constante para ocultar el menú de opciones de ordenar resultados
  const handleSortOption = (option) => {
    setSortOption(option);
    closeMenu();
    sortProducts(option);
  };

  //Url de la api
  const HAMACAS_API = 'servicios/publica/hamaca.php';

  //Metodo para cargar los productos, con la condición de que si se esta buscando algo, entonces busca, si no muestra todo
  const fillProducts = async (searchForm = null) => {
    try {
      setLoading(true);
      //Verificación de acción a realizar
      if (!categoryId) {
        const action = searchForm ? 'searchRows' : 'readAll';
        //Petición a la api
        const data = await fetchData(HAMACAS_API, action, searchForm);
        //La petición funciona correctamente
        if (data.status) {
          setDataProductos(data.dataset);
          setQuantityProducts(data.message);
          if (sortOption) {
            sortProducts(sortOption); // Aplicar ordenamiento actual
          }
          setLoading(false);
          setResponse(true);
        }
        //Si la petición falla
        else {
          setDataProductos([]);
          setQuantityProducts('Existen 0 coincidencias');
          setLoading(false);
          setResponse(false);
        }
      } else {
        searchForm = new FormData();
        searchForm.append('idCategoria', categoryId);
        //Petición a la api
        const data = await fetchData(HAMACAS_API, 'readProductosCategoria', searchForm);
        //La petición funciona correctamente
        if (data.status) {
          setDataProductos(data.dataset);
          setQuantityProducts(data.message);
          if (sortOption) {
            sortProducts(sortOption); // Aplicar ordenamiento actual
          }
          setLoading(false);
          setResponse(true);
        }
        //Si la petición falla
        else {
          setDataProductos([]);
          setQuantityProducts('Existen 0 coincidencias');
          setLoading(false);
          setResponse(false);
        }
      }
    } catch (error) {
      setError(error);
    }
  }


  //Metodo para cargar los productos, con la condición de que si se esta buscando algo, entonces busca, si no muestra todo
  const filterProducts = async (filters = null) => {
    try {
      setDataProductos([]);
      setLoading(true);
      //Petición a la api
      const data = await fetchData(HAMACAS_API, 'filterRows', filters);
      //La petición funciona correctamente
      if (data.status) {
        setDataProductos(data.dataset);
        setQuantityProducts(data.message);
        if (sortOption) {
          sortProducts(sortOption); // Aplicar ordenamiento actual
        }
        setLoading(false);
        setResponse(true);
      }
      //Si la petición falla
      else {
        setDataProductos([]);
        setQuantityProducts('Existen 0 coincidencias');
        setLoading(false);
        setResponse(false);
      }
    } catch (error) {
      setError(error);
    }
  }

  //Constante para que al seleccionar un producto, redirija a la pantalla de detalle de producto, enviando el id del producto
  const handleProductPress = (productId) => {
    //Verificación de si el identificador del producto se ha enviado bien
    if (!productId) {
      alert('No se pudo cargar el producto');
      return;
    }
    console.log("Producto seleccionado " + productId);
    //Navegar a detalle de producto
    navigation.navigate('LoginNav', { screen: 'DetailProduct', params: { productId } });
  };

  //Cargar los productos
  useEffect(() => {
    const initializeApp = async () => {
      await fillProducts();
      setLoading(false);
    };
    initializeApp();
  }, []);

  //Cargar los productos después de volver a cargar la pantalla en el menú
  useFocusEffect(
    useCallback(() => {
      const initializeApp = async () => {
        await fillProducts();
        setLoading(false);
      };
      initializeApp();
    }, [])
  );

  //Metodo para refrescar la pantalla
  const onRefresh = useCallback(async () => {
    setRefreshing(true); // Activar el estado de refresco
    // Lógica para recargar los datos
    await fillProducts();
    setLoading(false);
    setRefreshing(false); // Desactivar el estado de refresco cuando se complete
  }, []);
  //Verificación, buscar si existe algo buscado en el campo de buscar, si no leer todo
  useEffect(() => {
    if (searchQuery != '') {
      const formData = new FormData();
      formData.append('search', searchQuery);
      fillProducts(formData);
    } else {
      fillProducts();
    }
  }, [searchQuery]);

  //Renderizador de las cartas de los productos
  const renderProductsItem = ({ item }) => (
    <ProductItem item={item} onPress={handleProductPress} />
  );

  //Metodos para el manejo de los modals
  const showModal = () => setFilterModalVisible(true);
  const hideModal = () => setFilterModalVisible(false);

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar productos"
            placeholderTextColor='gray'
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchbar}
          />
          <Tooltip title="Filtrar productos">
            <Button mode="contained" onPress={showModal} style={styles.filterButton}>
              <Ionicons name="filter-outline" size={20} color="gray" style={styles.filterIcon} />
            </Button>
          </Tooltip>
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.resultsText}>{quantityProducts}</Text>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Button mode="text" onPress={openMenu} style={styles.resultsText}>
                Ordenar resultados
              </Button>
            }
          >
            <Menu.Item onPress={() => handleSortOption('alphabetically')} title="Ordenar alfabéticamente" />
            <Menu.Item onPress={() => handleSortOption('priceHighToLow')} title="Ordenar por mayor precio" />
            <Menu.Item onPress={() => handleSortOption('priceLowToHigh')} title="Ordenar por menor precio" />
          </Menu>
        </View>

        {loading ? (
          <ActivityIndicator animating={true} color={'#334195'} />
        ) : (
          response ? (
            <FlatList
              data={dataProductos}
              renderItem={renderProductsItem}
              keyExtractor={(item) => item.ID}
              numColumns={2}
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
          ) : (
            <ScrollView
              style={styles.scrollContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            >
              <View style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ height: 200, width: 200, marginBottom: 10 }} source={require('../../assets/not-found.png')} />
              </View>
            </ScrollView>
          ))}
        <FilterModal visible={filterModalVisible} onDismiss={hideModal} applyFilters={filterProducts} />
      </View>
    </Provider>
  );
};

export default ShoppingScreen;

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
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  productsList: {
    paddingBottom: 10,
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