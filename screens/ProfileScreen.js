import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { getCurrentUser, logout } from '../services/authService';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '../services/profileService';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    photoURL: '',
    reminderTime: new Date(),
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = getCurrentUser();
      if (user) {
        const data = await getUserProfile(user.uid);
        setProfile({
          name: data.name || user.displayName || '',
          email: data.email || user.email || '',
          bio: data.bio || '',
          photoURL: data.photoURL || user.photoURL || '',
          reminderTime: data.reminderTime ? new Date(data.reminderTime) : new Date(),
          theme: data.theme || 'light'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const user = getCurrentUser();
      if (!user) return;

      await updateUserProfile(user.uid, {
        name: profile.name,
        bio: profile.bio,
        reminderTime: profile.reminderTime.toISOString(),
        theme: profile.theme
      });

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUploading(true);
      try {
        const user = getCurrentUser();
        const photoURL = await uploadProfileImage(user.uid, result.assets[0].uri);
        setProfile({ ...profile, photoURL });
        Alert.alert('Success', 'Profile picture updated!');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel' 
        },
        { 
          text: 'Logout', 
          onPress: async () => {
            try {
              await logout();
              // Navigation will be handled by App.js onAuthChange
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setProfile({ ...profile, reminderTime: time });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </LinearGradient>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageSection}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <View style={styles.imageContainer}>
              {profile.photoURL ? (
                <Image source={{ uri: profile.photoURL }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>
                    {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
                  </Text>
                </View>
              )}
              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>📷</Text>
              </View>
            </View>
          </TouchableOpacity>
          {uploading && <Text style={styles.uploadingText}>Uploading...</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            placeholder="Enter your name"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={profile.email}
            editable={false}
            placeholderTextColor="#9ca3af"
          />
          <Text style={styles.helperText}>Email cannot be changed</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={profile.bio}
            onChangeText={(text) => setProfile({ ...profile, bio: text })}
            placeholder="Tell us about yourself..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Daily Reminder Time</Text>
          <TouchableOpacity 
            style={styles.timeButton} 
            onPress={() => setShowTimePicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.timeEmoji}>⏰</Text>
            <Text style={styles.timeText}>
              {profile.reminderTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={profile.reminderTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Theme Preference</Text>
          <View style={styles.themeContainer}>
            <TouchableOpacity
              style={[styles.themeButton, profile.theme === 'light' && styles.themeButtonActive]}
              onPress={() => setProfile({ ...profile, theme: 'light' })}
              activeOpacity={0.7}
            >
              <Text style={styles.themeEmoji}>☀️</Text>
              <Text style={[styles.themeText, profile.theme === 'light' && styles.themeTextActive]}>
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeButton, profile.theme === 'dark' && styles.themeButtonActive]}
              onPress={() => setProfile({ ...profile, theme: 'dark' })}
              activeOpacity={0.7}
            >
              <Text style={styles.themeEmoji}>🌙</Text>
              <Text style={[styles.themeText, profile.theme === 'dark' && styles.themeTextActive]}>
                Dark
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
          <LinearGradient colors={['#10b981', '#059669']} style={styles.gradientButton}>
            <Text style={styles.saveButtonText}>💾 Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.gradientButton}>
            <Text style={styles.saveButtonText}>🚪 Logout</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  backButton: {
    marginBottom: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#6b7280',
  },
  profileImageSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  placeholderText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '700',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editBadgeText: {
    fontSize: 18,
  },
  uploadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
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
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  timeEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  themeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeButtonActive: {
    backgroundColor: '#e0e7ff',
    borderColor: '#667eea',
  },
  themeEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  themeTextActive: {
    color: '#667eea',
  },
  saveButton: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
