import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const FilterModal = ({ visible, onClose }) => {
  return (
    <ScrollView contentContainerStyle={styles.modalContainer}>
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
      <Button mode="contained" onPress={onClose} style={styles.applyButton}>
        Filtrar
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    marginTop: '20%',
    borderRadius: 10,
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

export default FilterModal;
