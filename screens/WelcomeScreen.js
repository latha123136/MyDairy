import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { APP_INFO } from '../utils/constants';

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.emoji}>📔</Text>
        <Text style={styles.title}>{APP_INFO.appName}</Text>
        <Text style={styles.subtitle}>Your personal space for thoughts and memories</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.infoSection}>
          <Text style={styles.college}>{APP_INFO.collegeName}</Text>
          <View style={styles.divider} />
          <Text style={styles.teamTitle}>Created by</Text>
          <View style={styles.teamGrid}>
            {APP_INFO.teamMembers.map((member, index) => (
              <View key={index} style={styles.teamBadge}>
                <Text style={styles.teamMember}>{member}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('Signup')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonTextSecondary}>Sign Up</Text>
        </TouchableOpacity>
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
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  infoSection: {
    marginBottom: 32,
  },
  college: {
    fontSize: 18,
    fontWeight: '700',
    color: '#667eea',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e7ff',
    marginBottom: 16,
  },
  teamTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  teamBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  teamMember: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  buttonPrimary: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
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
  buttonSecondary: {
    backgroundColor: '#f9fafb',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  buttonTextSecondary: {
    color: '#667eea',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
