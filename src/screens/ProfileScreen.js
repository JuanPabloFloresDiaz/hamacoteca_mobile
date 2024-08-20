import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import {
  TextInput,
  Card,
  Avatar,
  Button,
  Chip,
  Modal,
  Provider,
  Portal,
  IconButton,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import fetchData from "../../api/components";
import { AntDesign } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import imageData from "../../api/images";
import foto from "../../assets/imagen.jpg";
import AlertComponent from "../components/AlertComponent";
import { useFocusEffect } from "@react-navigation/native";
import ProductItem from "../components/ProductItem";
import { useNavigation } from "@react-navigation/native";
import * as Constantes from "../../api/constantes";
// URL base del servidor
const SERVER_URL = Constantes.SERVER_URL;

//Obtiene la altura de la ventana
const windowHeight = Dimensions.get("window").height;

const ProfileScreen = ({ logueado, setLogueado, setCategoryId }) => {
  //URL de la API
  const USER_API = "servicios/publica/cliente.php";
  const FAVORITOS_API = "servicios/publica/favorito.php";
  const PEDIDOS_API = "servicios/publica/pedido.php";

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
  const [alertMessage, setAlertMessage] = useState("");
  const [alertCallback, setAlertCallback] = useState(null);

  //Controla la visualización del selector de fecha
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeChip, setActiveChip] = useState("perfil");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();
  const [shopHistory, setShopHistory] = useState([
    {
      id: " ",
      cliente: " ",
      direccion: " ",
      fecha: " ",
      estado: " ",
    },
    {
      id: " ",
      cliente: " ",
      direccion: " ",
      fecha: " ",
      estado: " ",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  //Metodos para el manejo de los modals
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
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

  const handleReadDetail = (id) => {
    showModal();
    // Aquí se hara la lógica de mostrar las cartas :)
  };
  //Función para guardar los cambios en el perfil
  const handleSavePress = async () => {
    try {
      //Validación de correo electrónico
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(profile.email)) {
        Alert.alert("Error", "Correo electrónico no válido");
        return;
      } else if (
        !profile.name ||
        !profile.fullname ||
        !profile.email ||
        !profile.address ||
        !profile.dui ||
        !profile.phone
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
        formData.append("nombrePerfil", profile.name);
        formData.append("apellidoPerfil", profile.fullname);
        formData.append("correoPerfil", profile.email);
        formData.append("direccionPerfil", profile.address);
        formData.append("duiPerfil", profile.dui);
        if (profile.birthday instanceof Date) {
          formData.append(
            "fechanacimientoPerfil",
            profile.birthday.toISOString().split("T")[0]
          );
        } else {
          Alert.alert("Error", "Fecha de nacimiento no válida");
          return;
        }
        formData.append("telefonoPerfil", profile.phone);
        formData.append("generoPerfil", profile.gender);
        if (profile.image) {
          const uriParts = profile.image.split(".");
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
          handleEditPress();
        } else {
          setAlertType(2);
          setAlertMessage(`Error: ${response.error}`);
          setAlertCallback(null);
          setAlertVisible(true);
        }
      }
    } catch (error) {
      setAlertType(2);
      setAlertMessage(`Error al cargar la petición: ${error.message}`);
      setAlertCallback(null);
      setAlertVisible(true);
    }
  };

  //Función para manejar cambios en el perfil
  const handleChange = (name, value) => {
    setProfile({ ...profile, [name]: value });
  };

  //Maneja el cambio de contraseña
  const handlePasswordChange = async () => {
    try {
      if (newPassword !== confirmPassword) {
        Alert.alert("Error", "La confirmación de la contraseña no coincide.");
        return;
      }

      const formData = new FormData();
      formData.append("claveActual", password);
      formData.append("claveCliente", newPassword);
      formData.append("repetirclaveCliente", confirmPassword);

      const response = await fetchData(USER_API, "changePassword", formData);

      if (response.status) {
        Alert.alert("Éxito", response.message);
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert("Error", response.error);
      }
    } catch (error) {
      Alert.alert("No se pudo acceder a la API", error.message);
      console.log(error.message);
    }
  };

  //Constante para que al seleccionar un producto, redirija a la pantalla de detalle de producto, enviando el id del producto
  const handleProductPress = (productId) => {
    //Verificación de si el identificador del producto se ha enviado bien
    if (!productId) {
      alert("No se pudo cargar el producto");
      return;
    }
    console.log("Producto seleccionado " + productId);
    //Navegar a detalle de producto
    navigation.navigate("LoginNav", {
      screen: "DetailProduct",
      params: { productId },
    });
  };

  //Renderizador de las cartas de los productos
  const renderProductsItem = ({ item }) => (
    <ProductItem item={item} onPress={handleProductPress} />
  );

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
      const data = await fetchData(USER_API, "readOne");
      const profileData = data.dataset;
      const imageUrl = profileData.FOTO
        ? await imageData("clientes", profileData.FOTO)
        : Image.resolveAssetSource(foto).uri;

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
      console.log("petición hecha");
    }
  };

  //Metodo para cargar los productos de la semana
  const readFavorites = async () => {
    try {
      //Petición a la api
      const data = await fetchData(FAVORITOS_API, "readAll");
      //La petición funciona correctamente
      if (data.status) {
        setFavorites(data.dataset);
      }
      //Si la petición falla
      else {
        setFavorites([]);
      }
    } catch (error) {
      setError(error);
    }
  };

  //Metodo para cargar los productos de la semana
  const readHistory = async () => {
    try {
      //Petición a la api
      const data = await fetchData(PEDIDOS_API, "readAll");
      //La petición funciona correctamente
      if (data.status) {
        const processedData = data.dataset.map((row) => ({
          id: row.ID,
          cliente: row.CLIENTE,
          direccion: row.DIRECCION,
          fecha: row.FECHA,
          estado: row.ESTADO,
        }));
        setShopHistory(processedData);
      }
      //Si la petición falla
      else {
        setShopHistory([]);
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleChangeState = (id) => {
    // Mostrar un mensaje de confirmación antes de eliminar
    Alert.alert(
      "Confirmación",
      "¿Está seguro de cambiar el estado de tu pedido?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Aceptar",
          onPress: async () => {
            changeState(id);
          },
        },
      ]
    );
  };

  const handleReport = (id) => {
    // Abre la URL de la factura en el navegador predeterminado
    const invoiceUrl = `${SERVER_URL}reportes/publica/comprobante_de_compra.php?id=${id}`;
    Linking.openURL(invoiceUrl).catch((err) =>
      console.log("Error al abrir la URL:", err)
    );
  };

  const changeState = async (id) => {
    try {
      // Realización de la petición de finalizar pedido

      const form = new FormData();
      form.append("idPedido", id);
      const data = await fetchData(PEDIDOS_API, "changeState", form);
      if (data.status) {
        Alert.alert(`${data.message}`);
        readHistory();
      } else {
        setAlertType(2);
        setAlertMessage(`Error: ${data.error} ${data.exception}`);
        setAlertCallback(null);
        setAlertVisible(true);
      }
    } catch (error) {
      setError(error);
    }
  };

  //Lee los datos del perfil al montar el componente
  useEffect(() => {
    readProfile();
    readFavorites();
    readHistory();
  }, []);

  //Cambia la pantalla activa
  const changeScreen = (screen) => {
    setActiveChip(screen);
  };

  useFocusEffect(
    useCallback(() => {
      readProfile();
      readFavorites();
      readHistory();
      setCategoryId(null);
    }, [])
  );

  // Método para asignar un color según el estado
  const getColorByState = (estado) => {
    if (estado == "Cancelado") return "#F44336"; // Rojo
    if (estado == "En camino") return "#FFC107"; // Amarillo
    if (estado == "Entregado") return "#4CAF50"; // Verde
  };

  return (
    <Provider>
      <ScrollView>
        <View style={styles.container}>
          {/*Contenedor para el header*/}
          <LinearGradient colors={["#85CF74", "#4CAF50"]} style={styles.header}>
            <TouchableOpacity onPress={pickImage}>
              <Avatar.Image size={100} source={{ uri: profile.image }} />
            </TouchableOpacity>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
            {activeChip == "perfil" && (
              <TouchableOpacity
                onPress={handleEditPress}
                style={styles.editIcon}
              >
                <AntDesign
                  name={isEditing ? "leftcircle" : "edit"}
                  size={30}
                  color="#FFF"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleLogOut} style={styles.logoutIcon}>
              <Entypo name="log-out" size={30} color="#FFF" />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.rowButton}>
            <Chip
              style={[
                styles.chip,
                {
                  backgroundColor:
                    activeChip === "perfil" ? "#4CAF50" : "#F2EEEF",
                },
              ]}
              onPress={() => changeScreen("perfil")}
              textStyle={{
                color: activeChip === "perfil" ? "white" : "#9A9A9A",
              }}
            >
              Perfil
            </Chip>
            <Chip
              style={[
                styles.chip,
                {
                  backgroundColor:
                    activeChip === "password" ? "#4CAF50" : "#F2EEEF",
                },
              ]}
              onPress={() => changeScreen("password")}
              textStyle={{
                color: activeChip === "password" ? "white" : "#9A9A9A",
              }}
            >
              Cambiar contraseña
            </Chip>
            <Chip
              style={[
                styles.chip,
                {
                  backgroundColor:
                    activeChip === "favoritos" ? "#4CAF50" : "#F2EEEF",
                },
              ]}
              onPress={() => changeScreen("favoritos")}
              textStyle={{
                color: activeChip === "favoritos" ? "white" : "#9A9A9A",
              }}
            >
              Favoritos
            </Chip>
            <Chip
              style={[
                styles.chip,
                {
                  backgroundColor:
                    activeChip === "historial" ? "#4CAF50" : "#F2EEEF",
                },
              ]}
              onPress={() => changeScreen("historial")}
              textStyle={{
                color: activeChip === "historial" ? "white" : "#9A9A9A",
              }}
            >
              Historial de Compras
            </Chip>
          </View>

          {activeChip === "perfil" && (
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
                      <TouchableOpacity
                        onPress={() => isEditing && setShowDatePicker(true)}
                      >
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
          )}
          {activeChip === "password" && (
            <Card style={styles.profileCard}>
              <Card.Content>
                <View style={styles.inputContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Contraseña Actual:</Text>
                    <View style={styles.rowContent}>
                      <Entypo name="lock-open" size={24} />
                      <TextInput
                        style={styles.infoText}
                        value={password}
                        secureTextEntry
                        onChangeText={(text) => setPassword(text)}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Nueva Contraseña:</Text>
                    <View style={styles.rowContent}>
                      <Entypo name="lock" size={24} />
                      <TextInput
                        style={styles.infoText}
                        value={newPassword}
                        secureTextEntry
                        onChangeText={(text) => setNewPassword(text)}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>
                      Confirmar Nueva Contraseña:
                    </Text>
                    <View style={styles.rowContent}>
                      <Entypo name="lock" size={24} />
                      <TextInput
                        style={styles.infoText}
                        value={confirmPassword}
                        secureTextEntry
                        onChangeText={(text) => setConfirmPassword(text)}
                      />
                    </View>
                  </View>
                </View>
              </Card.Content>
              <Button
                mode="contained"
                onPress={handlePasswordChange}
                style={styles.saveButton}
              >
                Guardar
              </Button>
            </Card>
          )}
          {activeChip === "favoritos" && (
            <Card style={styles.profileCard}>
              <View style={styles.productGrid}>
                {favorites.map((item, index) => (
                  <View key={index} style={styles.productItem}>
                    {renderProductsItem({ item })}
                  </View>
                ))}
              </View>
            </Card>
          )}

          {activeChip === "historial" && (
            <Card style={styles.profileCard}>
              <Card.Content>
                {shopHistory.map((item, index) => (
                  <View key={index}>
                    {
                      <Card style={styles.pedidoCard}>
                        <Card.Content>
                          <View style={styles.pedidoRow}>
                            <Text style={styles.pedidoLabel}>Cliente:</Text>
                            <Text style={styles.pedidoText}>
                              {item.cliente}
                            </Text>
                          </View>
                          <View style={styles.pedidoRow}>
                            <Text style={styles.pedidoLabel}>Dirección:</Text>
                            <Text style={styles.pedidoText}>
                              {item.direccion}
                            </Text>
                          </View>
                          <View style={styles.pedidoRow}>
                            <Text style={styles.pedidoLabel}>Fecha:</Text>
                            <Text style={styles.pedidoText}>{item.fecha}</Text>
                          </View>
                          <View style={styles.pedidoRow}>
                            <Text style={styles.pedidoLabel}>Estado:</Text>
                            <Text
                              style={[
                                styles.pedidoText,
                                {
                                  color: getColorByState(item.estado),
                                },
                              ]}
                            >
                              {item.estado}
                            </Text>
                          </View>
                          <View style={styles.accionesContainer}>
                            <TouchableOpacity
                              style={styles.accionBoton}
                              onPress={() => handleChangeState(item.id)}
                            >
                              <AntDesign
                                name="infocirlceo"
                                size={24}
                                color="#4CAF50"
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.accionBoton}
                              onPress={() => handleReadDetail(item.id)}
                            >
                              <AntDesign
                                name="filetext1"
                                size={24}
                                color="#2196F3"
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.accionBoton}
                              onPress={() => handleReport(item.id)}
                            >
                              <AntDesign
                                name="pdffile1"
                                size={24}
                                color="#FF5722"
                              />
                            </TouchableOpacity>
                          </View>
                        </Card.Content>
                      </Card>
                    }
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}
        </View>
        <AlertComponent
          visible={alertVisible}
          type={alertType}
          message={alertMessage}
          onClose={handleAlertClose}
        />
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            <View style={styles.headerModal}>
              <Text style={styles.modalTitle}>Detalle del pedido 2</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={hideModal}
                color="#334195"
              />
            </View>
            <ScrollView style={styles.modalContent}>
              <Card style={styles.detailCard}>
                <Card.Content>
                  <View style={styles.detailRow}>
                    <Text style={styles.columnHeader}>Foto</Text>
                    <Text style={styles.columnHeader}>Nombre del producto</Text>
                    <Text style={styles.columnHeader}>Cantidad comprada</Text>
                    <Text style={styles.columnHeader}>Precio unitario</Text>
                    <Text style={styles.columnHeader}>Subtotal</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Image
                      source={require("../../assets/imagen.jpg")}
                      style={styles.productImage}
                    />
                    <Text style={styles.productName}>Hamaca de tela</Text>
                    <Text style={styles.quantityText}>2</Text>
                    <Text style={styles.priceText}>$79.99</Text>
                    <Text style={styles.subtotalText}>$159.98</Text>
                  </View>

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>TOTAL QUE PAGO (US$)</Text>
                    <Text style={styles.totalAmount}>$159.98</Text>
                  </View>
                </Card.Content>
              </Card>
            </ScrollView>
          </Modal>
        </Portal>
      </ScrollView>
    </Provider>
  );
};

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
    backgroundColor: "#4CAF50",
    maxWidth: 150,
    left: 200,
  },
  status: {
    backgroundColor: "#558D32",
    width: 10,
    height: 10,
    borderRadius: 100 / 2,
  },
  pickerText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    backgroundColor: "transparent",
    height: 40,
    borderWidth: 0,
  },
  rowButton: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 10,
    width: "100%",
  },
  chip: {
    margin: 5,
    marginBottom: 10,
  },
  productsList: {
    paddingBottom: 10,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productItem: {
    width: "48%",
    marginBottom: 20,
  },
  historialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pedidoCard: {
    marginBottom: 10,
    elevation: 2,
    backgroundColor: "white",
  },
  pedidoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  pedidoLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  pedidoText: {
    flex: 1,
    textAlign: "right",
    color: "#555",
  },
  accionesContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  accionBoton: {
    marginLeft: 15,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    maxHeight: '80%',
  },
  detailCard: {
    elevation: 4,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  columnHeader: {
    fontWeight: 'bold',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  quantityText: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  priceText: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  subtotalText: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4CAF50',
  },
});

export default ProfileScreen;
