import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const LoadingScreen = ({ 
  pulseAnim, 
  text = "Cargando...",
  iconColor = "#6366f1",
  backgroundColor = "#f8fafc"
}) => (
  <View style={[styles.loadingContainer, { backgroundColor }]}>
    <Animated.View
      style={[
        styles.loadingContent,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <View style={styles.loadingIconContainer}>
        <View style={[styles.loadingIcon, { backgroundColor: iconColor }]} />
        <View style={[styles.loadingRing, { borderColor: iconColor }]} />
      </View>
      <Text style={styles.loadingText}>{text}</Text>
    </Animated.View>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  loadingIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#6366f1',
  },
  loadingRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#6366f1',
    opacity: 0.3,
  },
  loadingText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

export default LoadingScreen;