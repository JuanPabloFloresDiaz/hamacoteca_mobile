import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import fetchData from '../../../api/components';
import AlertComponent from '../AlertComponent';
import { useNavigation, CommonActions } from '@react-navigation/native';
const PEDIDO_API = 'servicios/publica/pedido.php';
const FAVORITO_API = 'servicios/publica/favorito.php';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ProductMainInfo = ({ name, price, rating, existencias, productId }) => {
  const [quantity, setQuantity] = useState(1);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertCallback, setAlertCallback] = useState(null);
  const navigation = useNavigation();

  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertCallback) alertCallback();
  };


  const verifyFav = async () => {
    try {
      const formData = new FormData();
      formData.append('idProducto', productId);

      const data = await fetchData(FAVORITO_API, 'verifySave', formData);

      if (data.status) {
        const dataset = data.dataset;
        if (dataset.length > 0) {
          const verificar = parseInt(dataset[0].FAVORITO, 10);
          setIsFavorite(verificar >= 1);
        } else {
          setIsFavorite(false);
        }
        console.log('Respuesta favorito: ', isFavorite);
      }
    } catch (error) {
      console.log('Error verifying favorite:', error);
    }
  };

  const verifyCart = async () => {
    try {
      const formData = new FormData();
      formData.append('idProducto', productId);

      const data = await fetchData(PEDIDO_API, 'verifyCart', formData);

      if (data.status) {
        const dataset = data.dataset;
        if (dataset.length > 0) {
          const verificar = parseInt(dataset[0].CARRITO, 10);
          setIsInCart(verificar >= 1);
          console.log('Respuesta carrito: ', isInCart);
        } else {
          setIsInCart(false);
          console.log('Respuesta carrito: ', isInCart);
        }
      }
    } catch (error) {
      console.log('Error verifying cart:', error);
    }
  };

  useEffect(() => {
    verifyFav();
    verifyCart();
  }, [productId]);


  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FontAwesome key={i} name="star" style={styles.star} />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<FontAwesome key={i} name="star-half-full" style={styles.star} />);
      } else {
        stars.push(<FontAwesome key={i} name="star-o" style={styles.star} />);
      }
    }
    return stars;
  };

  const handleAgregarDetalleCarrito = async () => {
    try {
      if (quantity <= 0) {
        setAlertType(2);
        setAlertMessage(`La cantidad no puede ser igual o menor a 0`);
        setAlertCallback(null);
        setAlertVisible(true);
        return;
      }
      if (quantity > existencias) {
        setAlertType(2);
        setAlertMessage(`La cantidad no puede ser mayor al número de existencias actuales, que son ${existencias}`);
        setAlertCallback(null);
        setAlertVisible(true);
        return;
      }
      const formData = new FormData();
      formData.append('idProducto', productId);
      formData.append('cantidad', quantity);

      const data = await fetchData(PEDIDO_API, 'manipulateDetail', formData);

      if (data.status) {
        setAlertType(1);
        setAlertMessage(`Producto agregado al carrito`);
        setAlertCallback(() => () => navigation.dispatch(CommonActions.navigate({ name: 'Carrito' })));
        setAlertVisible(true);
      } else {
        setAlertType(2);
        setAlertMessage(`Error al agregar producto al carrito`);
        setAlertCallback(null);
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertType(2);
      setAlertMessage(`Error de fetch al agregar producto al carrito`);
      setAlertCallback((null));
      setAlertVisible(true);
    }
  };

  const handleAgregarAFavoritos = async () => {
    try {
      const formData = new FormData();
      formData.append('idProducto', productId);

      const data = await fetchData(FAVORITO_API, 'favoriteSave', formData);

      if (data.status) {
        verifyFav();
        verifyCart();
      } else {
        setAlertType(2);
        setAlertMessage(`Error al agregar producto a favoritos`);
        setAlertCallback(null);
        setAlertVisible(true);
        verifyFav();
        verifyCart();
      }
    } catch (error) {
      setAlertType(2);
      setAlertMessage(`Error de fetch al agregar producto a favoritos ${error.message}}`);
      setAlertCallback(null);
      setAlertVisible(true);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.productTitle}>{name}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.favoriteButton} onPress={handleAgregarDetalleCarrito}>
            <FontAwesome name={isInCart ? "cart-arrow-down" : "cart-plus"} style={styles.shoppingIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton} onPress={handleAgregarAFavoritos}>
            <FontAwesome name={isFavorite ? "bookmark" : "bookmark-o"} style={styles.favoriteIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.rating}>Promedio: {rating}</Text>
      <View style={styles.ratingContainer}>
        {renderStars(rating)}
      </View>
      <Text style={styles.productPrice}>${price.toFixed(2)}</Text>
      <View style={styles.quantityContainer}>
        <Text>Cantidad a comprar:</Text>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={String(quantity)}
          onChangeText={(text) => setQuantity(Number(text))}
        />
      </View>
      <AlertComponent
        visible={alertVisible}
        type={alertType}
        message={alertMessage}
        onClose={handleAlertClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 2,
    padding: 5,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 2,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#334195',
    maxWidth: windowWidth * 0.6,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  star: {
    fontSize: 24,
    color: '#FFD700', // color dorado para las estrellas
    marginHorizontal: 2,
  },
  productPrice: {
    fontSize: 22,
    color: '#334195',
  },
  rating: {
    fontSize: 20,
    color: '#000',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginLeft: 10,
    width: 50,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  favoriteButton: {
    marginLeft: 20,
  },
  shoppingIcon: {
    fontSize: 24,
    color: '#38A34C',
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#7E7E7E',
  },
});

export default ProductMainInfo;
