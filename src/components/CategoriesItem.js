import React, { useState, useEffect } from 'react';
import { Card, ActivityIndicator } from 'react-native-paper';
import { StyleSheet, View, TouchableOpacity, Image, Text, Dimensions } from 'react-native';
import imageData from '../../api/images';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CategoryItem = ({ item, onPress }) => {
    //Constantes para el manejo de la imagen
    const [imagenUrl, setImagenUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        //Metodo para cargar la imagen y manejar el error en caso de que no se encuentren
        const cargarImagen = async () => {
            try {
                //Traer la imagen y aplicarla a la url
                const uri = await imageData('categorias', item.IMAGEN);
                setImagenUrl(uri);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        cargarImagen();
    }, [item.IMAGEN]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return <Text>Error al cargar la imagen</Text>;
    }

    return (
        <TouchableOpacity style={styles.categoryItem} onPress={() => onPress(item.ID)}>
            <Image source={{ uri: imagenUrl }} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.NOMBRE}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    categoryItem: {
        alignItems: 'center',
        marginRight: 20,
        height: windowHeight * 0.15,
        width: windowWidth * 0.3,
        margin: 2,
        padding: 20,
        borderRadius: 200,
        backgroundColor: "white",
        elevation: 2,
    },
    categoryImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    categoryText: {
        marginTop: 5,
        fontSize: 13,
        maxWidth: 70,
    },
});

export default CategoryItem;
