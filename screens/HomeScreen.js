import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, Platform, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { getCurrentUser } from '../services/authService';
import { getUserProfile } from '../services/profileService';
import { APP_INFO, CATEGORIES, MOODS } from '../utils/constants';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('');
  const [category, setCategory] = useState('');
  const [photos, setPhotos] = useState([]);
  const [recording, setRecording] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [todayEntry, setTodayEntry] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [allEntries, setAllEntries] = useState([]);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [sound, setSound] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUserId(user.uid);
      loadUserProfile(user.uid);
    }
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  useEffect(() => {
    loadEntryForDate(selectedDate);
    loadAllEntries();
  }, [selectedDate]);

  const getDateKey = (date, userId) => {
    return `entry_${userId}_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}`;
  };

  const loadEntryForDate = async (date) => {
    if (!currentUserId) return;
    try {
      const key = getDateKey(date, currentUserId);
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        setTodayEntry(parsed);
        setEntry(parsed.entry);
        setMood(parsed.mood);
        setCategory(parsed.category);
        setPhotos(parsed.photos || []);
        setVoiceNotes(parsed.voiceNotes || []);
        setIsEditing(true);
      } else {
        setTodayEntry(null);
        setEntry('');
        setMood('');
        setCategory('');
        setPhotos([]);
        setVoiceNotes([]);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadAllEntries = async () => {
    if (!currentUserId) return;
    try {
      const userEntriesKey = `allEntries_${currentUserId}`;
      const data = await AsyncStorage.getItem(userEntriesKey);
      if (data) {
        const entries = JSON.parse(data);
        setAllEntries(entries.sort((a, b) => new Date(b.date) - new Date(a.date)));
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

    if (!currentUserId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      const key = getDateKey(selectedDate, currentUserId);
      const diaryEntry = {
        entry,
        mood,
        category,
        photos,
        voiceNotes,
        date: selectedDate.toISOString(),
        userId: currentUserId,
      };
      
      await AsyncStorage.setItem(key, JSON.stringify(diaryEntry));
      
      const userEntriesKey = `allEntries_${currentUserId}`;
      const allEntriesData = await AsyncStorage.getItem(userEntriesKey) || '[]';
      const entries = JSON.parse(allEntriesData);
      const existingIndex = entries.findIndex(e => e.key === key);
      
      if (existingIndex >= 0) {
        entries[existingIndex] = { key, ...diaryEntry };
      } else {
        entries.push({ key, ...diaryEntry });
      }
      
      await AsyncStorage.setItem(userEntriesKey, JSON.stringify(entries));
      
      Alert.alert('Success', isEditing ? 'Entry updated!' : 'Entry saved!');
      setIsEditing(true);
      setTodayEntry(diaryEntry);
      loadAllEntries();
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry');
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleEditEntry = (entryData) => {
    const dateMatch = entryData.key.match(/entry_[^_]+_(\d+)_(\d+)_(\d+)/);
    if (dateMatch) {
      const [_, year, month, day] = dateMatch;
      const date = new Date(parseInt(year), parseInt(month), parseInt(day));
      setSelectedDate(date);
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
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setVoiceNotes([...voiceNotes, uri]);
    setRecording(null);
    Alert.alert('Success', 'Voice note recorded!');
  };

  const playVoice = async (uri) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      Alert.alert('Error', 'Failed to play voice note');
    }
  };

  const deletePhoto = (index) => {
    Alert.alert('Delete Photo', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => setPhotos(photos.filter((_, i) => i !== index)) }
    ]);
  };

  const deleteVoice = (index) => {
    Alert.alert('Delete Voice Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => setVoiceNotes(voiceNotes.filter((_, i) => i !== index)) }
    ]);
  };

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>📖 MANOPATRA</Text>
          <Text style={styles.headerDate}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={() => {
            console.log('Navigating to Profile...');
            navigation.navigate('Profile');
          }}
          activeOpacity={0.7}
        >
          {userProfile?.photoURL ? (
            <Image source={{ uri: userProfile.photoURL }} style={styles.profileImage} />
          ) : (
            <Text style={styles.profileIcon}>👤</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>"Your Life, Your Story, Your Memories"</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.dateEmoji}>📅</Text>
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
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
                  <View key={index} style={styles.mediaItem}>
                    <TouchableOpacity onPress={() => setSelectedPhoto(uri)}>
                      <Image source={{ uri }} style={styles.photo} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => deletePhoto(index)}>
                      <Text style={styles.deleteBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {voiceNotes.length > 0 && (
            <View style={styles.photoContainer}>
              <Text style={styles.photoTitle}>Voice Notes ({voiceNotes.length})</Text>
              {voiceNotes.map((uri, index) => (
                <View key={index} style={styles.voiceItem}>
                  <TouchableOpacity style={styles.playBtn} onPress={() => playVoice(uri)}>
                    <Text style={styles.playBtnText}>▶️ Play Note {index + 1}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteVoiceBtn} onPress={() => deleteVoice(index)}>
                    <Text style={styles.deleteBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
          <LinearGradient colors={['#10b981', '#059669']} style={styles.gradientButton}>
            <Text style={styles.saveButtonText}>
              {isEditing ? '✏️ Update Entry' : '💾 Submit Entry'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {allEntries.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>📚 Your Diary Entries ({allEntries.length})</Text>
            {allEntries.map((item, index) => (
              <View key={index} style={styles.entryCard}>
                <TouchableOpacity 
                  onPress={() => handleEditEntry(item)}
                  activeOpacity={0.7}
                  style={{ flex: 1 }}
                >
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryDate}>
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                    {item.mood && (
                      <View style={styles.moodBadge}>
                        <Text style={styles.entryMoodEmoji}>
                          {MOODS.find(m => m.label === item.mood)?.emoji || '😊'}
                        </Text>
                        <Text style={styles.entryMoodText}>{item.mood}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.entryText} numberOfLines={2}>
                    {item.entry}
                  </Text>
                  {item.category && (
                    <View style={styles.entryCategoryBadge}>
                      <Text style={styles.entryCategoryText}>{item.category}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEditEntry(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editButtonText}>✏️ Edit</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={!!selectedPhoto} transparent onRequestClose={() => setSelectedPhoto(null)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedPhoto(null)}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedPhoto }} style={styles.fullPhoto} resizeMode="contain" />
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
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
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileIcon: {
    fontSize: 24,
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
  },
  categoryChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
    margin: 4,
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
  },
  iconButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 6,
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
  mediaItem: {
    position: 'relative',
    marginRight: 12,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  deleteBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  voiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  playBtn: {
    flex: 1,
    backgroundColor: '#667eea',
    padding: 10,
    borderRadius: 8,
  },
  playBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteVoiceBtn: {
    marginLeft: 10,
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modalCloseText: {
    fontSize: 24,
    color: '#000',
  },
  fullPhoto: {
    width: '90%',
    height: '80%',
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  dateEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  entryCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 13,
    fontWeight: '700',
    color: '#667eea',
  },
  entryMood: {
    fontSize: 20,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    maxWidth: 120,
  },
  entryMoodEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  entryMoodText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#667eea',
    flexShrink: 0,
  },
  entryText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  entryCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  entryCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#667eea',
  },
  editButton: {
    backgroundColor: '#667eea',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
