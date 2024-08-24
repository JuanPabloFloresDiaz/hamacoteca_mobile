import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Dimensions } from 'react-native';
import { Modal, Portal, Checkbox, Button, IconButton, Tooltip } from 'react-native-paper';
import fetchData from '../../api/components';
import PriceSlider from './PriceSlider'; // Asegúrate de ajustar la ruta según tu estructura de carpetas.

//Constante para manejar el alto de la pantalla
const windowHeight = Dimensions.get('window').height;
const MATERIALES_API = 'servicios/publica/material.php';
const CATEGORIAS_API = 'servicios/publica/categoria.php';

const FilterModal = ({ visible, onDismiss, applyFilters }) => {
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [allCategoriesChecked, setAllCategoriesChecked] = useState(false);
  const [allMaterialsChecked, setAllMaterialsChecked] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 10, max: 999 });

  useEffect(() => {
    cargarCategorias();
    cargarMateriales();
  }, []);

  const cargarCategorias = async () => {
    try {
      const data = await fetchData(CATEGORIAS_API, 'readAll');
      if (data.status) {
        setCategories(data.dataset);
      } else {
        console.log('Error al cargar las categorías:', data.message);
      }
    } catch (error) {
      console.log('Error al obtener datos de la API:', error);
    }
  };

  const cargarMateriales = async () => {
    try {
      const data = await fetchData(MATERIALES_API, 'readAll');
      if (data.status) {
        setMaterials(data.dataset);
      } else {
        console.log('Error al cargar los materiales:', data.message);
      }
    } catch (error) {
      console.log('Error al obtener datos de la API:', error);
    }
  };

  const handleSelectAllCategories = () => {
    if (allCategoriesChecked) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(c => c.ID));
    }
    setAllCategoriesChecked(!allCategoriesChecked);
  };

  const handleCategoryChange = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  const handleSelectAllMaterials = () => {
    if (allMaterialsChecked) {
      setSelectedMaterials([]);
    } else {
      setSelectedMaterials(materials.map(m => m.ID));
    }
    setAllMaterialsChecked(!allMaterialsChecked);
  };

  const handleMaterialChange = (id) => {
    setSelectedMaterials(prev =>
      prev.includes(id) ? prev.filter(matId => matId !== id) : [...prev, id]
    );
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const handleFilterButton = () => {
    const form = new FormData();
    form.append('categorias', selectedCategories);
    form.append('materiales', selectedMaterials);
    form.append('minimo', priceRange.min);
    form.append('maximo', priceRange.max);
    applyFilters(form);
    onDismiss();
  };


  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.modalTitle}>Filtros</Text>
          <Tooltip title="Cerrar el filtro de productos">
            <IconButton
              icon="close"
              size={24}
              onPress={onDismiss}
              style={styles.closeButton}
              color="#334195"
            />
          </Tooltip>
        </View>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <View style={styles.filterSectionRange}>
            <Text style={styles.filterLabel}>Rango de precio</Text>
            <PriceSlider
              minPrice={10}
              maxPrice={999}
              onValueChange={handlePriceChange}
            />
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Categorías</Text>
            <Checkbox.Item
              label="Seleccionar todo"
              status={allCategoriesChecked ? 'checked' : 'unchecked'}
              onPress={handleSelectAllCategories}
              color='#334195'
            />
            {categories.map(categoria => (
              <Checkbox.Item
                key={categoria.ID}
                label={categoria.NOMBRE}
                status={selectedCategories.includes(categoria.ID) ? 'checked' : 'unchecked'}
                onPress={() => handleCategoryChange(categoria.ID)}
                color='#334195'
              />
            ))}
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Materiales</Text>
            <Checkbox.Item
              label="Seleccionar todo"
              status={allMaterialsChecked ? 'checked' : 'unchecked'}
              onPress={handleSelectAllMaterials}
              color='#334195'
            />
            {materials.map(material => (
              <Checkbox.Item
                key={material.ID}
                label={material.NOMBRE}
                status={selectedMaterials.includes(material.ID) ? 'checked' : 'unchecked'}
                onPress={() => handleMaterialChange(material.ID)}
                color='#334195'
              />
            ))}
          </View>
          <Button mode="contained" onPress={handleFilterButton} style={styles.applyButton}>
            Filtrar
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: windowHeight * 0.11,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterSectionRange: {
    marginBottom: 20,
  },
  filterSection: {
    margin: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#334195'
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: 'black',
  },
  priceRange: {
    fontSize: 14,
    color: 'gray',
  },
});
