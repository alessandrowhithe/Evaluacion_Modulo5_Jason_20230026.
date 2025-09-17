import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Componente de input minimalista reutilizable
const MinimalInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  maxLength,
  focused,
  onFocus,
  onBlur,
  required = false
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>
      {label} {required && <Text style={styles.requiredMark}>*</Text>}
    </Text>
    <TextInput
      style={[
        styles.textInput,
        focused && styles.textInputFocused,
        multiline && styles.textInputMultiline
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      maxLength={maxLength}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  </View>
);

// Botón minimalista
const MinimalButton = ({ title, onPress, loading = false, variant = 'primary', disabled = false }) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === 'secondary' && styles.buttonSecondary,
      (loading || disabled) && styles.buttonDisabled
    ]}
    onPress={onPress}
    disabled={loading || disabled}
    activeOpacity={0.8}
  >
    <Text style={[
      styles.buttonText,
      variant === 'secondary' && styles.buttonTextSecondary
    ]}>
      {loading ? 'Creando cuenta...' : title}
    </Text>
  </TouchableOpacity>
);

// Logo minimalista
const MinimalLogo = ({ fadeAnim, slideAnim }) => (
  <Animated.View
    style={[
      styles.logoContainer,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      },
    ]}
  >
    <View style={styles.logoSquare}>
      <View style={styles.logoInner} />
      <View style={styles.logoAccent} />
    </View>
  </Animated.View>
);

// Panel de información
const InfoPanel = ({ children, fadeAnim }) => (
  <Animated.View
    style={[
      styles.infoPanel,
      { opacity: fadeAnim },
    ]}
  >
    <View style={styles.infoPanelHeader}>
      <View style={styles.infoDot} />
      <Text style={styles.infoPanelTitle}>Información</Text>
    </View>
    <View style={styles.infoPanelContent}>
      {children}
    </View>
  </Animated.View>
);

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    universityDegree: '',
    graduationYear: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // Animaciones
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-30));
  const [formAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { name, email, password, universityDegree, graduationYear } = formData;
    
    if (!name.trim() || !email.trim() || !password.trim() || !universityDegree.trim() || !graduationYear.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    const currentYear = new Date().getFullYear();
    const yearNumber = parseInt(graduationYear);
    
    if (isNaN(yearNumber) || yearNumber < 1950 || yearNumber > currentYear + 10) {
      Alert.alert('Error', `Por favor, ingresa un año válido entre 1950 y ${currentYear + 10}`);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        formData.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        universityDegree: formData.universityDegree.trim(),
        graduationYear: parseInt(formData.graduationYear),
        createdAt: new Date().toISOString(),
        isActive: true,
      });

      Alert.alert('¡Éxito!', 'Usuario registrado correctamente');

    } catch (error) {
      let message = 'Error al registrar usuario';

      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Este correo electrónico ya está registrado';
          break;
        case 'auth/invalid-email':
          message = 'Correo electrónico inválido';
          break;
        case 'auth/weak-password':
          message = 'La contraseña es muy débil';
          break;
        default:
          message = `Error: ${error.message}`;
      }
      
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Elementos decorativos de fondo */}
      <View style={styles.backgroundShapes}>
        <View style={[styles.shape, styles.shape1]} />
        <View style={[styles.shape, styles.shape2]} />
        <View style={[styles.shape, styles.shape3]} />
        <View style={[styles.shape, styles.shape4]} />
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <MinimalLogo 
              fadeAnim={fadeAnim}
              slideAnim={slideAnim}
            />
            
            <Animated.View
              style={[
                styles.titleContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.title}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>Únete a nuestra comunidad</Text>
            </Animated.View>
          </View>

          {/* Formulario */}
          <Animated.View
            style={[
              styles.form,
              {
                opacity: fadeAnim,
                transform: [{ translateY: formAnim }],
              },
            ]}
          >
            <MinimalInput
              label="Nombre completo"
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Tu nombre completo"
              autoCapitalize="words"
              focused={focusedInput === 'name'}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              required={true}
            />

            <MinimalInput
              label="Correo electrónico"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              focused={focusedInput === 'email'}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              required={true}
            />

            <MinimalInput
              label="Contraseña"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry={true}
              autoCapitalize="none"
              focused={focusedInput === 'password'}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              required={true}
            />

            <MinimalInput
              label="Título universitario"
              value={formData.universityDegree}
              onChangeText={(value) => updateField('universityDegree', value)}
              placeholder="Ej: Ingeniería en Sistemas"
              autoCapitalize="words"
              multiline={true}
              focused={focusedInput === 'degree'}
              onFocus={() => setFocusedInput('degree')}
              onBlur={() => setFocusedInput(null)}
              required={true}
            />

            <MinimalInput
              label="Año de graduación"
              value={formData.graduationYear}
              onChangeText={(value) => updateField('graduationYear', value)}
              placeholder={`${new Date().getFullYear()}`}
              keyboardType="numeric"
              maxLength={4}
              focused={focusedInput === 'year'}
              onFocus={() => setFocusedInput('year')}
              onBlur={() => setFocusedInput(null)}
              required={true}
            />

            <InfoPanel fadeAnim={fadeAnim}>
              <Text style={styles.infoText}>• Todos los campos son obligatorios</Text>
              <Text style={styles.infoText}>• Tu información será verificada</Text>
              <Text style={styles.infoText}>• La contraseña debe tener al menos 6 caracteres</Text>
            </InfoPanel>

            <MinimalButton
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={isLoading}
            />

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <MinimalButton
              title="Ya tengo cuenta"
              onPress={() => navigation.navigate('Login')}
              variant="secondary"
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Formas decorativas de fondo
  backgroundShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shape: {
    position: 'absolute',
    borderRadius: 20,
  },
  shape1: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
    top: 50,
    right: -30,
    borderRadius: 75,
  },
  shape2: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    bottom: 250,
    left: -20,
    borderRadius: 50,
  },
  shape3: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(34, 197, 94, 0.06)',
    top: 200,
    left: 30,
    transform: [{ rotate: '45deg' }],
  },
  shape4: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(249, 115, 22, 0.03)',
    bottom: 100,
    right: 10,
    borderRadius: 60,
  },

  content: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoSquare: {
    width: 64,
    height: 64,
    backgroundColor: '#6366f1',
    borderRadius: 16,
    position: 'relative',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoInner: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 6,
  },
  logoAccent: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 16,
    height: 16,
    backgroundColor: '#ec4899',
    borderRadius: 4,
  },

  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '400',
  },

  // Formulario
  form: {
    gap: 20,
  },

  // Input
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  requiredMark: {
    color: '#ef4444',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: 'white',
  },
  textInputFocused: {
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },

  // Panel de información
  infoPanel: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  infoPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366f1',
    marginRight: 8,
  },
  infoPanelTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  infoPanelContent: {
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },

  // Botones
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#64748b',
  },

  // Divisor
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#94a3b8',
    fontSize: 14,
  },
});