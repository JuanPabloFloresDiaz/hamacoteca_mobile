import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput as RNTextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { Button, PaperProvider } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
 
const RegisterScreen = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dui: '',
        phoneNumber: '',
        birthDate: '',
        gender: 'Masculino',
    });
 
    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };
 
    const navigation = useNavigation();
 
    const handleRegister = () => {
        // Lógica para registrar el usuario
    };
 
    return (
        <PaperProvider>
            <ImageBackground source={require('../../assets/fondo-change.png')} style={styles.backgroundImage}>
                <View style={styles.container}>
                    <RNTextInput
                        placeholder="Nombres del cliente"
                        value={form.firstName}
                        onChangeText={(text) => handleChange('firstName', text)}
                        style={styles.input}
                    />
                    <RNTextInput
                        placeholder="Apellidos del cliente"
                        value={form.lastName}
                        onChangeText={(text) => handleChange('lastName', text)}
                        style={styles.input}
                    />
                    <RNTextInput
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChangeText={(text) => handleChange('email', text)}
                        style={styles.input}
                        keyboardType="email-address"
                    />
                    <View style={styles.inputContainer}>
                        <RNTextInput
                            placeholder="Clave del cliente"
                            value={form.password}
                            onChangeText={(text) => handleChange('password', text)}
                            secureTextEntry={true}
                            style={styles.input}
                        />
                    </View>
                    <RNTextInput
                        placeholder="Dui del cliente"
                        value={form.dui}
                        onChangeText={(text) => handleChange('dui', text)}
                        style={styles.input}
                    />
                    <RNTextInput
                        placeholder="Número de teléfono"
                        value={form.phoneNumber}
                        onChangeText={(text) => handleChange('phoneNumber', text)}
                        style={styles.input}
                        keyboardType="phone-pad"
                    />
                    <RNTextInput
                        placeholder="Fecha de nacimiento"
                        value={form.birthDate}
                        onChangeText={(text) => handleChange('birthDate', text)}
                        style={styles.input}
                    />
                    <RNTextInput
                        placeholder="Género"
                        value={form.gender}
                        onChangeText={(text) => handleChange('gender', text)}
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.imageUpload}>
                        <Ionicons name="image-outline" size={30} color="#777" />
                    </TouchableOpacity>
                    <Button mode="contained" onPress={handleRegister} style={styles.button}>
                        Registrarse
                    </Button>
                    <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                        <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </PaperProvider>
    );
};
 
export default RegisterScreen;
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#777',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#777',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    button: {
        width: '100%',
        paddingVertical: 10,
        marginTop: 10,
        backgroundColor: 'black',
    },
    imageUpload: {
        width: 80,
        height: 80,
        borderColor: '#777',
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    loginText: {
        marginTop: 20,
        color: 'blue',
    },
});