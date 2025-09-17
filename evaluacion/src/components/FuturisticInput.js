import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const FuturisticInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  focused, 
  onFocus, 
  onBlur, 
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength,
  multiline = false,
  editable = true,
  helpText = null,
  required = false,
  error = null
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>
      {label}
      {required && <Text style={styles.required}>*</Text>}
    </Text>
    <View style={[
      styles.inputContainer,
      focused && styles.inputContainerFocused,
      !editable && styles.inputContainerDisabled,
      error && styles.inputContainerError,
    ]}>
      <TextInput
        style={[
          styles.input, 
          multiline && styles.inputMultiline,
          !editable && styles.inputDisabled
        ]}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
        editable={editable}
      />
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
    {helpText && !error && <Text style={styles.helpText}>{helpText}</Text>}
  </View>
);

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
    marginLeft: 2,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: '#6366f1',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  inputContainerDisabled: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    shadowOpacity: 0,
  },
  inputContainerError: {
    borderColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    color: '#9ca3af',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 6,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
    fontWeight: '500',
  },
});

export default FuturisticInput;