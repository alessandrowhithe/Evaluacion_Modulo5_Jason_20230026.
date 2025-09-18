import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  Animated,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Componente de tarjeta minimalista
const MinimalCard = ({ children, style = {} }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

// Avatar minimalista
const MinimalAvatar = ({ name, bounceAnim }) => {
  const initial = name ? name.charAt(0).toUpperCase() : 'U';
  
  return (
    <Animated.View
      style={[
        styles.avatar,
        {
          transform: [{ scale: bounceAnim }],
        },
      ]}
    >
      <Text style={styles.avatarText}>{initial}</Text>
    </Animated.View>
  );
};

// Estadística minimalista
const StatCard = ({ value, label, color = '#6366f1' }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Botón de acción rápida
const QuickActionButton = ({ title, onPress, color = '#6366f1', icon }) => (
  <TouchableOpacity
    style={[styles.quickAction, { backgroundColor: color }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.quickActionIcon}>
      {icon}
    </View>
    <Text style={styles.quickActionText}>{title}</Text>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Animaciones
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [bounceAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animaciones de entrada
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
    ]).start();

    // Animación de bounce del avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        setUserData({
          name: auth.currentUser.displayName || 'Usuario',
          email: auth.currentUser.email,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUserData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysActive = () => {
    if (!userData?.createdAt) return '0';
    const created = new Date(userData.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDots}>
          <View style={styles.loadingDot} />
          <View style={styles.loadingDot} />
          <View style={styles.loadingDot} />
        </View>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Elementos decorativos de fondo */}
      <View style={styles.backgroundShapes}>
        <View style={[styles.bgShape, styles.bgShape1]} />
        <View style={[styles.bgShape, styles.bgShape2]} />
        <View style={[styles.bgShape, styles.bgShape3]} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#6366f1"
            colors={["#6366f1"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <Text style={styles.greeting}>¡Hola!</Text>
              <Text style={styles.userName}>{userData?.name || 'Usuario'}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutText}>Salir</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Perfil del usuario */}
        <Animated.View
          style={[
            styles.profileSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <MinimalCard style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <MinimalAvatar 
                name={userData?.name}
                bounceAnim={bounceAnim}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData?.name || 'Usuario'}</Text>
                <Text style={styles.profileEmail}>{userData?.email}</Text>
                <View style={styles.statusContainer}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Activo</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.profileDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Carrera</Text>
                <Text style={styles.detailValue}>
                  {userData?.universityDegree || 'No especificado'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Graduación</Text>
                <Text style={styles.detailValue}>
                  {userData?.graduationYear || 'No especificado'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Miembro desde</Text>
                <Text style={styles.detailValue}>
                  {formatDate(userData?.createdAt)}
                </Text>
              </View>
            </View>
          </MinimalCard>
        </Animated.View>

        {/* Estadísticas */}
        <Animated.View
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsGrid}>
            <StatCard 
              value={getDaysActive()}
              label="Días activo"
              color="#22c55e"
            />
            <StatCard 
              value="100%"
              label="Completado"
              color="#6366f1"
            />
            <StatCard 
              value="1"
              label="Cuenta activa"
              color="#ec4899"
            />
          </View>
        </Animated.View>

        {/* Acciones rápidas */}
        <Animated.View
          style={[
            styles.actionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Acciones</Text>
          <View style={styles.actionsGrid}>
            <QuickActionButton
              title="Editar Perfil"
              color="#6366f1"
              onPress={() => navigation.navigate('EditProfile')}
              icon={<View style={styles.editIcon} />}
            />
            {/* Botón Actualizar eliminado */}
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

  // Elementos de fondo
  backgroundShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgShape: {
    position: 'absolute',
    borderRadius: 20,
  },
  bgShape1: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(99, 102, 241, 0.03)',
    top: 50,
    right: -50,
    borderRadius: 100,
  },
  bgShape2: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    bottom: 200,
    left: -30,
    borderRadius: 75,
  },
  bgShape3: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(236, 72, 153, 0.04)',
    top: 300,
    left: 20,
    transform: [{ rotate: '45deg' }],
  },

  // Loading
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
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

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },

  // Header
  header: {
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '400',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 4,
    letterSpacing: -1,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  // Tarjeta base
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // Perfil
  profileSection: {
    marginBottom: 24,
  },
  profileCard: {
    padding: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
  },

  profileDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  // Secciones
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },

  // Estadísticas
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  // Acciones
  actionsSection: {
    marginBottom: 40,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  editIcon: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
  },
  // refreshIcon eliminado
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});