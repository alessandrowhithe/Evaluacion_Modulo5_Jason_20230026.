import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const AuthFormWrapper = ({
  children,
  fadeAnim,
  slideAnim,
  backgroundColor = '#ffffff',
  borderColor = '#e2e8f0',
  padding = 32
}) => {
  return (
    <Animated.View
      style={[
        styles.formContainer,
        {
          backgroundColor,
          borderColor,
          padding,
          opacity: fadeAnim,
          transform: slideAnim ? [{ translateY: slideAnim }] : [],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const AuthDivider = ({ 
  dotColor = '#6366f1',
  lineColor = '#e2e8f0'
}) => (
  <View style={styles.dividerContainer}>
    <View style={[styles.dividerLine, { backgroundColor: lineColor }]} />
    <View style={[styles.dividerDot, { backgroundColor: dotColor }]} />
    <View style={[styles.dividerLine, { backgroundColor: lineColor }]} />
  </View>
);

const DecorativeLines = ({ 
  lineColor = '#3b82f6',
  dotColor = '#6366f1'
}) => (
  <View style={styles.decorativeLines}>
    <View style={[styles.line, { backgroundColor: lineColor }]} />
    <View style={[styles.centerDot, { backgroundColor: dotColor }]} />
    <View style={[styles.line, { backgroundColor: lineColor }]} />
  </View>
);

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  
  // Separador
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2e8f0',
    borderRadius: 1,
  },
  dividerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
  },

  // Líneas decorativas
  decorativeLines: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 16,
  },
  line: {
    width: 32,
    height: 3,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  centerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366f1',
  },
});

// Exportar componente principal y subcomponentes
AuthFormWrapper.Divider = AuthDivider;
AuthFormWrapper.DecorativeLines = DecorativeLines;

export default AuthFormWrapper;