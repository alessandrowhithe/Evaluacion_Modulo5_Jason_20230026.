import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Nuevo logo minimalista
const MinimalLogo = ({ fadeAnim, scaleAnim, bounceAnim }) => (
  <Animated.View
    style={[
      styles.logoContainer,
      {
        opacity: fadeAnim,
        transform: [
          { scale: scaleAnim },
          { translateY: bounceAnim },
        ],
      },
    ]}
  >
    <View style={styles.logoSquare}>
      <View style={styles.logoInnerSquare} />
      <View style={styles.logoAccent} />
    </View>
  </Animated.View>
);

// Título con nueva tipografía
const AppTitle = ({ fadeAnim, slideAnim }) => (
  <Animated.View
    style={[
      styles.titleContainer,
      {
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      },
    ]}
  >
    <Text style={styles.appName}>Nexus</Text>
    <Text style={styles.tagline}>Connect & Manage</Text>
  </Animated.View>
);

// Indicador de carga minimalista
const LoadingDots = ({ fadeAnim, dot1Anim, dot2Anim, dot3Anim }) => (
  <Animated.View
    style={[
      styles.loadingContainer,
      { opacity: fadeAnim },
    ]}
  >
    <Animated.View
      style={[
        styles.dot,
        { transform: [{ scale: dot1Anim }] },
      ]}
    />
    <Animated.View
      style={[
        styles.dot,
        { transform: [{ scale: dot2Anim }] },
      ]}
    />
    <Animated.View
      style={[
        styles.dot,
        { transform: [{ scale: dot3Anim }] },
      ]}
    />
  </Animated.View>
);

export default function SplashScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.3));
  const [slideAnim] = useState(new Animated.Value(-200));
  const [bounceAnim] = useState(new Animated.Value(0));
  const [dot1Anim] = useState(new Animated.Value(0.5));
  const [dot2Anim] = useState(new Animated.Value(0.5));
  const [dot3Anim] = useState(new Animated.Value(0.5));

  useEffect(() => {
    // Animación de entrada secuencial
    Animated.sequence([
      // Logo aparece con bounce
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      
      // Título desliza desde la izquierda
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de bounce continua del logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación de los dots de carga
    const animateDots = () => {
      Animated.loop(
        Animated.stagger(200, [
          Animated.sequence([
            Animated.timing(dot1Anim, {
              toValue: 1.5,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot1Anim, {
              toValue: 0.5,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(dot2Anim, {
              toValue: 1.5,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Anim, {
              toValue: 0.5,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(dot3Anim, {
              toValue: 1.5,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Anim, {
              toValue: 0.5,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    setTimeout(animateDots, 1000);
  }, []);

  return (
    <View style={styles.container}>
      {/* Fondo con gradiente minimalista */}
      <View style={styles.backgroundGradient} />
      
      {/* Elementos geométricos decorativos */}
      <View style={styles.geometricElements}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.rectangle, styles.rect1]} />
        <View style={[styles.rectangle, styles.rect2]} />
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        <MinimalLogo 
          fadeAnim={fadeAnim}
          scaleAnim={scaleAnim}
          bounceAnim={bounceAnim}
        />

        <AppTitle 
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
        />

        <LoadingDots 
          fadeAnim={fadeAnim}
          dot1Anim={dot1Anim}
          dot2Anim={dot2Anim}
          dot3Anim={dot3Anim}
        />
      </View>

      {/* Versión en esquina */}
      <Animated.View
        style={[
          styles.versionTag,
          { opacity: fadeAnim },
        ]}
      >
        <Text style={styles.versionText}>v3.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Fondo minimalista
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8fafc',
  },

  // Elementos geométricos decorativos
  geometricElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: 'rgba(99, 102, 241, 0.03)',
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    bottom: -50,
    left: -50,
  },
  rectangle: {
    position: 'absolute',
    borderRadius: 20,
  },
  rect1: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    top: 100,
    left: 30,
    transform: [{ rotate: '45deg' }],
  },
  rect2: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(249, 115, 22, 0.06)',
    bottom: 200,
    right: 40,
    transform: [{ rotate: '-30deg' }],
  },

  content: {
    alignItems: 'center',
    zIndex: 10,
  },

  // Logo minimalista
  logoContainer: {
    marginBottom: 40,
  },
  logoSquare: {
    width: 80,
    height: 80,
    backgroundColor: '#6366f1',
    borderRadius: 20,
    position: 'relative',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoInnerSquare: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  logoAccent: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 20,
    height: 20,
    backgroundColor: '#ec4899',
    borderRadius: 6,
  },

  // Título
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },

  // Indicador de carga
  loadingContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366f1',
  },

  // Versión
  versionTag: {
    position: 'absolute',
    top: 60,
    right: 24,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
  },
});