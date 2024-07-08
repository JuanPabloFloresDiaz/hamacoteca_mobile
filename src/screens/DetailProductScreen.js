import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, Dimensions } from 'react-native';
import ProductDetailCarousel from '../components/DetailProductComponents/ProductDetailCarousel';
import ProductSpecifications from '../components/DetailProductComponents/ProductSpecifications';
import ProductReviews from '../components/DetailProductComponents/ProductReviews';
import RelatedProducts from '../components/DetailProductComponents/RelatedProducts';
import ProductMainInfo from '../components/DetailProductComponents/ProductMainInfo'; // Importamos el nuevo componente
import fetchData from '../../api/components';

const windowHeight = Dimensions.get('window').height;

const DetailProductScreen = ({ route }) => {
  const { productId } = route.params || {};

  const PRODUCTO_API = 'servicios/publica/hamaca.php';
  const FOTO_API = 'servicios/publica/foto.php';
  const VALORACIONES_API = 'servicios/publica/valoracion.php';

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        console.log("Identificador del producto mandado entre pantallas: "+ productId)
        const form = new FormData();
        form.append('idProducto', productId);
        const productData = await fetchData(PRODUCTO_API, 'readOne', form);
        const photoData = await fetchData(FOTO_API, 'readAll', form);
        const reviewData = await fetchData(VALORACIONES_API, 'readOne', form);
        const relatedProductsData = await fetchData(PRODUCTO_API, 'readRecommended', form);

        console.log("Identificador del producto mandado entre pantallas: "+ productId)
        // Combinar la imagen principal del producto con las demás imágenes
        const allImages = [{ IMAGEN: productData.dataset.IMAGEN }, ...photoData.dataset];

        setProduct({ ...productData.dataset, images: allImages, reviews: reviewData.dataset });
        setRelatedProducts(relatedProductsData.dataset);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
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

  return (
    <ScrollView style={styles.container}>
      {product && (
        <>
          <ProductDetailCarousel images={product.images} />
          <ProductMainInfo name={product.NOMBRE} price={parseFloat(product.PRECIO)} rating={parseFloat(product.PROMEDIO)} productId={productId}/>
          <ProductSpecifications
            category={product.CATEGORIA}
            material={product.MATERIAL}
            description={product.DESCRIPCIÓN}
            existencias={product.CANTIDAD}
          />
          <ProductReviews reviews={product.reviews} />
          <RelatedProducts products={relatedProducts} onPress={(id) => console.log('Product pressed', id)} />
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
    marginBottom: windowHeight * 0.11,
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
