import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text, FlatList, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { Button, Searchbar, Menu, Provider, Modal, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import fetchData from '../../api/components';
import ProductItem from '../components/ProductItem';

const windowHeight = Dimensions.get('window').height;

const ShoppingScreen = ({ logueado, setLogueado }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const navigation = useNavigation();
  const [dataProductos, setDataProductos] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onChangeSearch = query => setSearchQuery(query);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSortOption = (option) => {
    setSortOption(option);
    closeMenu();
    // Implementar la lógica de ordenamiento aquí
  };

  const handleProductPress = (product) => {
    if (!product) {
      alert('No se pudo cargar el producto');
      return;
    }
    console.log("Producto seleccionado " + product);
    navigation.navigate('LoginNav', { screen: 'DetailProduct', params: { product } });
  };

  const HAMACAS_API = 'servicios/publica/hamaca.php';

  const fillProducts = async () => {
    try {
      const data = await fetchData(HAMACAS_API, 'readAll');
      setDataProductos(data.dataset);
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
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar productos"
            placeholderTextColor='gray'
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchbar}
          />
          <Button mode="contained" onPress={showModal} style={styles.filterButton}>
            <Ionicons name="filter-outline" size={20} color="gray" style={styles.filterIcon} />
          </Button>
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.resultsText}>30 Resultados</Text>
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
            <Menu.Item onPress={() => handleSortOption('date')} title="Ordenar por fecha de ingreso" />
            <Menu.Item onPress={() => handleSortOption('priceHighToLow')} title="Ordenar por mayor precio" />
            <Menu.Item onPress={() => handleSortOption('priceLowToHigh')} title="Ordenar por menor precio" />
          </Menu>
        </View>
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
        <Portal>
          <Modal visible={filterModalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Rango de precio</Text>
                <Text style={styles.priceRange}>$1,245 - $9,344</Text>
                {/* Aquí puedes agregar un Slider para el rango de precio */}
              </View>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Categorías</Text>
                <Button mode="contained" style={styles.categoryButton}>Clásicas</Button>
                <Button mode="contained" style={styles.categoryButton}>De Tela</Button>
                <Button mode="contained" style={styles.categoryButton}>Con soporte</Button>
                <Button mode="contained" style={styles.categoryButton}>Sillas</Button>
                <Button mode="contained" style={styles.categoryButton}>Otros</Button>
              </View>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Material</Text>
                <Button mode="contained" style={styles.categoryButton}>Cordón de Nylon</Button>
                <Button mode="contained" style={styles.categoryButton}>Algodón orgánico</Button>
                <Button mode="contained" style={styles.categoryButton}>Tela impermeable</Button>
                <Button mode="contained" style={styles.categoryButton}>Seda de paracaídas</Button>
                <Button mode="contained" style={styles.categoryButton}>Algodón</Button>
              </View>
              <Button mode="contained" onPress={hideModal} style={styles.applyButton}>
                Filtrar
              </Button>
            </ScrollView>
          </Modal>
        </Portal>
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
