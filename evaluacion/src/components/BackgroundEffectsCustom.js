import React from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const BackgroundEffects = ({ pulseAnim, rotateAnim }) => {
  const float = rotateAnim ? rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  }) : 0;

  return (
    <>
      {/* Fondo minimalista */}
      <View style={styles.backgroundGradient}>
        <View style={[styles.gradientLayer, styles.gradientLayer1]} />
        <View style={[styles.gradientLayer, styles.gradientLayer2]} />
        <View style={[styles.gradientLayer, styles.gradientLayer3]} />
      </View>

      {/* Formas geométricas flotantes */}
      <View style={styles.shapesContainer}>
        <Animated.View
          style={[
            styles.shape,
            styles.circle,
            {
              top: height * 0.15,
              right: width * 0.1,
              transform: [
                { scale: pulseAnim },
                { translateY: float },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.shape,
            styles.square,
            {
              top: height * 0.6,
              left: width * 0.05,
              transform: [
                { rotate: rotateAnim ? rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '45deg'],
                }) : '0deg' },
                { scale: pulseAnim },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.shape,
            styles.triangle,
            {
              top: height * 0.4,
              right: width * 0.15,
              transform: [
                { scale: pulseAnim },
                { translateY: float },
              ],
            },
          ]}
        />
      </View>

      {/* Elementos decorativos en esquinas */}
      <View style={styles.cornerDecorations}>
        <View style={[styles.cornerElement, styles.topLeft]} />
        <View style={[styles.cornerElement, styles.topRight]} />
        <View style={[styles.cornerElement, styles.bottomLeft]} />
        <View style={[styles.cornerElement, styles.bottomRight]} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // Fondo minimalista
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8fafc',
  },
  gradientLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientLayer1: {
    backgroundColor: 'rgba(99, 102, 241, 0.03)',
  },
  gradientLayer2: {
    backgroundColor: 'rgba(59, 130, 246, 0.02)',
    transform: [{ rotate: '15deg' }],
  },
  gradientLayer3: {
    backgroundColor: 'rgba(34, 197, 94, 0.02)',
    transform: [{ rotate: '-15deg' }],
  },

  // Formas geométricas
  shapesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shape: {
    position: 'absolute',
    opacity: 0.4,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ec4899',
  },
  square: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#22c55e',
  },

  // Decoraciones de esquinas
  cornerDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  cornerElement: {
    position: 'absolute',
    width: 24,
    height: 24,
  },
  topLeft: {
    top: 60,
    left: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#6366f1',
    borderLeftColor: '#6366f1',
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 60,
    right: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopColor: '#3b82f6',
    borderRightColor: '#3b82f6',
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 120,
    left: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomColor: '#22c55e',
    borderLeftColor: '#22c55e',
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 120,
    right: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#ec4899',
    borderRightColor: '#ec4899',
    borderBottomRightRadius: 8,
  },
});

export default BackgroundEffects;