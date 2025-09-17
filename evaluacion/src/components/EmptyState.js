import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const EmptyState = ({
  fadeAnim,
  slideAnim,
  rotateAnim,
  title = "Sin elementos",
  subtitle = "No hay contenido disponible en este momento.\nDesliza hacia abajo para actualizar.",
  iconColor = '#6366f1',
  backgroundColor = '#ffffff',
  borderColor = '#e2e8f0'
}) => {
  const bounce = rotateAnim ? rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -8, 0],
  }) : 0;

  return (
    <Animated.View
      style={[
        styles.emptyContainer,
        {
          backgroundColor,
          borderColor,
          opacity: fadeAnim,
          transform: slideAnim ? [{ translateY: slideAnim }] : [],
        },
      ]}
    >
      <View style={styles.emptyContent}>
        <Animated.View
          style={[
            styles.emptyIcon,
            rotateAnim && {
              transform: [{ translateY: bounce }],
            },
          ]}
        >
          <View style={[styles.emptyIconInner, { backgroundColor: iconColor }]} />
          <View style={[styles.emptyIconRing, { borderColor: iconColor }]} />
        </Animated.View>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySubtitle}>{subtitle}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  emptyIconInner: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  emptyIconRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 25,
    borderWidth: 2,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;