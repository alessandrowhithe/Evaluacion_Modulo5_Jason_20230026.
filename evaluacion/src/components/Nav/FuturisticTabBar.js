import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// Componente de icono luna
const MoonIcon = ({ color, size, isActive }) => (
  <View style={[styles.moonContainer, { width: size, height: size }]}>
    {/* Luna base */}
    <View 
      style={[
        styles.moonBase, 
        { 
          backgroundColor: isActive ? '#ff8c42' : '#ffffff', // Anaranjado cuando activo, blanco cuando inactivo
          width: size * 0.8, 
          height: size * 0.8,
          borderWidth: 2,
          borderColor: '#000000', // Líneas negras para contraste
        }
      ]} 
    />
    {/* Sombra de la luna (creciente) */}
    <View 
      style={[
        styles.moonShadow, 
        { 
          backgroundColor: isActive ? '#e67635' : '#f0f0f0', // Sombra más oscura
          width: size * 0.6, 
          height: size * 0.6,
          borderWidth: 1,
          borderColor: '#000000',
        }
      ]} 
    />
    {/* Cráteres de la luna */}
    <View 
      style={[
        styles.crater1, 
        { 
          backgroundColor: isActive ? '#d9661f' : '#e0e0e0',
          width: size * 0.15, 
          height: size * 0.15,
          borderWidth: 0.5,
          borderColor: '#000000',
        }
      ]} 
    />
    <View 
      style={[
        styles.crater2, 
        { 
          backgroundColor: isActive ? '#d9661f' : '#e0e0e0',
          width: size * 0.1, 
          height: size * 0.1,
          borderWidth: 0.5,
          borderColor: '#000000',
        }
      ]} 
    />
  </View>
);

export default function FuturisticTabBar({ state, descriptors, navigation }) {
  const [indicatorPosition] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animación del indicador de pestaña activa
    Animated.timing(indicatorPosition, {
      toValue: state.index,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Animación de pulso continua
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación de brillo continua
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [state.index]);

  const tabWidth = (width - 40) / state.routes.length;

  const getTabIcon = (routeName, isFocused) => {
    const iconSize = 22;
    
    switch (routeName) {
      case 'Home':
        return (
          <MoonIcon 
            color={isFocused ? '#ff8c42' : '#ffffff'} 
            size={iconSize}
            isActive={isFocused}
          />
        );
      case 'AddUser':
        return (
          <MoonIcon 
            color={isFocused ? '#ff8c42' : '#ffffff'} 
            size={iconSize}
            isActive={isFocused}
          />
        );
      default:
        return (
          <MoonIcon 
            color={isFocused ? '#ff8c42' : '#ffffff'} 
            size={iconSize}
            isActive={isFocused}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Efecto de vidrio transparente */}
      <View style={styles.glassEffect} />

      {/* Partículas flotantes sutiles */}
      <View style={styles.particlesContainer}>
        {[...Array(6)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: Math.random() * width,
                transform: [{ scale: pulseAnim }],
                opacity: glowAnim,
              },
            ]}
          />
        ))}
      </View>

      {/* Indicador de pestaña activa */}
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            left: indicatorPosition.interpolate({
              inputRange: state.routes.map((_, i) => i),
              outputRange: state.routes.map((_, i) => 20 + i * tabWidth),
            }),
            width: tabWidth,
          },
        ]}
      />

      {/* Contenedor de pestañas */}
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tab, { width: tabWidth }]}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  isFocused && styles.tabContentActive,
                  {
                    transform: [
                      {
                        scale: isFocused ? pulseAnim : 1,
                      },
                    ],
                  },
                ]}
              >
                {/* Icono luna de la pestaña */}
                <View style={styles.iconContainer}>
                  {getTabIcon(route.name, isFocused)}
                </View>

                {/* Texto de la pestaña */}
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {label}
                </Text>

                {/* Efecto de brillo para pestaña activa */}
                {isFocused && (
                  <Animated.View
                    style={[
                      styles.activeGlow,
                      {
                        opacity: glowAnim,
                      },
                    ]}
                  />
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'transparent', // FONDO COMPLETAMENTE TRANSPARENTE
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Efecto de vidrio transparente
  glassEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // VIDRIO SUTIL
    backdropFilter: 'blur(20px)', // EFECTO BLUR (iOS)
    borderRadius: 0, // SIN ESQUINAS
  },

  // Estilos para la luna
  moonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  moonBase: {
    position: 'absolute',
    borderRadius: 50, // Círculo perfecto
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  moonShadow: {
    position: 'absolute',
    borderRadius: 50,
    right: -2,
    top: 2,
    opacity: 0.7,
  },
  crater1: {
    position: 'absolute',
    borderRadius: 50,
    left: 2,
    top: 1,
  },
  crater2: {
    position: 'absolute',
    borderRadius: 50,
    right: 3,
    bottom: 2,
  },

  iconContainer: {
    marginBottom: 4,
  },

  // Partículas sutiles
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // PARTÍCULAS BLANCAS SUTILES
    borderRadius: 0.5,
    top: Math.random() * 60,
  },

  // Indicador activo
  activeIndicator: {
    position: 'absolute',
    top: 18,
    height: 50,
    backgroundColor: 'rgba(255, 140, 66, 0.3)', // INDICADOR ANARANJADO SUTIL
    borderRadius: 25,
    zIndex: 1,
  },

  // Contenedor de pestañas
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },

  // Pestaña individual
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    position: 'relative',
  },
  tabContentActive: {
    backgroundColor: 'rgba(255, 140, 66, 0.15)', // FONDO ACTIVO ANARANJADO
  },

  // Texto de la pestaña
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  tabLabelActive: {
    color: '#ff8c42', // TEXTO ANARANJADO CUANDO ACTIVO
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // SOMBRA NEGRA PARA CONTRASTE
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tabLabelInactive: {
    color: '#ffffff', // TEXTO BLANCO CUANDO INACTIVO
    textShadowColor: 'rgba(0, 0, 0, 0.7)', // SOMBRA NEGRA PARA CONTRASTE
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Efecto de brillo activo
  activeGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 140, 66, 0.2)', // BRILLO ANARANJADO
    zIndex: -1,
  },
});