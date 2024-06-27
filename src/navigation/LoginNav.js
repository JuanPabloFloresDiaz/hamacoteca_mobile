import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import RecoverPasswordScreen from '../screens/RecoveryPasswordScreen';
import VerificationCodeScreen from '../screens/VerificationCodeScreen';
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import SignUpScreen from "../screens/SignUpScreen";
import DetailProductScreen from "../screens/DetailProductScreen";

const Stack = createStackNavigator();

export default function LoginNav({ logueado, setLogueado }) {
  return (
    <Stack.Navigator
        initialRouteName='SplashScreen'
        screenOptions={({ route }) => ({
            headerStyle: {
                backgroundColor: 'rgba(56, 163, 76, 0.8)',
                borderBottomRightRadius: 35,
                borderBottomLeftRadius: 35,
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
        })}>

      <Stack.Screen
        name='LoginScreen'
        options={{ headerShown: false }}
      >
        {props => <LoginScreen {...props} setLogueado={setLogueado} logueado={logueado} />}
      </Stack.Screen>
      <Stack.Screen
          name='SplashScreen'
          options={{headerShown: false}}
          component= {SplashScreen}>
      </Stack.Screen>
      <Stack.Screen
        name='RecoverPassword'
        options={{ headerShown: false }}
      >
        {props => <RecoverPasswordScreen {...props} setLogueado={setLogueado} logueado={logueado} />}
      </Stack.Screen>
      <Stack.Screen
         name='VerificationCode'
         options={{headerShown: false}}
      >
        {props => <VerificationCodeScreen {...props} setLogueado={setLogueado} logueado={logueado} />}
      </Stack.Screen>
      <Stack.Screen
         name='ChangePassword'
         options={{headerShown: false}}
      >
        {props => <ChangePasswordScreen {...props} setLogueado={setLogueado} logueado={logueado} />}
      </Stack.Screen>
      <Stack.Screen
         name='SignUp'
         options={{headerShown: false}}
      >
        {props => <SignUpScreen {...props} setLogueado={setLogueado} logueado={logueado} />}
      </Stack.Screen>
      <Stack.Screen
         name='DetailProduct'
         options={{
            headerShown: true,
            title: 'Detalle de producto',
            headerStyle: {
                backgroundColor: 'rgba(56, 163, 76, 0.8)', // Nuevo color de fondo para la pantalla de asistencias
                borderBottomRightRadius: 35,
                borderBottomLeftRadius: 35,
            },
         }}
      >
        {props => <DetailProductScreen {...props} setLogueado={setLogueado} logueado={logueado}/>}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
