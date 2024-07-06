import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import fetchData from '../../../api/components';
import AlertComponent from '../AlertComponent';


const ModalEditar = ({setModalVisible, modalVisible, idDetalle, setCantidadProductoCarrito, cantidadProductoCarrito, getDetalleCarrito}) => {
    const PEDIDO_API = 'servicios/publica/pedido.php';
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState(1);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertCallback, setAlertCallback] = useState(null);

    const handleAlertClose = () => {
        setAlertVisible(false);
        if (alertCallback) alertCallback();
      };

    const handleUpdateDetalleCarrito = async () => {
        
      try {
        if (cantidadProductoCarrito <= 0) {
          Alert.alert("La cantidad no puede ser igual o menor a 0");
          return; // Corrige la lógica aquí
        }
  
        const formData = new FormData();
        formData.append('idPedido', idDetalle);
        formData.append('cantidad', cantidadProductoCarrito);
  
        const data = await fetchData(PEDIDO_API, 'updateDetail', formData);
  
        if (data.status) {
            setAlertType(1);
            setAlertMessage(`Cantidad modificada correctamente`);
            setAlertCallback(null);
            setAlertVisible(true);
            getDetalleCarrito();
        } else {
            setAlertType(2);
            setAlertMessage(`Error al editar detalle carrito`);
            setAlertCallback(null);
            setAlertVisible(true);
        }
        setModalVisible(false);
      } catch (error) {
            setAlertType(2);
            setAlertMessage(`Error al editar detalle carrito`);
            setAlertCallback(null);
            setAlertVisible(true);
        setModalVisible(false);
      }
    };
  
    const handleCancelEditarCarrito = () => {
      setModalVisible(false);
    };
  
    return (
       <View>
            <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
            setModalVisible(!modalVisible);
            }}
            >
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Actualizar pedido</Text>
                <TextInput
                style={styles.input}
                value={cantidadProductoCarrito}
                onChangeText={setCantidadProductoCarrito}
                keyboardType="numeric"
                placeholder="Ingrese la cantidad"
                />
                <View style={styles.justifyContentM}> 
                    <TouchableOpacity style={styles.saveButtonM} onPress={handleUpdateDetalleCarrito}>
                    <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButtonM} onPress={handleCancelEditarCarrito}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </View>
            
            </Modal>
            <AlertComponent
            visible={alertVisible}
            type={alertType}
            message={alertMessage}
            onClose={handleAlertClose}
            />
       </View>
    );
  };
  
  export default ModalEditar;
  
  const styles = StyleSheet.create({
    centeredView: {
        flex:1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginRight: 150,
      marginBottom: 40,
      fontSize: 16,
      fontWeight: 'bold',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 5,
      width: 300,
    },
    button: {
      backgroundColor: '#007bff',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    justifyContentM: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        marginLeft: 90,
    },
    headerModalM: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
    },
    saveButtonM: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonM: {
        padding: 10,
        backgroundColor: '#F44262',
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 10,
    },
  });
  