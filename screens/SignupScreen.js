import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const validatePassword = (pwd) => {
    const minLength = pwd.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return minLength && hasUpperCase && hasSpecialChar;
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 8 characters with one uppercase letter and one special symbol'
      );
      return;
    }

    try {
      const user = { name, email, password };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    }
  };

  return (
    <LinearGradient colors={['#f9fafb', '#e0e7ff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your journaling journey today</Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>👤 Name</Text>
              <TextInput
                style={[styles.input, focusedField === 'name' && styles.inputFocused]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#9ca3af"
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>🔒 Password</Text>
              <TextInput
                style={[styles.input, focusedField === 'password' && styles.inputFocused]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <View style={styles.hintBox}>
                <Text style={styles.hint}>• Minimum 8 characters</Text>
                <Text style={styles.hint}>• One uppercase letter</Text>
                <Text style={styles.hint}>• One special symbol</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignup} activeOpacity={0.8}>
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradientButton}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  form: {
    gap: 4,
  },
  inputContainer: {
    marginBottom: 20,
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
  hintBox: {
    backgroundColor: '#f0f4ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  hint: {
    fontSize: 13,
    color: '#6366f1',
    marginVertical: 2,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#6b7280',
  },
  link: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: '700',
  },
});
