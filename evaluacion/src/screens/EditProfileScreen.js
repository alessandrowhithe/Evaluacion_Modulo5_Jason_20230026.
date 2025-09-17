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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
  editable = true,
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
        multiline && styles.textInputMultiline,
        !editable && styles.textInputDisabled
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
      editable={editable}
    />
    {!editable && (
      <Text style={styles.inputHelper}>Este campo no se puede modificar</Text>
    )}
  </View>
);

// Botón minimalista
const MinimalButton = ({ title, onPress, loading = false, variant = 'primary', disabled = false, flex = false }) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === 'secondary' && styles.buttonSecondary,
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
      variant === 'outline' && styles.buttonTextOutline
    ]}>
      {loading ? 'Guardando...' : title}
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
      <View style={styles.iconSquare} />
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

// Loading simple
const SimpleLoading = () => (
  <View style={styles.loadingContainer}>
    <View style={styles.loadingDots}>
      <View style={styles.loadingDot} />
      <View style={styles.loadingDot} />
      <View style={styles.loadingDot} />
    </View>
    <Text style={styles.loadingText}>Cargando perfil...</Text>
  </View>
);

export default function EditProfileScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    universityDegree: '',
    graduationYear: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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

    loadUserData();
  }, []);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFormData({
          name: userData.name || '',
          universityDegree: userData.universityDegree || '',
          graduationYear: userData.graduationYear ? userData.graduationYear.toString() : '',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const { name, graduationYear } = formData;
    
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return false;
    }

    if (graduationYear) {
      const currentYear = new Date().getFullYear();
      const yearNumber = parseInt(graduationYear);
      
      if (isNaN(yearNumber) || yearNumber < 1950 || yearNumber > currentYear + 10) {
        Alert.alert('Error', `Por favor, ingresa un año válido entre 1950 y ${currentYear + 10}`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updateData = {
        name: formData.name.trim(),
        updatedAt: new Date().toISOString(),
      };

      if (formData.universityDegree.trim()) {
        updateData.universityDegree = formData.universityDegree.trim();
      }

      if (formData.graduationYear) {
        updateData.graduationYear = parseInt(formData.graduationYear);
      }

      await updateDoc(doc(db, 'users', auth.currentUser.uid), updateData);
      
      Alert.alert('¡Éxito!', 'Perfil actualizado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar',
      '¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.',
      [
        {
          text: 'Continuar editando',
          style: 'cancel',
        },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <SimpleLoading />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Elementos decorativos de fondo */}
      <View style={styles.backgroundShapes}>
        <View style={[styles.shape, styles.shape1]} />
        <View style={[styles.shape, styles.shape2]} />
        <View style={[styles.shape, styles.shape3]} />
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
          <MinimalHeader
            title="Editar Perfil"
            subtitle="Actualiza tu información"
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
              label="Correo electrónico"
              value={auth.currentUser?.email || ''}
              editable={false}
              placeholder="Correo electrónico"
            />

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
              label="Título universitario"
              value={formData.universityDegree}
              onChangeText={(value) => updateField('universityDegree', value)}
              placeholder="Tu carrera universitaria..."
              autoCapitalize="words"
              multiline={true}
              focused={focusedInput === 'degree'}
              onFocus={() => setFocusedInput('degree')}
              onBlur={() => setFocusedInput(null)}
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
            />

            <InfoCard title="Información" fadeAnim={fadeAnim}>
              <Text style={styles.infoText}>• Los campos marcados con * son obligatorios</Text>
              <Text style={styles.infoText}>• Los cambios se guardarán inmediatamente</Text>
              <Text style={styles.infoText}>• El correo electrónico no se puede modificar</Text>
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
                title="Guardar"
                onPress={handleSave}
                loading={isLoading}
                variant="primary"
                flex={true}
              />
            </View>
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
  },
  shape1: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(34, 197, 94, 0.04)',
    top: 80,
    right: -40,
    borderRadius: 90,
  },
  shape2: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    bottom: 150,
    left: -30,
    borderRadius: 60,
  },
  shape3: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(236, 72, 153, 0.06)',
    top: 250,
    left: 40,
    borderRadius: 20,
    transform: [{ rotate: '45deg' }],
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
  },
  loadingText: {
    color: '#64748b',
    fontSize: 16,
  },

  content: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
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
    width: 48,
    height: 48,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
  textInputDisabled: {
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
  },
  inputHelper: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
    fontStyle: 'italic',
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
  buttonTextOutline: {
    color: '#64748b',
  },
});