import React, { useState } from 'react';
import { View, StyleSheet, Text, FlatList, Dimensions, ScrollView } from 'react-native';
import { Button, FAB, Card, Searchbar, Menu, Provider, Modal, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const windowHeight = Dimensions.get('window').height;

const products = [
  { id: '1', title: 'Hamaca', price: '$299,43', image: 'https://via.placeholder.com/150' },
  { id: '2', title: 'Hamaca', price: '$299,43', image: 'https://via.placeholder.com/150' },
  { id: '3', title: 'Hamaca', price: '$299,43', image: 'https://via.placeholder.com/150' },
  { id: '4', title: 'Hamaca', price: '$299,43', image: 'https://via.placeholder.com/150' },
  { id: '5', title: 'Hamaca', price: '$299,43', image: 'https://via.placeholder.com/150' },
  { id: '6', title: 'Hamaca', price: '$299,43', image: 'https://via.placeholder.com/150' },
];

const ShoppingScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const navigation = useNavigation();

  const onChangeSearch = query => setSearchQuery(query);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSortOption = (option) => {
    setSortOption(option);
    closeMenu();
    // Implementar la lógica de ordenamiento aquí
  };

  const handleProductPress = (product) => {
    navigation.navigate('DetailProduct', { product });
  };

  const renderProductItem = ({ item }) => (
    <Card style={styles.card} onPress={() => handleProductPress(item)}>
      <Card.Cover source={{ uri: item.image }} />
      <Card.Content>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </Card.Content>
    </Card>
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
          <Button mode="text" onPress={openMenu} style={styles.resultsText}>
            Ordenar resultados
          </Button>
        </View>
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productsList}
        />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <FAB
              style={styles.fab}
              small
              icon="sort"
              onPress={openMenu}
            />
          }
        >
          <Menu.Item onPress={() => handleSortOption('alphabetically')} title="Ordenar alfabéticamente" />
          <Menu.Item onPress={() => handleSortOption('date')} title="Ordenar por fecha de ingreso" />
          <Menu.Item onPress={() => handleSortOption('priceHighToLow')} title="Ordenar por mayor precio" />
          <Menu.Item onPress={() => handleSortOption('priceLowToHigh')} title="Ordenar por menor precio" />
        </Menu>
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
    color: 'gray'
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
    color: '#888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
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
