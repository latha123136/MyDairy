import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MemoryTimelineScreen({ navigation }) {
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const data = await AsyncStorage.getItem('allEntries');
      if (data) {
        const entries = JSON.parse(data);
        const today = new Date();
        
        const timelineMemories = entries
          .map(entry => {
            const entryDate = new Date(entry.date);
            const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
            
            let timeLabel = '';
            if (daysDiff === 0) timeLabel = 'Today';
            else if (daysDiff === 1) timeLabel = '1 day ago';
            else if (daysDiff < 7) timeLabel = `${daysDiff} days ago`;
            else if (daysDiff < 30) timeLabel = `${Math.floor(daysDiff / 7)} weeks ago`;
            else if (daysDiff < 365) timeLabel = `${Math.floor(daysDiff / 30)} months ago`;
            else timeLabel = `${Math.floor(daysDiff / 365)} year${Math.floor(daysDiff / 365) > 1 ? 's' : ''} ago`;
            
            return {
              ...entry,
              timeLabel,
              daysDiff,
              isAnniversary: daysDiff >= 365 && daysDiff % 365 < 7
            };
          })
          .filter(m => m.daysDiff > 0)
          .sort((a, b) => b.daysDiff - a.daysDiff);

        setMemories(timelineMemories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderMemory = (memory) => (
    <TouchableOpacity 
      key={memory.key}
      style={[styles.memoryCard, memory.isAnniversary && styles.anniversaryCard]}
      onPress={() => navigation.navigate('EntryDetail', { entry: memory })}
    >
      {memory.isAnniversary && (
        <View style={styles.anniversaryBadge}>
          <Text style={styles.anniversaryText}>🎉 Anniversary Memory</Text>
        </View>
      )}
      <View style={styles.memoryHeader}>
        <Text style={styles.timeLabel}>{memory.timeLabel}</Text>
        {memory.mood && <Text style={styles.moodEmoji}>{memory.mood}</Text>}
      </View>
      <Text style={styles.memoryDate}>
        {new Date(memory.date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </Text>
      {memory.category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{memory.category}</Text>
        </View>
      )}
      <Text style={styles.memoryText} numberOfLines={4}>
        {memory.entry}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Memory Timeline</Text>
        <Text style={styles.headerSubtitle}>Your journey through time</Text>
      </View>

      <View style={styles.timelineContainer}>
        {memories.length > 0 ? (
          memories.map(renderMemory)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📔</Text>
            <Text style={styles.emptyTitle}>No Memories Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start writing diary entries to build your memory timeline
            </Text>
          </View>
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
  timelineContainer: {
    padding: 15,
  },
  memoryCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  anniversaryCard: {
    borderLeftColor: '#f39c12',
    backgroundColor: '#fffbf0',
  },
  anniversaryBadge: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  anniversaryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  memoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  moodEmoji: {
    fontSize: 24,
  },
  memoryDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '600',
  },
  memoryText: {
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 22,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});
