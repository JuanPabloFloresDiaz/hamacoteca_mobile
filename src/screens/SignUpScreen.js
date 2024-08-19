import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import {
  TextInput,
  Button,
  PaperProvider,
  Card,
  Avatar,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import fetchData from '../../api/components';
import AlertComponent from '../components/AlertComponent';

//Constante para manejar el alto de la pantalla
const windowHeight = Dimensions.get("window").height;

const RegisterScreen = () => {
  //Url de la api
  const USER_API = "servicios/publica/cliente.php";
  //Constantes para el manejo de datos
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [dui, setDui] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [telefono, setTelefono] = useState("");
  const [clave, setClave] = useState("");
  const [genero, setGenero] = useState(null);
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState(1);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertCallback, setAlertCallback] = useState(null);
  const [url, setUrl] = useState('');

  //Constante de navegación entre pantallas
  const navigation = useNavigation();

  //Metodo para manejar el registro de usuarios
  const handleRegister = async () => {
    try {
      if (
        !nombre ||
        !apellido ||
        !correo ||
        !direccion ||
        !dui ||
        !telefono ||
        !fechaNacimiento ||
        !genero ||
        !clave
      ) {
        setAlertType(2);
        setAlertMessage(
          `Campos requeridos, Por favor, complete todos los campos.`
        );
        setAlertCallback(null);
        setAlertVisible(true);
        return;
      } else {
        const formData = new FormData();
        formData.append("nombreRegistro", nombre);
        formData.append("apellidoRegistro", apellido);
        formData.append("correoRegistro", correo);
        formData.append("direccionRegistro", direccion);
        formData.append("duiRegistro", dui);
        //Manejo de insertar fecha en la base de datos
        formData.append("fechanacimientoRegistro", fechaNacimiento.toISOString().split('T')[0]);
        formData.append("telefonoRegistro", telefono);
        formData.append("claveRegistro", clave);
        formData.append("generoRegistro", genero);
        //Manejo de insertar imagen en la base de datos
        if (image) {
          const uriParts = image.split('.');
          const fileType = uriParts[uriParts.length - 1];
          formData.append("imagenRegistro", {
            uri: image,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
          });
        }

        //Petición a la api para insertar un usuario
        const response = await fetchData(USER_API, "signUpMovli", formData);

        if (response.status) {
          setAlertType(1);
          setAlertMessage(`${response.message}`);
          setAlertCallback(null);
          setAlertVisible(true);
          setUrl('LoginScreen');
        } else {
          setAlertType(2);
          setAlertMessage(`Error: ${response.error}`);
          setAlertCallback(null);
          setAlertVisible(true);
          setUrl(null);
        }
      }
    } catch (error) {
      setAlertType(2);
      setAlertMessage(`Error: ${error.message}`);
      setAlertCallback(null);
      setAlertVisible(true);
      setUrl(null);
    }
  };


  //Constante para ocultar la visibilidad de la alerta
  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertCallback) alertCallback();
  };

  //Metodo para cambiar fecha
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFechaNacimiento(selectedDate);
    }
  };

  //Metodo para abrir la galeria y seleccionar la imagen
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Se requieren permisos para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <PaperProvider>
      <ImageBackground
        source={require("../../assets/fondo-change.png")}
        style={styles.backgroundImage}
      ></ImageBackground>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Card style={styles.profileCard}>
            <Card.Content>
              <View style={styles.inputContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Nombres del cliente:</Text>
                  <View style={styles.rowContent}>
                    <AntDesign name="user" size={24} />
                    <TextInput
                      style={styles.infoText}
                      value={nombre}
                      onChangeText={setNombre}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Apellidos del cliente:</Text>
                  <View style={styles.rowContent}>
                    <AntDesign name="user" size={24} />
                    <TextInput
                      style={styles.infoText}
                      value={apellido}
                      onChangeText={setApellido}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Correo electrónico:</Text>
                  <View style={styles.rowContent}>
                    <AntDesign name="mail" size={24} />
                    <TextInput
                      style={styles.infoText}
                      value={correo}
                      onChangeText={setCorreo}
                      keyboardType="email-address"
                    />
                  </View>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Clave del cliente:</Text>
                  <View style={styles.rowContent}>
                    <Entypo name="lock" size={24} />
                    <TextInput
                      style={styles.infoText}
                      value={clave}
                      onChangeText={setClave}
                      secureTextEntry={true}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Dui del cliente:</Text>
                  <View style={styles.rowContent}>
                    <AntDesign name="idcard" size={24} />
                    <TextInput
                      style={styles.infoText}
                      value={dui}
                      onChangeText={setDui}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.fila}>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Número de teléfono:</Text>
                    <View style={styles.rowContent}>
                      <AntDesign name="phone" size={24} />
                      <TextInput
                        style={styles.infoText}
                        value={telefono}
                        onChangeText={setTelefono}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Fecha de nacimiento:</Text>
                    <View style={styles.rowContent}>
                      <Entypo name="calendar" size={24} />
                      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.infoText}>
                          {fechaNacimiento.toLocaleDateString()}
                        </Text>
                      </TouchableOpacity>
                      {showDatePicker && (
                        <DateTimePicker
                          value={fechaNacimiento}
                          mode="date"
                          display="default"
                          onChange={onDateChange}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Género:</Text>
                  <View style={styles.rowContent}>
                    <Entypo name="user" size={24} />
                    <RNPickerSelect
                      onValueChange={setGenero}
                      items={[
                        { label: "Masculino", value: "Masculino" },
                        { label: "Femenino", value: "Femenino" },
                      ]}
                      value={genero}
                      style={{
                        inputIOS: styles.pickerText,
                        inputAndroid: styles.pickerText,
                      }}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Dirección:</Text>
                  <View style={styles.rowContent}>
                    <Entypo name="map" size={24} />
                    <TextInput
                      style={styles.infoText}
                      value={direccion}
                      onChangeText={setDireccion}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={pickImage}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.avatarImage} />
                  ) : (
                    <Avatar.Image
                      size={100}
                      source={require("../../assets/anya.jpg")}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <Button
                style={styles.button}
                mode="contained"
                onPress={handleRegister}
              >
                Registrarse
              </Button>
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginScreen")}
              >
                <Text style={styles.loginText}>
                  ¿Ya tienes cuenta? Inicia sesión
                </Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
      <AlertComponent
        visible={alertVisible}
        type={alertType}
        message={alertMessage}
        onClose={handleAlertClose}
        url={url}
      />
    </PaperProvider>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: windowHeight * 0.15,
    paddingTop: 50,
  },
  profileCard: {
    width: "100%",
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#B7DABE",
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
  pickerText: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "black",
    flex: 1,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: "#38A34C",
  },
  loginText: {
    marginTop: 20,
    color: "black",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
