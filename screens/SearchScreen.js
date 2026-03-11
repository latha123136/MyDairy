import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCurrentUser } from '../services/authService';
import { CATEGORIES, MOODS } from '../utils/constants';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [allEntries, setAllEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchMode, setSearchMode] = useState('text');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUserId(user.uid);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [currentUserId]);

  const handleSearch = () => {
    filterEntries();
  };

  const loadEntries = async () => {
    if (!currentUserId) return;
    try {
      const userEntriesKey = `allEntries_${currentUserId}`;
      const data = await AsyncStorage.getItem(userEntriesKey);
      if (data) {
        const entries = JSON.parse(data);
        setAllEntries(entries);
        setFilteredEntries(entries);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filterEntries = () => {
    let filtered = [...allEntries];

    if (searchMode === 'text' && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.entry.toLowerCase().includes(query) ||
        entry.category?.toLowerCase().includes(query) ||
        entry.mood?.toLowerCase().includes(query)
      );
    } else if (searchMode === 'date') {
      const dateStr = selectedDate.toDateString();
      filtered = filtered.filter(entry => 
        new Date(entry.date).toDateString() === dateStr
      );
    } else if (searchMode === 'category' && selectedMood) {
      filtered = filtered.filter(entry => entry.mood === selectedMood);
    }

    setFilteredEntries(filtered);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const renderEntry = ({ item }) => (
    <TouchableOpacity 
      style={styles.entryCard}
      onPress={() => navigation.navigate('EntryDetail', { entry: item })}
    >
      <View style={styles.entryHeader}>
        <Text style={styles.entryDate}>
          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>
        {item.mood && (
          <Text style={styles.entryMood}>
            {MOODS.find(m => m.label === item.mood)?.emoji || '😊'}
          </Text>
        )}
      </View>
      {item.category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      )}
      <Text style={styles.entryText} numberOfLines={3}>
        {item.entry}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔍 Search Diary</Text>
      </View>

      <View style={styles.searchModeContainer}>
        <TouchableOpacity 
          style={[styles.modeButton, searchMode === 'text' && styles.modeButtonActive]}
          onPress={() => setSearchMode('text')}
        >
          <Text style={[styles.modeText, searchMode === 'text' && styles.modeTextActive]}>Text</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeButton, searchMode === 'date' && styles.modeButtonActive]}
          onPress={() => setSearchMode('date')}
        >
          <Text style={[styles.modeText, searchMode === 'date' && styles.modeTextActive]}>Date</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeButton, searchMode === 'category' && styles.modeButtonActive]}
          onPress={() => setSearchMode('category')}
        >
          <Text style={[styles.modeText, searchMode === 'category' && styles.modeTextActive]}>Moment</Text>
        </TouchableOpacity>
      </View>

      {searchMode === 'text' && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text.trim()) {
                const query = text.toLowerCase();
                const filtered = allEntries.filter(entry => 
                  entry.entry.toLowerCase().includes(query) ||
                  entry.category?.toLowerCase().includes(query) ||
                  entry.mood?.toLowerCase().includes(query)
                );
                setFilteredEntries(filtered);
              } else {
                setFilteredEntries(allEntries);
              }
            }}
            placeholder="Search by text, category, or mood..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>🔍 Search</Text>
          </TouchableOpacity>
        </View>
      )}

      {searchMode === 'date' && (
        <View style={styles.datePickerContainer}>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateEmoji}>📅</Text>
            <Text style={styles.datePickerText}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>🔍 Search</Text>
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
      )}

      {searchMode === 'category' && (
        <View style={styles.moodFilterContainer}>
          <Text style={styles.filterTitle}>Select Moment:</Text>
          <View style={styles.moodGrid}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.label}
                style={[styles.moodFilterButton, selectedMood === mood.label && styles.moodFilterButtonActive]}
                onPress={() => setSelectedMood(mood.label)}
              >
                <Text style={styles.moodFilterEmoji}>{mood.emoji}</Text>
                <Text style={[styles.moodFilterText, selectedMood === mood.label && styles.moodFilterTextActive]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>🔍 Search</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredEntries}
        renderItem={renderEntry}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedMood ? 'No entries found' : 'No diary entries yet'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  searchModeContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modeButton: {
    flex: 1,
    padding: 12,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#667eea',
  },
  modeText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  modeTextActive: {
    color: 'white',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
  },
  searchInput: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#667eea',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  datePickerContainer: {
    padding: 15,
    backgroundColor: 'white',
  },
  datePickerButton: {
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
  datePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  moodFilterContainer: {
    padding: 15,
    backgroundColor: 'white',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moodFilterButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    minWidth: 100,
    margin: 5,
  },
  moodFilterButtonActive: {
    backgroundColor: '#e0e7ff',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  moodFilterEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodFilterText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  moodFilterTextActive: {
    color: '#667eea',
  },
  listContainer: {
    padding: 15,
  },
  entryCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  entryDate: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '700',
  },
  entryMood: {
    fontSize: 20,
  },
  categoryBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryBadgeText: {
    color: '#667eea',
    fontSize: 11,
    fontWeight: '600',
  },
  entryText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
});
