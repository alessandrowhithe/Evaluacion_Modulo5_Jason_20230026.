import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const StatsPanel = ({
  fadeAnim,
  slideAnim,
  title = "Estadísticas del Sistema",
  stats = [],
  dotColor = "#6366f1",
  titleColor = "#1f2937",
  backgroundColor = '#ffffff',
  borderColor = '#e2e8f0'
}) => {
  return (
    <Animated.View
      style={[
        styles.statsPanel,
        {
          backgroundColor,
          borderColor,
          opacity: fadeAnim,
          transform: slideAnim ? [{ translateY: slideAnim }] : [],
        },
      ]}
    >
      <View style={styles.statsPanelHeader}>
        <View style={[styles.statsDot, { backgroundColor: dotColor }]} />
        <Text style={[styles.statsPanelTitle, { color: titleColor }]}>{title}</Text>
      </View>
      
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            number={stat.number}
            label={stat.label}
            color={stat.color || dotColor}
            backgroundColor={stat.backgroundColor || `${stat.color || dotColor}15`}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const StatItem = ({ number, label, color = "#6366f1", backgroundColor = "#6366f115" }) => (
  <View style={[styles.statItem, { backgroundColor }]}>
    <Text style={[styles.statNumber, { color }]}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  statsPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  statsPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  statsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
    marginRight: 12,
  },
  statsPanelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default StatsPanel;