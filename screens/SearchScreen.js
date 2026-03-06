import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { CATEGORIES } from '../utils/constants';
import { getEntries, searchEntries } from '../utils/api';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [allEntries, setAllEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchMode, setSearchMode] = useState('text'); // text, date, month, category
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [searchQuery, allEntries, searchMode, selectedCategory, selectedDate]);

  const loadEntries = async () => {
    try {
      const entries = await getEntries();
      setAllEntries(entries);
      setFilteredEntries(entries);
    } catch (error) {
      console.error(error);
    }
  };

  const filterEntries = async () => {
    let filtered = [...allEntries];

    if (searchMode === 'text' && searchQuery.trim()) {
      try {
        filtered = await searchEntries(searchQuery);
      } catch (error) {
        console.error(error);
      }
    } else if (searchMode === 'date') {
      const dateStr = selectedDate.toDateString();
      filtered = filtered.filter(entry => 
        new Date(entry.date).toDateString() === dateStr
      );
    } else if (searchMode === 'month') {
      const month = selectedDate.getMonth();
      const year = selectedDate.getFullYear();
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === month && entryDate.getFullYear() === year;
      });
    } else if (searchMode === 'category' && selectedCategory) {
      filtered = filtered.filter(entry => entry.category === selectedCategory);
    }

    setFilteredEntries(filtered);
  };

  const renderEntry = ({ item }) => (
    <TouchableOpacity 
      style={styles.entryCard}
      onPress={() => navigation.navigate('EntryDetail', { entry: item })}
    >
      <View style={styles.entryHeader}>
        <Text style={styles.entryDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        {item.mood && <Text style={styles.entryMood}>{item.mood}</Text>}
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

  const renderDateSelector = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    return (
      <View style={styles.dateSelector}>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setSelectedDate(new Date(currentYear, currentMonth - 1, 1))}
        >
          <Text style={styles.dateButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {searchMode === 'date' 
            ? selectedDate.toDateString()
            : `${months[currentMonth]} ${currentYear}`
          }
        </Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setSelectedDate(new Date(currentYear, currentMonth + 1, 1))}
        >
          <Text style={styles.dateButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Diary</Text>
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
          style={[styles.modeButton, searchMode === 'month' && styles.modeButtonActive]}
          onPress={() => setSearchMode('month')}
        >
          <Text style={[styles.modeText, searchMode === 'month' && styles.modeTextActive]}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeButton, searchMode === 'category' && styles.modeButtonActive]}
          onPress={() => setSearchMode('category')}
        >
          <Text style={[styles.modeText, searchMode === 'category' && styles.modeTextActive]}>Category</Text>
        </TouchableOpacity>
      </View>

      {searchMode === 'text' && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by text, category, or mood..."
            placeholderTextColor="#999"
          />
        </View>
      )}

      {(searchMode === 'date' || searchMode === 'month') && renderDateSelector()}

      {searchMode === 'category' && (
        <View style={styles.categoryFilterContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryFilterButton, selectedCategory === cat && styles.categoryFilterButtonActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryFilterText, selectedCategory === cat && styles.categoryFilterTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={filteredEntries}
        renderItem={renderEntry}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory ? 'No entries found' : 'No diary entries yet'}
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
  searchModeContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modeButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#3498db',
  },
  modeText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  modeTextActive: {
    color: 'white',
  },
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  dateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  categoryFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: 'white',
  },
  categoryFilterButton: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
  },
  categoryFilterButtonActive: {
    backgroundColor: '#3498db',
  },
  categoryFilterText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  categoryFilterTextActive: {
    color: 'white',
  },
  listContainer: {
    padding: 15,
  },
  entryCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  entryDate: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  entryMood: {
    fontSize: 16,
  },
  categoryBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  entryText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
});
