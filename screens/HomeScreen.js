import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Diary</Text>
        <Text style={styles.headerSubtitle}>{new Date().toDateString()}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>{APP_INFO.collegeName}</Text>
        <Text style={styles.teamText}>Team: {APP_INFO.teamMembers.join(', ')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>How are you feeling?</Text>
        <View style={styles.moodContainer}>
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m.label}
              style={[styles.moodButton, mood === m.label && styles.moodButtonActive]}
              onPress={() => setMood(m.label)}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={styles.moodLabel}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.categoryButton, category === c && styles.categoryButtonActive]}
              onPress={() => setCategory(c)}
            >
              <Text style={[styles.categoryText, category === c && styles.categoryTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Write your thoughts...</Text>
        <TextInput
          style={styles.textArea}
          value={entry}
          onChangeText={setEntry}
          placeholder="What happened today?"
          multiline
          numberOfLines={10}
          textAlignVertical="top"
        />

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
            <Text style={styles.iconText}>📷 Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={recording ? stopRecording : startRecording}
          >
            <Text style={styles.iconText}>{recording ? '⏹️ Stop' : '🎤 Voice'}</Text>
          </TouchableOpacity>
        </View>

        {photos.length > 0 && (
          <View style={styles.photoContainer}>
            {photos.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.photo} />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditing ? '✏️ Update Entry' : '💾 Save Entry'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: '#ecf0f1',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  teamText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
    marginTop: 10,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  moodButton: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    minWidth: 80,
  },
  moodButtonActive: {
    backgroundColor: '#3498db',
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#2c3e50',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  categoryButton: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
  },
  categoryButtonActive: {
    backgroundColor: '#3498db',
  },
  categoryText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  categoryTextActive: {
    color: 'white',
  },
  textArea: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-around',
  },
  iconButton: {
    backgroundColor: '#ecf0f1',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    margin: 5,
  },
  iconText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    margin: 5,
  },
  saveButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
