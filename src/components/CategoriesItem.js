import React, { useState, useEffect } from 'react';
import { Card, ActivityIndicator } from 'react-native-paper';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import imageData from '../../api/images';

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
});

export default CategoryItem;
