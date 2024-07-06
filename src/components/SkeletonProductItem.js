import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const SkeletonProductItem = () => (
  <View style={styles.container}>
    <View style={styles.imageContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
    <View style={styles.infoContainer}>
      <View style={styles.titlePlaceholder} />
      <View style={styles.pricePlaceholder} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  titlePlaceholder: {
    width: '80%',
    height: 20,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  pricePlaceholder: {
    width: '50%',
    height: 20,
    backgroundColor: '#ddd',
  },
});

export default SkeletonProductItem;
