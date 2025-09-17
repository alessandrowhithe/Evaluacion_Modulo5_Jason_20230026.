import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkfeWwzMkcvFNpbWVLrsv1rbJ3IgD7yCQ",
  authDomain: "fir-practica-20230026.firebaseapp.com",
  projectId: "fir-practica-20230026",
  storageBucket: "fir-practica-20230026.firebasestorage.app",
  messagingSenderId: "168434137100",
  appId: "1:168434137100:web:7974c1d42ae8434b195629"
};

console.log('🔧 Initializing Firebase...');
console.log('📋 Project ID:', firebaseConfig.projectId);

// Initialize Firebase solo si no existe
let app;
if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase app:', error);
  }
} else {
  app = getApps()[0];
  console.log('✅ Using existing Firebase app');
}

// Inicializar Auth con persistencia para React Native
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  console.log('✅ Auth initialized with AsyncStorage persistence');
} catch (error) {
  console.log('⚠️ Auth initialization error:', error.code);
  // Si ya está inicializado, usar la instancia existente
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
    console.log('✅ Using existing auth instance');
  } else {
    console.error('❌ Critical auth error:', error);
    // Fallback a getAuth normal
    try {
      auth = getAuth(app);
      console.log('✅ Fallback to getAuth successful');
    } catch (fallbackError) {
      console.error('❌ Fallback auth failed:', fallbackError);
    }
  }
}

// Inicializar Firestore
let db;
try {
  db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firestore:', error);
}

export { auth, db };
export default app;