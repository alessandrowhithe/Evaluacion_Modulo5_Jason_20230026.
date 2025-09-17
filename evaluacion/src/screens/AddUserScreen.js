import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Componente de input minimalista
const MinimalInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
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
const MinimalButton = ({ title, onPress, loading = false, variant = 'primary', disabled = false, flex = false }) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === 'secondary' && styles.buttonSecondary,
      variant === 'danger' && styles.buttonDanger,
      variant === 'outline' && styles.buttonOutline,
      (loading || disabled) && styles.buttonDisabled,
      flex && { flex: 1 }
    ]}
    onPress={onPress}
    disabled={loading || disabled}
    activeOpacity={0.8}
  >
    <Text style={[
      styles.buttonText,
      variant === 'secondary' && styles.buttonTextSecondary,
      variant === 'danger' && styles.buttonTextDanger,
      variant === 'outline' && styles.buttonTextOutline
    ]}>
      {loading ? 'Creando...' : title}
    </Text>
  </TouchableOpacity>
);

// Header minimalista
const MinimalHeader = ({ title, subtitle, fadeAnim, slideAnim }) => (
  <Animated.View
    style={[
      styles.header,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      },
    ]}
  >
    <View style={styles.headerIcon}>
      <View style={styles.iconSquare}>
        <View style={styles.iconPlus} />
      </View>
    </View>
    <Text style={styles.headerTitle}>{title}</Text>
    <Text style={styles.headerSubtitle}>{subtitle}</Text>
  </Animated.View>
);

// Panel de información
const InfoCard = ({ title, children, fadeAnim }) => (
  <Animated.View
    style={[
      styles.infoCard,
      { opacity: fadeAnim },
    ]}
  >
    <View style={styles.infoCardHeader}>
      <View style={styles.infoDot} />
      <Text style={styles.infoCardTitle}>{title}</Text>
    </View>
    <View style={styles.infoCardContent}>
      {children}
    </View>
  </Animated.View>
);

export default function AddUserScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    universityDegree: '',
    graduationYear: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // Animaciones
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-20));
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
    const { name, email, universityDegree, graduationYear } = formData;
    
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'El email es obligatorio');
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, ingresa un email válido');
      return false;
    }

    if (!universityDegree.trim()) {
      Alert.alert('Error', 'El título universitario es obligatorio');
      return false;
    }

    if (!graduationYear.trim()) {
      Alert.alert('Error', 'El año de graduación es obligatorio');
      return false;
    }

    // Validar año de graduación
    const currentYear = new Date().getFullYear();
    const year = parseInt(graduationYear);
    if (isNaN(year) || year < 1950 || year > currentYear + 5) {
      Alert.alert('Error', `El año de graduación debe estar entre 1950 y ${currentYear + 5}`);
      return false;
    }

    return true;
  };

  const handleAddUser = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Generar contraseña temporal
      const tempPassword = `temp${Math.random().toString(36).slice(-8)}`;
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        tempPassword
      );

      // Guardar datos en Firestore
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        universityDegree: formData.universityDegree.trim(),
        graduationYear: formData.graduationYear.trim(),
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.uid || 'system',
        isActive: true,
        tempPassword: tempPassword,
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      Alert.alert(
        '¡Usuario Creado!', 
        `Usuario: ${formData.name}\nEmail: ${formData.email}\nContraseña temporal: ${tempPassword}\n\n¡Asegúrate de compartir estas credenciales de forma segura!`,
        [
          {
            text: 'Crear Otro',
            onPress: () => {
              setFormData({
                name: '',
                email: '',
                universityDegree: '',
                graduationYear: '',
              });
            },
          },
          {
            text: 'Volver',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );

    } catch (error) {
      console.log('Error al crear usuario:', error);
      let message = 'Error al crear usuario';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Este correo electrónico ya está registrado';
          break;
        case 'auth/invalid-email':
          message = 'Correo electrónico inválido';
          break;
        case 'auth/weak-password':
          message = 'La contraseña generada es muy débil';
          break;
        default:
          message = `Error: ${error.message}`;
      }
      
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Confirmar Cancelación',
      '¿Estás seguro de que quieres cancelar? Los datos ingresados se perderán.',
      [
        {
          text: 'Continuar',
          style: 'cancel',
        },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Elementos decorativos de fondo */}
      <View style={styles.backgroundShapes}>
        <View style={[styles.shape, styles.shape1]} />
        <View style={[styles.shape, styles.shape2]} />
        <View style={[styles.shape, styles.shape3]} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <MinimalHeader
          title="Agregar Usuario"
          subtitle="Crear nueva cuenta"
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
        />

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
            placeholder="Nombre del usuario"
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
            placeholder="usuario@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            focused={focusedInput === 'email'}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
            required={true}
          />

          <MinimalInput
            label="Título universitario"
            value={formData.universityDegree}
            onChangeText={(value) => updateField('universityDegree', value)}
            placeholder="Ej: Licenciatura en Ingeniería"
            autoCapitalize="words"
            multiline={true}
            focused={focusedInput === 'universityDegree'}
            onFocus={() => setFocusedInput('universityDegree')}
            onBlur={() => setFocusedInput(null)}
            required={true}
          />

          <MinimalInput
            label="Año de graduación"
            value={formData.graduationYear}
            onChangeText={(value) => updateField('graduationYear', value)}
            placeholder="2020"
            keyboardType="numeric"
            maxLength={4}
            focused={focusedInput === 'graduationYear'}
            onFocus={() => setFocusedInput('graduationYear')}
            onBlur={() => setFocusedInput(null)}
            required={true}
          />

          <InfoCard title="Información del Sistema" fadeAnim={fadeAnim}>
            <Text style={styles.infoText}>• Se generará una contraseña temporal automáticamente</Text>
            <Text style={styles.infoText}>• El usuario recibirá acceso inmediato al sistema</Text>
            <Text style={styles.infoText}>• La fecha de creación se asignará automáticamente</Text>
            <Text style={styles.infoText}>• Todos los campos son obligatorios</Text>
          </InfoCard>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <MinimalButton
              title="Cancelar"
              onPress={handleCancel}
              variant="outline"
              flex={true}
            />
            
            <MinimalButton
              title="Crear Usuario"
              onPress={handleAddUser}
              loading={isLoading}
              variant="secondary"
              flex={true}
            />
          </View>
        </Animated.View>
      </ScrollView>
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
  },
  shape1: {
    width: 160,
    height: 160,
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    top: 60,
    right: -30,
    borderRadius: 80,
  },
  shape2: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
    bottom: 200,
    left: -20,
    borderRadius: 60,
  },
  shape3: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(249, 115, 22, 0.06)',
    top: 300,
    left: 50,
    borderRadius: 20,
    transform: [{ rotate: '45deg' }],
  },

  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerIcon: {
    marginBottom: 16,
  },
  iconSquare: {
    width: 56,
    height: 56,
    backgroundColor: '#22c55e',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconPlus: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 4,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    letterSpacing: -1,
  },
  headerSubtitle: {
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
    borderColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },

  // Card de información
  infoCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginRight: 8,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
  },
  infoCardContent: {
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },

  // Botones
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
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
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  buttonOutline: {
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
    color: 'white',
  },
  buttonTextDanger: {
    color: 'white',
  },
  buttonTextOutline: {
    color: '#64748b',
  },
});