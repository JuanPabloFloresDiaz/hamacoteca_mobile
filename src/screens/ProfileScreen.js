import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView, Image } from "react-native";
import { TextInput, Card, Avatar, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import fetchData from "../../api/components";
import { AntDesign } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from "react-native-picker-select";
import imageData from "../../api/images";
import foto from '../../assets/anya.jpg';
import AlertComponent from '../components/AlertComponent';

//Obtiene la altura de la ventana
const windowHeight = Dimensions.get('window').height;

const ProfileScreen = ({ logueado, setLogueado }) => {

  //URL de la API
  const USER_API = 'servicios/publica/cliente.php';

  //Estado para alternar el modo de edición
  const [isEditing, setIsEditing] = useState(false);

  //Almacena la información del perfil
  const [profile, setProfile] = useState({
    name: " ",
    fullname: " ",
    email: " ",
    dui: " ",
    phone: " ",
    address: " ",
    birthday: new Date(" "),
    gender: " ",
    image: Image.resolveAssetSource(foto).uri,
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState(1);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertCallback, setAlertCallback] = useState(null);

  //Controla la visualización del selector de fecha
  const [showDatePicker, setShowDatePicker] = useState(false);

  //Constante para ocultar la visibilidad de la alerta
  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertCallback) alertCallback();
  };

  //Función para alternar entre el modo de edición y vista
  const handleEditPress = () => {
    setIsEditing(!isEditing);
    readProfile();
  };

  //Función para guardar los cambios en el perfil
  const handleSavePress = async () => {
    try {

      //Validación de correo electrónico
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(profile.email)) {
        Alert.alert("Error", "Correo electrónico no válido");
        return;
      } else if (!profile.name || !profile.fullname || !profile.email || !profile.address || !profile.dui || !profile.phone) {
        setAlertType(2);
        setAlertMessage(`Campos requeridos, Por favor, complete todos los campos.`);
        setAlertCallback(null);
        setAlertVisible(true);
        return;
      } else {

        const formData = new FormData();
        formData.append("nombrePerfil", profile.name);
        formData.append("apellidoPerfil", profile.fullname);
        formData.append("correoPerfil", profile.email);
        formData.append("direccionPerfil", profile.address);
        formData.append("duiPerfil", profile.dui);
        if (profile.birthday instanceof Date) {
          formData.append("fechanacimientoPerfil", profile.birthday.toISOString().split('T')[0]);
        } else {
          Alert.alert("Error", "Fecha de nacimiento no válida");
          return;
        }
        formData.append("telefonoPerfil", profile.phone);
        formData.append("generoPerfil", profile.gender);
        if (profile.image) {
          const uriParts = profile.image.split('.');
          const fileType = uriParts[uriParts.length - 1];
          formData.append("imagenPerfil", {
            uri: profile.image,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
          });
        }

        const response = await fetchData(USER_API, "updateRow", formData);

        if (response.status) {
          setAlertType(1);
          setAlertMessage(`${response.message}`);
          setAlertCallback(null);
          setAlertVisible(true);
          setIsEditing(false);
        } else {
          setAlertType(2);
          setAlertMessage(`Error: ${response.error}`);
          setAlertCallback(null);
          setAlertVisible(true);
        }
      }
    }
    catch (error) {
      setAlertType(2);
      setAlertMessage(`Error: ${error.message}`);
      setAlertCallback(null);
      setAlertVisible(true);
    }
  };

  //Función para manejar cambios en el perfil
  const handleChange = (name, value) => {
    setProfile({ ...profile, [name]: value });
  };

  //Función para cerrar sesión
  const handleLogOut = async () => {
    try {
      const data = await fetchData(USER_API, "logOut");
      if (data.status) {
        setLogueado(false);
      } else {
        Alert.alert("Error sesión", data.error);
      }
    } catch (error) {
      console.log("Error: ", error);
      Alert.alert("Error sesión", error);
    }
  };

  //Función para seleccionar una imagen desde la galería
  const pickImage = async () => {
    if (isEditing) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfile({ ...profile, image: result.assets[0].uri });
      }
    }
  };

  //Función para manejar el cambio de fecha
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || profile.birthday;
    setShowDatePicker(false);
    handleChange("birthday", currentDate);
  };

  //Función para leer los datos del perfil desde la API
  const readProfile = async () => {
    try {
      const data = await fetchData(USER_API, 'readOne');
      const profileData = data.dataset;
      const imageUrl = profileData.FOTO ? await imageData('clientes', profileData.FOTO) : Image.resolveAssetSource(foto).uri;

      setProfile({
        name: profileData.NOMBRE,
        fullname: profileData.APELLIDO,
        email: profileData.CORREO,
        dui: profileData.DUI,
        phone: profileData.TELÉFONO,
        address: profileData.DIRECCION,
        birthday: new Date(profileData.NACIMIENTO),
        gender: profileData.GENERO,
        image: imageUrl,
      });

      console.log(data.dataset);
    } catch (error) {
      console.error(error);
    } finally {
      console.log('petición hecha');
    }
  };

  //Lee los datos del perfil al montar el componente
  useEffect(() => {
    readProfile();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {/*Contenedor para el header*/}
        <LinearGradient colors={["#85CF74", "#4CAF50"]} style={styles.header}>
          <TouchableOpacity onPress={pickImage}>
            <Avatar.Image
              size={100}
              source={{ uri: profile.image }}
            />
          </TouchableOpacity>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <TouchableOpacity onPress={handleEditPress} style={styles.editIcon}>
            <AntDesign name={isEditing ? "leftcircle" : "edit"} size={30} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogOut} style={styles.logoutIcon}>
            <Entypo name="log-out" size={30} color="#FFF" />
          </TouchableOpacity>
        </LinearGradient>

        <Card style={styles.profileCard}>
          <Card.Content>
            {/*Contenedor para el nombre*/}
            <View style={styles.inputContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Nombre:</Text>
                <View style={styles.rowContent}>
                  <AntDesign name="user" size={24} />
                  <TextInput
                    style={styles.infoText}
                    value={profile.name}
                    editable={isEditing}
                    onChangeText={(text) => handleChange("name", text)}
                  />
                </View>
              </View>
            </View>
            {/*Contenedor para el apellido*/}
            <View style={styles.inputContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Apellido:</Text>
                <View style={styles.rowContent}>
                  <AntDesign name="user" size={24} />
                  <TextInput
                    style={styles.infoText}
                    value={profile.fullname}
                    editable={isEditing}
                    onChangeText={(text) => handleChange("fullname", text)}
                  />
                </View>
              </View>
            </View>
            {/*Contenedor para la fecha de nacimiento*/}
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Fecha de nacimiento:</Text>
                <View style={styles.rowContent}>
                  <Entypo name="calendar" size={24} />
                  <TouchableOpacity onPress={() => isEditing && setShowDatePicker(true)}>
                    <Text style={styles.infoText}>
                      {profile.birthday.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={profile.birthday}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                    />
                  )}
                </View>
              </View>
            </View>
            {/*Contenedor para el género*/}
            <View style={styles.inputContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Género:</Text>
                <View style={styles.rowContent}>
                  <Entypo name="user" size={24} />
                  <RNPickerSelect
                    onValueChange={(value) => handleChange("gender", value)}
                    items={[
                      { label: "Masculino", value: "Masculino" },
                      { label: "Femenino", value: "Femenino" },
                    ]}
                    value={profile.gender}
                    style={{
                      inputIOS: styles.pickerText,
                      inputAndroid: styles.pickerText,
                    }}
                    useNativeAndroidPickerStyle={false}
                    disabled={!isEditing}
                  />
                </View>
              </View>
            </View>
            {/*Contenedor para el correo*/}
            <View style={styles.inputContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Correo:</Text>
                <View style={styles.rowContent}>
                  <AntDesign name="mail" size={24} />
                  <TextInput
                    style={styles.infoText}
                    value={profile.email}
                    editable={isEditing}
                    onChangeText={(text) => handleChange("email", text)}
                  />
                </View>
              </View>
            </View>
            {/*Contenedor para la dirección*/}
            <View style={styles.inputContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Dirección:</Text>
                <View style={styles.rowContent}>
                  <Entypo name="map" size={24} />
                  <TextInput
                    style={styles.infoText}
                    value={profile.address}
                    editable={isEditing}
                    onChangeText={(text) => handleChange("address", text)}
                  />
                </View>
              </View>
            </View>
            {/*Contenedor para el DUI*/}
            <View style={styles.fila}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>DUI</Text>
                  <View style={styles.rowContent}>
                    <AntDesign name="idcard" size={24} />
                    <TextInput
                      style={styles.infoText}
                      value={profile.dui}
                      editable={isEditing}
                      onChangeText={(text) => handleChange("dui", text)}
                    />
                  </View>
                </View>
              </View>
              {/*Contenedor para el teléfono*/}
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Teléfono</Text>
                  <View style={styles.rowContent}>
                    <AntDesign name="phone" size={24} />
                    <TextInput
                      style={styles.infoText}
                      value={profile.phone}
                      editable={isEditing}
                      onChangeText={(text) => handleChange("phone", text)}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Card.Content>
          {/*Botón para guardar cambios*/}
          {isEditing && (
            <Button
              mode="contained"
              onPress={handleSavePress}
              style={styles.saveButton}
            >
              Guardar
            </Button>
          )}
        </Card>
      </View>
      <AlertComponent
        visible={alertVisible}
        type={alertType}
        message={alertMessage}
        onClose={handleAlertClose}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    alignItems: "center",
    marginBottom: windowHeight * 0.15,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingTop: 40,
    width: "100%",
    position: "relative",
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 18,
    color: "white",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#003366",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  profileCard: {
    width: "100%",
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#F2F7FF",
    paddingTop: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
  infoRow: {
    padding: 12,
    margin: 2,
    borderRadius: 10,
    backgroundColor: "white",
    width: "100%",
    elevation: 2,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    backgroundColor: "transparent",
    height: 40,
    borderWidth: 0,
    flex: 1,
  },
  infoText2: {
    marginLeft: 10,
    fontSize: 16,
    backgroundColor: "transparent",
    borderWidth: 0,
    flex: 1,
  },
  activeSinceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 5,
    fontSize: 16,
    color: "gray",
  },
  editIcon: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  logoutIcon: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#003366",
    maxWidth: 150,
    left: 200,
  },
  status: {
    backgroundColor: '#558D32',
    width: 10,
    height: 10,
    borderRadius: 100 / 2
  },
  pickerText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    backgroundColor: "transparent",
    height: 40,
    borderWidth: 0,
  },
});

export default ProfileScreen;
