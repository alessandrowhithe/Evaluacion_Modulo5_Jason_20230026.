import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoPanel = ({ 
  title = "Información", 
  children, 
  dotColor = "#6366f1",
  backgroundColor = "#ffffff",
  borderColor = "#e2e8f0",
  titleColor = "#1f2937"
}) => (
  <View style={[styles.infoPanel, { 
    backgroundColor, 
    borderColor 
  }]}>
    <View style={styles.infoPanelHeader}>
      <View style={[styles.infoDot, { backgroundColor: dotColor }]} />
      <Text style={[styles.infoPanelTitle, { color: titleColor }]}>{title}</Text>
    </View>
    {children}
  </View>
);

const InfoText = ({ children, color = "#6b7280" }) => (
  <Text style={[styles.infoText, { color }]}>{children}</Text>
);

const InfoRow = ({ label, value, labelColor = "#374151", valueColor = "#6b7280" }) => (
  <View style={styles.infoRow}>
    <Text style={[styles.infoLabel, { color: labelColor }]}>{label}</Text>
    <Text style={[styles.infoValue, { color: valueColor }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  infoPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366f1',
    marginRight: 10,
  },
  infoPanelTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '400',
    marginBottom: 8,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
});

// Exportar tanto el componente principal como los subcomponentes
InfoPanel.Text = InfoText;
InfoPanel.Row = InfoRow;

export default InfoPanel;