import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const AlertComponent = ({ visible, type, message, onClose, url = null }) => {
  let title, icon;

  switch (type) {
    case 1:
      title = 'Éxito';
      icon = require('../../assets/exito.png'); // Cambien el icono si no les gusta
      break;
    case 2:
      title = 'Error';
      icon = require('../../assets/fallo.png'); // Cambien el icono si no les gusta
      break;
    case 3:
      title = 'Advertencia';
      icon = require('../../assets/advertencia.png'); // Cambien el icono si no les gusta
      break;
    case 4:
      title = 'Aviso';
      icon = require('../../assets/gol.png'); // Cambien el icono si no les gusta
      break;
    default:
      title = '';
      icon = null;
  }

  const handleAccept = () => {
    onClose();
    if (url) {
      // Maneja la navegación a la URL si es necesario
      // Esto puede variar dependiendo de tu configuración de navegación
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {icon && <Image source={icon} style={styles.icon} />}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={handleAccept} style={styles.button}>
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AlertComponent;
