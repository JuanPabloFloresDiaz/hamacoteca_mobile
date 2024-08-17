import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, Dimensions, RefreshControl } from 'react-native';
import ProductDetailCarousel from '../components/DetailProductComponents/ProductDetailCarousel';
import ProductSpecifications from '../components/DetailProductComponents/ProductSpecifications';
import ProductReviews from '../components/DetailProductComponents/ProductReviews';
import RelatedProducts from '../components/DetailProductComponents/RelatedProducts';
import ProductMainInfo from '../components/DetailProductComponents/ProductMainInfo'; // Importamos el nuevo componente
import fetchData from '../../api/components';
import { useFocusEffect, useNavigation } from "@react-navigation/native";

//Constante para manejar el alto de la pantalla
const windowHeight = Dimensions.get('window').height;

const DetailProductScreen = ({ route }) => {
  const { productId } = route.params || {};

  const PRODUCTO_API = 'servicios/publica/hamaca.php';
  const FOTO_API = 'servicios/publica/foto.php';
  const VALORACIONES_API = 'servicios/publica/valoracion.php';

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Nuevo estado para refrescar
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const handleProductPress = (productId) => {
    if (!productId) {
      alert('No se pudo cargar el producto');
      return;
    }
    console.log("Producto seleccionado " + productId);
    navigation.navigate('DetailProduct', { productId });
  };

  const fetchProductDetails = async () => {
    try {
      console.log("Identificador del producto mandado entre pantallas: " + productId)

      const form = new FormData();
      form.append('idProducto', productId);
      const productData = await fetchData(PRODUCTO_API, 'readOne', form);
      const photoData = await fetchData(FOTO_API, 'readAll', form);
      const reviewData = await fetchData(VALORACIONES_API, 'readOne', form);
      const relatedProductsData = await fetchData(PRODUCTO_API, 'readRecommended', form);

      console.log("Identificador del producto mandado entre pantallas: " + productId)
      const allImages = [{ folder: 'hamacas', IMAGEN: productData.dataset.IMAGEN }, ...photoData.dataset.map(img => ({ folder: 'fotos', IMAGEN: img.IMAGEN }))];

      setProduct({ ...productData.dataset, images: allImages, reviews: reviewData.dataset });
      setRelatedProducts(relatedProductsData.dataset);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false); // Detener el refresco
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  useFocusEffect(
    useCallback(() => {
      fetchProductDetails();
    }, [productId])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProductDetails();
  }, [productId]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  //Activity indicator mientras carga la pantalla (falta mejorar funcionalidad de este)
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  //Texto rojo de que no se pudo cargar el detalle de producto
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {product && (
        <>
          <ProductDetailCarousel images={product.images} />
          <ProductMainInfo name={product.NOMBRE} price={parseFloat(product.PRECIO)} rating={parseFloat(product.PROMEDIO)} productId={productId} />
          <ProductSpecifications
            category={product.CATEGORIA}
            material={product.MATERIAL}
            description={product.DESCRIPCIÓN}
            existencias={product.CANTIDAD}
          />
          <ProductReviews reviews={product.reviews} />
          <RelatedProducts products={relatedProducts} onPress={handleProductPress} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: windowHeight * 0.13,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default DetailProductScreen;
