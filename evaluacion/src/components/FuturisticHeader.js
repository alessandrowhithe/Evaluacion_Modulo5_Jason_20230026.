import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const FuturisticHeader = ({ 
  fadeAnim, 
  slideAnim, 
  pulseAnim, 
  title = "Nexus",
  subtitle = "Sistema de Gestión",
  statusText = "En línea",
  statusColor = "#22c55e",
  titleColor = "#1f2937",
  logoElement = null,
  userName = null
}) => (
  <Animated.View
    style={[
      styles.headerContainer,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      },
    ]}
  >
    <Animated.View
      style={[
        styles.logoContainer,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <View style={styles.logoSquare}>
        <View style={[styles.logoInner, { backgroundColor: '#6366f1' }]}>
          {logoElement ? logoElement : (
            userName ? (
              <Text style={styles.logoText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            ) : (
              <View style={[styles.logoIcon, { backgroundColor: '#ffffff' }]} />
            )
          )}
        </View>
        <View style={[styles.logoRing, { borderColor: '#3b82f6' }]} />
        <View style={[styles.logoRing2, { borderColor: '#22c55e' }]} />
      </View>
    </Animated.View>
    
    <Text style={[styles.titleText, { color: titleColor }]}>
      {title}
    </Text>
    <Text style={styles.subtitleText}>{subtitle}</Text>
    
    <View style={styles.statusIndicator}>
      <Animated.View
        style={[
          styles.statusDot,
          {
            backgroundColor: statusColor,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
    </View>
  </Animated.View>
);

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoSquare: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoInner: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 6,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  logoRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3b82f6',
    opacity: 0.3,
  },
  logoRing2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#22c55e',
    borderStyle: 'dashed',
    opacity: 0.2,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default FuturisticHeader;