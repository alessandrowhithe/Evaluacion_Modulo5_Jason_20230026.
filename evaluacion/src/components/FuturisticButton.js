import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const FuturisticButton = ({
  onPress,
  title,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'outline'
  disabled = false,
  loading = false,
  flex = 1,
  activeOpacity = 0.8,
  icon = null,
  style = {}
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#6366f1',
          shadowColor: '#6366f1',
          textColor: '#ffffff',
        };
      case 'secondary':
        return {
          backgroundColor: '#3b82f6',
          shadowColor: '#3b82f6',
          textColor: '#ffffff',
        };
      case 'success':
        return {
          backgroundColor: '#22c55e',
          shadowColor: '#22c55e',
          textColor: '#ffffff',
        };
      case 'danger':
        return {
          backgroundColor: '#ef4444',
          shadowColor: '#ef4444',
          textColor: '#ffffff',
        };
      case 'outline':
        return {
          backgroundColor: '#ffffff',
          shadowColor: '#000000',
          textColor: '#475569',
          borderColor: '#e2e8f0',
        };
      default:
        return {
          backgroundColor: '#6366f1',
          shadowColor: '#6366f1',
          textColor: '#ffffff',
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { flex }, 
        disabled && styles.buttonDisabled, 
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
    >
      <View style={[
        styles.buttonContent,
        { 
          backgroundColor: buttonStyles.backgroundColor,
          shadowColor: buttonStyles.shadowColor,
          ...(variant === 'outline' && {
            borderWidth: 2,
            borderColor: buttonStyles.borderColor
          })
        }
      ]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[
          styles.buttonText, 
          { color: buttonStyles.textColor }
        ]}>
          {loading ? 'Cargando...' : title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'relative',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  iconContainer: {
    marginRight: 8,
  },
});

export default FuturisticButton;