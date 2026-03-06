import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    Alert.alert('Success', 'Password reset link sent to your email.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') }
    ]);
  };

  return (
    <LinearGradient colors={['#f9fafb', '#e0e7ff']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🔐</Text>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send you a reset link
          </Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>📧 Email</Text>
            <TextInput
              style={[styles.input, focusedField === 'email' && styles.inputFocused]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleResetPassword} activeOpacity={0.8}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradientButton}>
              <Text style={styles.buttonText}>Send Reset Link</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>← Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    gap: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    color: '#1f2937',
  },
  inputFocused: {
    borderColor: '#667eea',
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
  },
  link: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: '700',
  },
});
