import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIES, MOODS } from '../utils/constants';

export default function EntryDetailScreen({ route, navigation }) {
  const { entry } = route.params;
  const [editedEntry, setEditedEntry] = useState(entry.entry);
  const [mood, setMood] = useState(entry.mood);
  const [category, setCategory] = useState(entry.category);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async () => {
    try {
      const updatedEntry = {
        ...entry,
        entry: editedEntry,
        mood,
        category,
      };

      await AsyncStorage.setItem(entry.key, JSON.stringify(updatedEntry));

      const allEntries = await AsyncStorage.getItem('allEntries');
      const entries = JSON.parse(allEntries);
      const index = entries.findIndex(e => e.key === entry.key);
      if (index >= 0) {
        entries[index] = updatedEntry;
        await AsyncStorage.setItem('allEntries', JSON.stringify(entries));
      }

      Alert.alert('Success', 'Entry updated!');
      setIsEditing(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update entry');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diary Entry</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editButton}>{isEditing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.date}>{new Date(entry.date).toDateString()}</Text>

        {isEditing ? (
          <>
            <Text style={styles.label}>Mood</Text>
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

            <Text style={styles.label}>Entry</Text>
            <TextInput
              style={styles.textArea}
              value={editedEntry}
              onChangeText={setEditedEntry}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {mood && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mood:</Text>
                <Text style={styles.infoValue}>{mood}</Text>
              </View>
            )}
            {category && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Category:</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{category}</Text>
                </View>
              </View>
            )}
            <Text style={styles.entryText}>{entry.entry}</Text>

            {entry.photos && entry.photos.length > 0 && (
              <View style={styles.photoContainer}>
                {entry.photos.map((uri, index) => (
                  <Image key={index} source={{ uri }} style={styles.photo} />
                ))}
              </View>
            )}
          </>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginRight: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
  },
  categoryBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  entryText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
    marginTop: 10,
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
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  photo: {
    width: 100,
    height: 100,
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
