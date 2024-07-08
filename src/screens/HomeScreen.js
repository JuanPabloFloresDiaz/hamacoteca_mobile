import React, {useState,useEffect} from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { Ionicons } from '@expo/vector-icons';
import fetchData from '../../api/components';

//Obtiene la altura de la ventana
const { width } = Dimensions.get('window');

const HomeScreen = () => {
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

  //Estado para almacenar el nombre de usuario
  const [username, setUsername] = useState('');

  //Función para obtener el nombre de usuario desde la API
  const getUser = async () => {
    try {
      const data = await fetchData(API, 'getUser');
      if (data.session) {
        //Establece el nombre de usuario
        setUsername(data.username); 
        console.log(data.nombre);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  //Obtiene el nombre del usuario cuando el componente se monte
  useEffect(() => {
    const initializeApp = async () => {
      await getUser();
    };
    initializeApp();
  }, []);

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
              <TouchableOpacity style={styles.featuredButton}>
                <Text style={styles.featuredButtonText}>Ver productos</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </Swiper>

      {/* Texto de bienvenida y categorías */}
      <Text style={styles.welcomeText}>Bienvenido {username}</Text>
      <Text style={styles.sectionTitle}>Categorías</Text>
      <ScrollView horizontal style={styles.categoriesContainer} showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={styles.categoryItem}>
          <Image source={require('../../assets/clasicas.jpg')} style={styles.categoryImage} />
          <Text style={styles.categoryText}>Clásicas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryItem}>
          <Image source={require('../../assets/tela.png')} style={styles.categoryImage} />
          <Text style={styles.categoryText}>De tela</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryItem}>
          <Image source={require('../../assets/silla.png')} style={styles.categoryImage} />
          <Text style={styles.categoryText}>Silla</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryItem}>
          <Image source={require('../../assets/soporte.png')} style={styles.categoryImage} />
          <Text style={styles.categoryText}>Con soporte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryItem}>
          <Image source={require('../../assets/acero.png')} style={styles.categoryImage} />
          <Text style={styles.categoryText}>Soporte acero</Text>
        </TouchableOpacity>
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
          <View style={styles.productItem}>
            <Image source={require('../../assets/hamacaclasic.png')} style={styles.productImage} />
            <Text style={styles.productName}>Hamaca clásica</Text>
            <Text style={styles.productPrice}>$299,43</Text>
          </View>
          <View style={styles.productItem}>
            <Image source={require('../../assets/hamacatela.png')} style={styles.productImage} />
            <Text style={styles.productName}>Hamaca de tela</Text>
            <Text style={styles.productPrice}>$299,43</Text>
          </View>
          <View style={styles.productItem}>
            <Image source={require('../../assets/hamacagrande.png')} style={styles.productImage} />
            <Text style={styles.productName}>Hamaca grande</Text>
            <Text style={styles.productPrice}>$299,43</Text>
          </View>
          <View style={styles.productItem}>
            <Image source={require('../../assets/hamacapequeña.png')} style={styles.productImage} />
            <Text style={styles.productName}>Hamaca pequeña</Text>
            <Text style={styles.productPrice}>$299,43</Text>
          </View>
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
    top: 15,
    left: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  productsOfWeekTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  productsOfWeekSubtitle: {
    color: 'white',
    fontSize: 18,
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
});

export default HomeScreen;
