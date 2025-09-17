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
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

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
      <Text style={styles.inputHelper}>Este campo no se puede modificar por seguridad</Text>
    )}
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
      {loading ? 'Guardando...' : title}
    </Text>
  </TouchableOpacity>
);

// Header minimalista
const MinimalHeader = ({ title, subtitle, userName, fadeAnim, slideAnim }) => (
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
        <View style={styles.iconEdit} />
      </View>
    </View>
    <Text style={styles.headerTitle}>{title}</Text>
    <Text style={styles.headerSubtitle}>{subtitle}</Text>
    {userName && (
      <View style={styles.userBadge}>
        <Text style={styles.userBadgeText}>{userName}</Text>
      </View>
    )}
  </Animated.View>
);

// Panel de información de cuenta
const AccountInfoCard = ({ title, data, fadeAnim }) => (
  <Animated.View
    style={[
      styles.accountCard,
      { opacity: fadeAnim },
    ]}
  >
    <View style={styles.accountCardHeader}>
      <View style={styles.accountDot} />
      <Text style={styles.accountCardTitle}>{title}</Text>
    </View>
    <View style={styles.accountCardContent}>
      {data.map((item, index) => (
        <View key={index} style={styles.accountRow}>
          <Text style={styles.accountLabel}>{item.label}:</Text>
          <Text style={styles.accountValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  </Animated.View>
);

// Indicador de cambios
const ChangesIndicator = ({ hasChanges, fadeAnim }) => (
  hasChanges ? (
    <Animated.View
      style={[
        styles.changesIndicator,
        { opacity: fadeAnim },
      ]}
    >
      <View style={styles.changesDot} />
      <Text style={styles.changesText}>Cambios pendientes</Text>
    </Animated.View>
  ) : null
);

export default function EditUserScreen({ route, navigation }) {
  const { userId, userData } = route.params;
  
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    universityDegree: userData?.universityDegree || '',
    graduationYear: userData?.graduationYear || '',
  });
  
  const [originalData, setOriginalData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

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

  useEffect(() => {
    // Verificar si hay cambios
    const hasFormChanges = 
      formData.name !== originalData.name ||
      formData.universityDegree !== originalData.universityDegree ||
      formData.graduationYear !== originalData.graduationYear;
    
    setHasChanges(hasFormChanges);
  }, [formData, originalData]);

  const loadUserData = async () => {
    try {
      console.log('Cargando datos del usuario con ID:', userId);
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('Datos del usuario cargados:', data);
        
        const userData = {
          name: data.name || '',
          email: data.email || '',
          universityDegree: data.universityDegree || '',
          graduationYear: data.graduationYear || '',
        };
        
        setFormData(userData);
        setOriginalData({
          ...userData,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      } else {
        console.log('No se encontró el usuario');
        Alert.alert('Error', 'No se encontró el usuario');
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario: ' + error.message);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { name, universityDegree, graduationYear } = formData;
    
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
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

  const handleSaveChanges = async () => {
    console.log('Iniciando guardado de cambios...');
    
    if (!validateForm()) {
      console.log('Validación del formulario falló');
      return;
    }

    if (!hasChanges) {
      Alert.alert('Sin Cambios', 'No se han realizado modificaciones');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Guardando cambios para usuario ID:', userId);
      
      // Preparar datos para actualizar
      const updateData = {
        name: formData.name.trim(),
        universityDegree: formData.universityDegree.trim(),
        graduationYear: formData.graduationYear.trim(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Datos a actualizar:', updateData);

      // Actualizar en Firebase
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, updateData);

      console.log('Usuario actualizado exitosamente');

      Alert.alert(
        '¡Actualización Exitosa!', 
        `Los datos de ${formData.name} han sido actualizados correctamente`,
        [
          {
            text: 'Volver',
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      Alert.alert('Error', 'No se pudieron guardar los cambios: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Descartar Cambios',
        '¿Estás seguro de que quieres descartar los cambios realizados?',
        [
          {
            text: 'Continuar',
            style: 'cancel',
          },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const accountData = [
    { label: 'Creado', value: formatDate(originalData.createdAt || userData?.createdAt) },
    { label: 'Última actualización', value: formatDate(originalData.updatedAt) || 'Nunca' }
  ];

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
          title="Editar Usuario"
          subtitle="Modificar datos del sistema"
          userName={formData.name}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
        />

        {/* Indicador de cambios */}
        <ChangesIndicator hasChanges={hasChanges} fadeAnim={fadeAnim} />

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
            placeholder="Correo electrónico"
            editable={false}
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

          <AccountInfoCard
            title="Información de Cuenta"
            data={accountData}
            fadeAnim={fadeAnim}
          />

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <MinimalButton
              title="Cancelar"
              onPress={handleCancel}
              variant="outline"
              flex={true}
            />
            
            <MinimalButton
              title="Guardar Cambios"
              onPress={handleSaveChanges}
              loading={isLoading}
              disabled={!hasChanges}
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
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    top: 80,
    right: -30,
    borderRadius: 80,
  },
  shape2: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(236, 72, 153, 0.04)',
    bottom: 200,
    left: -20,
    borderRadius: 60,
  },
  shape3: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(34, 197, 94, 0.06)',
    top: 350,
    left: 40,
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
    marginBottom: 24,
  },
  headerIcon: {
    marginBottom: 16,
  },
  iconSquare: {
    width: 56,
    height: 56,
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconEdit: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 4,
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
    marginBottom: 12,
  },
  userBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  userBadgeText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },

  // Indicador de cambios
  changesIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  changesDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f59e0b',
    marginRight: 8,
  },
  changesText: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '600',
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
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
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

  // Card de información de cuenta
  accountCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  accountCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
    marginRight: 8,
  },
  accountCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  accountCardContent: {
    gap: 8,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  accountValue: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
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
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
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