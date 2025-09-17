import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const AnimatedLogo = ({
  size = 120,
  rotateAnim,
  scaleAnim,
  fadeAnim,
  innerColor = '#6366f1',
  iconColor = '#ffffff',
  ring1Color = '#3b82f6',
  ring2Color = '#22c55e',
  backgroundColor = '#f8fafc',
  showRings = true,
  iconElement = null
}) => {
  const bounce = rotateAnim ? rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -10, 0],
  }) : 0;

  const logoSize = size;
  const innerSize = size * 0.6;
  const iconSize = size * 0.25;
  const ring1Size = logoSize * 1.2;
  const ring2Size = logoSize * 1.4;

  return (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          transform: [
            ...(scaleAnim ? [{ scale: scaleAnim }] : []),
            ...(rotateAnim ? [{ translateY: bounce }] : []),
          ],
          opacity: fadeAnim || 1,
        },
      ]}
    >
      <View style={[
        styles.logoSquare, 
        { 
          width: logoSize, 
          height: logoSize, 
          backgroundColor 
        }
      ]}>
        <View style={[
          styles.logoInner, 
          { 
            width: innerSize, 
            height: innerSize, 
            backgroundColor: innerColor 
          }
        ]}>
          {iconElement ? iconElement : (
            <View style={[
              styles.logoIcon, 
              { 
                width: iconSize, 
                height: iconSize, 
                backgroundColor: iconColor 
              }
            ]} />
          )}
        </View>
        
        {showRings && (
          <>
            <View style={[
              styles.logoRing, 
              { 
                width: ring1Size, 
                height: ring1Size, 
                borderColor: ring1Color 
              }
            ]} />
            <View style={[
              styles.logoRing2, 
              { 
                width: ring2Size, 
                height: ring2Size, 
                borderColor: ring2Color 
              }
            ]} />
          </>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSquare: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoInner: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  logoIcon: {
    borderRadius: 8,
  },
  logoRing: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 20,
    borderStyle: 'solid',
    opacity: 0.3,
  },
  logoRing2: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 24,
    borderStyle: 'dashed',
    opacity: 0.2,
  },
});

export default AnimatedLogo;