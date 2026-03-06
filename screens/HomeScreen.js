import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { APP_INFO, CATEGORIES, MOODS } from '../utils/constants';

export default function HomeScreen() {
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('');
  const [category, setCategory] = useState('');
  const [photos, setPhotos] = useState([]);
  const [recording, setRecording] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [todayEntry, setTodayEntry] = useState(null);

  useEffect(() => {
    loadTodayEntry();
  }, []);

  const getTodayKey = () => {
    const today = new Date();
    return `entry_${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;
  };

  const loadTodayEntry = async () => {
    try {
      const key = getTodayKey();
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        setTodayEntry(parsed);
        setEntry(parsed.entry);
        setMood(parsed.mood);
        setCategory(parsed.category);
        setPhotos(parsed.photos || []);
        setIsEditing(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!entry.trim()) {
      Alert.alert('Error', 'Please write something in your diary');
      return;
    }

    try {
      const key = getTodayKey();
      const diaryEntry = {
        entry,
        mood,
        category,
        photos,
        date: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(key, JSON.stringify(diaryEntry));
      
      const allEntries = await AsyncStorage.getItem('allEntries') || '[]';
      const entries = JSON.parse(allEntries);
      const existingIndex = entries.findIndex(e => e.key === key);
      
      if (existingIndex >= 0) {
        entries[existingIndex] = { key, ...diaryEntry };
      } else {
        entries.push({ key, ...diaryEntry });
      }
      
      await AsyncStorage.setItem('allEntries', JSON.stringify(entries));
      
      Alert.alert('Success', isEditing ? 'Entry updated!' : 'Entry saved!');
      setIsEditing(true);
      setTodayEntry(diaryEntry);
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, ...result.assets.map(a => a.uri)]);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    setRecording(null);
    await recording.stopAndUnloadAsync();
    Alert.alert('Success', 'Voice note recorded!');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.headerTitle}>📖 MANOPATRA</Text>
        <Text style={styles.headerDate}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>"Your Life, Your Story, Your Memories"</Text>
          {/* <Text style={styles.infoTeam}>{APP_INFO.teamMembers.join(' • ')}</Text> */}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.label}
                style={[styles.moodButton, mood === m.label && styles.moodButtonActive]}
                onPress={() => setMood(m.label)}
                activeOpacity={0.7}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, mood === m.label && styles.moodLabelActive]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.categoryChip, category === c && styles.categoryChipActive]}
                onPress={() => setCategory(c)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryText, category === c && styles.categoryTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Write your thoughts...</Text>
          <TextInput
            style={styles.textArea}
            value={entry}
            onChangeText={setEntry}
            placeholder="What's on your mind today?"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={12}
            textAlignVertical="top"
          />

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.iconButton} onPress={pickImage} activeOpacity={0.7}>
              <Text style={styles.iconEmoji}>📷</Text>
              <Text style={styles.iconLabel}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.iconButton, recording && styles.iconButtonActive]} 
              onPress={recording ? stopRecording : startRecording}
              activeOpacity={0.7}
            >
              <Text style={styles.iconEmoji}>{recording ? '⏹️' : '🎤'}</Text>
              <Text style={styles.iconLabel}>{recording ? 'Stop' : 'Voice'}</Text>
            </TouchableOpacity>
          </View>

          {photos.length > 0 && (
            <View style={styles.photoContainer}>
              <Text style={styles.photoTitle}>Attached Photos ({photos.length})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {photos.map((uri, index) => (
                  <Image key={index} source={{ uri }} style={styles.photo} />
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
          <LinearGradient colors={['#10b981', '#059669']} style={styles.gradientButton}>
            <Text style={styles.saveButtonText}>
              {isEditing ? '✏️ Update Entry' : '💾 Save Entry'}
            </Text>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  infoTeam: {
    fontSize: 12,
    color: '#6b7280',
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  moodScroll: {
    marginHorizontal: -4,
  },
  moodButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    minWidth: 80,
  },
  moodButtonActive: {
    backgroundColor: '#e0e7ff',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  moodLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  moodLabelActive: {
    color: '#667eea',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: '#e0e7ff',
    borderColor: '#667eea',
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#667eea',
  },
  textArea: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 200,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    color: '#1f2937',
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  iconButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  iconButtonActive: {
    backgroundColor: '#fee2e2',
  },
  iconEmoji: {
    fontSize: 20,
  },
  iconLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  photoContainer: {
    marginTop: 16,
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
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
});
