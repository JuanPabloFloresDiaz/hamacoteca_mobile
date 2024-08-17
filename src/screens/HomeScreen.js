import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import Swiper from 'react-native-swiper';
import { Ionicons } from '@expo/vector-icons';
import fetchData from '../../api/components';
import AlertComponent from '../components/AlertComponent';
import { useFocusEffect } from "@react-navigation/native";
import ProductItem from '../components/ProductItem';
import CategoryItem from '../components/CategoriesItem';
import { useNavigation } from '@react-navigation/native';

//Obtiene la altura de la ventana
const { width, height } = Dimensions.get('window');

const HomeScreen = ({ categoryId, setCategoryId }) => {
  //Definición de elementos del carrusel
  const carouselItems = [
    {
      title: "Hamacas de gran calidad",
      image: require('../../assets/imagen.png'),
    },
    {
      title: "Hamacas cómodas",
      image: require('../../assets/hamaca1.png'),
    },
    {
      title: "Hamacas para exteriores",
      image: require('../../assets/hamaca2.png'),
    },
  ];

  //URL de la API
  const API = 'servicios/publica/cliente.php';
  let PRODUCTOS_API = 'servicios/publica/hamaca.php';
  let CATEGORIAS_API = 'servicios/publica/categoria.php';

  //Estado para almacenar el nombre de usuario
  const [username, setUsername] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [productosSemana, setProductosSemana] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  //Función para obtener el nombre de usuario desde la API
  const getUser = async () => {
    setUsername('');
    try {
      const data = await fetchData(API, 'getUser');
      if (data.session) {
        //Establece el nombre de usuario
        setUsername(data.username);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Metodo para cargar los productos de la semana
  const fillProductsWeek = async () => {
    try {
      //Petición a la api
      const data = await fetchData(PRODUCTOS_API, "readMostSell");
      //La petición funciona correctamente
      if (data.status) {
        setProductosSemana(data.dataset);
      }
      //Si la petición falla
      else {
        setProductosSemana([]);
      }
    } catch (error) {
      setError(error);
    }
  }

  //Metodo para cargar los productos, con la condición de que si se esta buscando algo, entonces busca, si no muestra todo
  const fillCategories = async () => {
    try {
      //Petición a la api
      const data = await fetchData(CATEGORIAS_API, "readAll");
      //La petición funciona correctamente
      if (data.status) {
        setCategorias(data.dataset);
      }
      //Si la petición falla
      else {
        setCategorias([]);
      }
    } catch (error) {
      setError(error);
    }
  }

  //Obtiene el nombre del usuario cuando el componente se monte
  useEffect(() => {
    const initializeApp = async () => {
      await getUser();
      await fillCategories();
      await fillProductsWeek();
    };
    initializeApp();
  }, []);


  useFocusEffect(
    useCallback(() => {
      const initializeApp = async () => {
        await getUser();
        await fillCategories();
        await fillProductsWeek();
        await setCategoryId(null); // Actualizar el estado en BottomTab
      };
      initializeApp();
    }, [])
  );

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


  //Constante para que al seleccionar un producto, redirija a la pantalla de detalle de producto, enviando el id del producto
  const handlePress = async () => {
    setCategoryId(null); // Actualizar el estado en BottomTab
    navigation.navigate('Tienda');
  };

  //Constante para que al seleccionar un producto, redirija a la pantalla de detalle de producto, enviando el id del producto
  const handleCategoryPress = async (categoria) => {
    //Verificación de si el identificador del producto se ha enviado bien
    if (!categoria) {
      alert('No se pudo cargar la categoría');
      return;
    } else {
      setCategoryId(categoria); // Actualizar el estado en BottomTab
      console.log("Categoría seleccionado en pantalla home" + categoryId);
      //Navegar a detalle de producto
      navigation.navigate('Tienda', { categoryId });
    }
  };

  //Renderizador de las cartas de los productos
  const renderProductItem = ({ item }) => (
    <ProductItem item={item} onPress={handleProductPress} />
  );


  //Renderizador de las cartas de los productos
  const renderCategoryItem = ({ item }) => (
    <CategoryItem item={item} onPress={handleCategoryPress} />
  );


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Carrusel */}
      <Swiper
        style={styles.wrapper}
        showsButtons={true}
        autoplay={true}
        dotColor="white"
        activeDotColor="white"
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        nextButton={<Text style={styles.buttonText}>›</Text>}
        prevButton={<Text style={styles.buttonText}>‹</Text>}
      >
        {carouselItems.map((item, index) => (
          <View style={styles.slide} key={index}>
            <Image source={item.image} style={styles.featuredImage} />
            <View style={styles.featuredTextOverlay}>
              <Text style={styles.featuredTitle}>{item.title}</Text>
              <TouchableOpacity style={styles.featuredButton} onPress={handlePress}>
                <Text style={styles.featuredButtonText}>Ver productos</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </Swiper>

      {/* Texto de bienvenida y categorías */}
      <View style={styles.welcomeContainer}>
        <Image
          source={require('../../assets/welcome.jpg')}
          style={styles.welcomeImage}
        />
        <View style={styles.welcomeOverlay}>
          <Text style={styles.welcomeTitle}>Bienvenido {username}</Text>
          <Text style={styles.welcomeSubtitle}>Explora nuestra tienda y disfruta de las mejores hamacas, solo en Hamacoteca</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Categorías</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categorias.map((item, index) => (
          <View key={index}>
            {renderCategoryItem({ item })}
          </View>
        ))}
      </ScrollView>

      {/* Products de la semana */}
      <View style={styles.productsOfWeekContainer}>
        <Image
          source={require('../../assets/productos.png')}
          style={styles.productsOfWeekImage}
        />
        <View style={styles.productsOfWeekOverlay}>
          <Text style={styles.productsOfWeekTitle}>Productos de la semana</Text>
          <Text style={styles.productsOfWeekSubtitle}>Las hamacas del momento</Text>
        </View>
        <View style={styles.productGrid}>
          {productosSemana.map((item, index) => (
            <View key={index} style={styles.productItem}>
              {renderProductItem({ item })}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',

  },
  contentContainer: {
    paddingBottom: 100,
  },
  wrapper: {
    height: 300,
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  featuredImage: {
    width: width,
    height: 300,
    position: 'absolute',
  },
  featuredTextOverlay: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: width,
    alignItems: 'center',
  },
  featuredTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  featuredButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  featuredButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#223263',
    marginTop: 20,
    marginLeft: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 16,
  },
  productsOfWeekContainer: {
    padding: 10,
  },
  productsOfWeekImage: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  productsOfWeekOverlay: {
    position: 'absolute',
    top: 25,
    left: 25,
  },
  productsOfWeekTitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    maxWidth: width * 0.75,
  },
  productsOfWeekSubtitle: {
    color: 'white',
    fontSize: 18,
    maxWidth: width * 0.4,
    paddingTop: 5,
  },
  subTitle: {
    color: 'gray',
    fontSize: 18,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: 20,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  productName: {
    marginTop: 5,
    fontSize: 16,
    color: '#223263',
  },
  productPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#334195',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  welcomeImage: {
    height
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 50,
  },
  dotStyle: {
    marginBottom: -20,
  },
  activeDotStyle: {
    marginBottom: -20,
  }, 
  welcomeContainer: {
    width: width - 20,
    alignSelf: 'center',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 2,
  },
  welcomeImage: {
    width: width - 20,
    height: 400,
    borderRadius: 10,
    alignSelf: 'center',
  },
  welcomeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 5,
  },
  welcomeTitle: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    maxWidth: width * 0.75,
  },
  welcomeSubtitle: {
    color: 'black',
    fontSize: 18,
    maxWidth: width * 0.75,
    paddingTop: 5,
  },
});

export default HomeScreen;
