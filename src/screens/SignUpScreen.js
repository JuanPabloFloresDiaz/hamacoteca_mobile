import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ImageBackground, Platform, Image } from 'react-native';
import { TextInput, Button, PaperProvider, Card, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';

const windowHeight = Dimensions.get('window').height;

const RegisterScreen = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dui: '',
        phoneNumber: '',
        birthDate: new Date(),
        gender: '',
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [image, setImage] = useState(null);

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const navigation = useNavigation();

    const handleRegister = () => {
        
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || form.birthDate;
        setShowDatePicker(Platform.OS === 'ios');
        handleChange('birthDate', currentDate);
    };

    const pickImage = async () => {
        // Pedir permisos para acceder a la galería de fotos
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Se requieren permisos para acceder a la galería.');
            return;
        }

        // Abrir el selector de imágenes
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
            <ImageBackground source={require('../../assets/fondo-change.png')} style={styles.backgroundImage}></ImageBackground>
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
                                            value={form.firstName}
                                            onChangeText={(text) => handleChange("firstName", text)}
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
                                            value={form.lastName}
                                            onChangeText={(text) => handleChange("lastName", text)}
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
                                            value={form.email}
                                            onChangeText={(text) => handleChange("email", text)}
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
                                            value={form.password}
                                            onChangeText={(text) => handleChange("password", text)}
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
                                            value={form.dui}
                                            onChangeText={(text) => handleChange("dui", text)}
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
                                                value={form.phoneNumber}
                                                onChangeText={(text) => handleChange("phoneNumber", text)}
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
                                                    {form.birthDate.toLocaleDateString()}
                                                </Text>
                                            </TouchableOpacity>
                                            {showDatePicker && (
                                                <DateTimePicker
                                                    value={form.birthDate}
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
                                            onValueChange={(value) => handleChange("gender", value)}
                                            items={[
                                                { label: 'Masculino', value: 'Masculino' },
                                                { label: 'Femenino', value: 'Femenino' },
                                            ]}
                                            value={form.gender}
                                            style={{
                                                inputIOS: styles.pickerText,
                                                inputAndroid: styles.pickerText
                                            }}
                                            useNativeAndroidPickerStyle={false}
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
                                            source={require('../../assets/anya.jpg')}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                            <Button mode="contained" onPress={handleRegister} style={styles.button}>
                                Registrarse
                            </Button>
                            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                                <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
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
        alignItems: 'center',
        justifyContent: 'center',
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
        color: 'black',
        flex: 1,
    },
    fila: {
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        width: '100%',
        paddingVertical: 10,
        marginTop: 10,
        backgroundColor: '#38A34C',
    },
    loginText: {
        marginTop: 20,
        color: 'black',
    },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
});
