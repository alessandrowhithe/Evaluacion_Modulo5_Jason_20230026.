import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import EditUserScreen from './src/screens/EditUserScreen'; 
import TabNavigator from './src/navigation/TabNavigation';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let splashTimer;
    
    // Escucha cambios en la sesión de Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser ? 'Logged in' : 'Logged out');
      setUser(currentUser);
      setAuthChecked(true);
      
      // Solo termina la carga después del splash mínimo Y verificación de auth
      if (!splashTimer) {
        splashTimer = setTimeout(() => {
          setIsLoading(false);
        }, 2000); // Splash mínimo de 2 segundos
      }
    });

    // Cleanup function
    return () => {
      if (splashTimer) {
        clearTimeout(splashTimer);
      }
      unsubscribe();
    };
  }, []);

  // Mostrar splash mientras carga o no se ha verificado la autenticación
  if (isLoading || !authChecked) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right'
        }}
      >
        {user ? (
          // Usuario autenticado - Stack para usuarios logueados
          <Stack.Group>
            <Stack.Screen 
              name="Main" 
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{ 
                headerShown: true, 
                title: 'Editar Perfil',
                presentation: 'modal',
                headerStyle: {
                  backgroundColor: '#0a0a0a',
                },
                headerTintColor: '#00d4ff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  color: '#ffffff',
                },
              }}
            />
            <Stack.Screen 
              name="EditUser" 
              component={EditUserScreen}
              options={{ 
                headerShown: true, 
                title: 'Editar Usuario',
                presentation: 'modal',
                headerStyle: {
                  backgroundColor: '#0a0a0a',
                },
                headerTintColor: '#3b82f6',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  color: '#ffffff',
                },
              }}
            />
          </Stack.Group>
        ) : (
          // Usuario no autenticado - Stack para autenticación
          <Stack.Group>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ 
                headerShown: false,
                title: 'Iniciar Sesión'
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ 
                headerShown: true,
                title: 'Registrarse',
                headerStyle: {
                  backgroundColor: '#0a0a0a',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  color: '#ffffff',
                },
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}