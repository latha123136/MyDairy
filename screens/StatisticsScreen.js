import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIES, MOODS } from '../utils/constants';

export default function StatisticsScreen() {
  const [stats, setStats] = useState({
    totalEntries: 0,
    moodCounts: {},
    categoryCounts: {},
    entriesThisMonth: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await AsyncStorage.getItem('allEntries');
      if (data) {
        const entries = JSON.parse(data);
        
        const moodCounts = {};
        const categoryCounts = {};
        const currentMonth = new Date().getMonth();
        let entriesThisMonth = 0;

        entries.forEach(entry => {
          if (entry.mood) {
            moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
          }
          if (entry.category) {
            categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
          }
          if (new Date(entry.date).getMonth() === currentMonth) {
            entriesThisMonth++;
          }
        });

        setStats({
          totalEntries: entries.length,
          moodCounts,
          categoryCounts,
          entriesThisMonth,
          longestStreak: calculateStreak(entries),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const calculateStreak = (entries) => {
    if (entries.length === 0) return 0;
    
    const dates = entries.map(e => new Date(e.date).toDateString()).sort();
    let streak = 1;
    let maxStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      if (dates[i] !== dates[i - 1]) {
        const diff = Math.abs(new Date(dates[i]) - new Date(dates[i - 1])) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          streak++;
          maxStreak = Math.max(maxStreak, streak);
        } else {
          streak = 1;
        }
      }
    }
    return maxStreak;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistics</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Overview</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Entries:</Text>
          <Text style={styles.statValue}>{stats.totalEntries}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>This Month:</Text>
          <Text style={styles.statValue}>{stats.entriesThisMonth}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Longest Streak:</Text>
          <Text style={styles.statValue}>{stats.longestStreak} days</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>😊 Mood Distribution</Text>
        {Object.keys(stats.moodCounts).length > 0 ? (
          Object.entries(stats.moodCounts).map(([mood, count]) => (
            <View key={mood} style={styles.barContainer}>
              <Text style={styles.barLabel}>{mood}</Text>
              <View style={styles.barBackground}>
                <View 
                  style={[
                    styles.barFill, 
                    { width: `${(count / stats.totalEntries) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.barValue}>{count}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No mood data yet</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📁 Category Distribution</Text>
        {Object.keys(stats.categoryCounts).length > 0 ? (
          Object.entries(stats.categoryCounts).map(([category, count]) => (
            <View key={category} style={styles.barContainer}>
              <Text style={styles.barLabel}>{category}</Text>
              <View style={styles.barBackground}>
                <View 
                  style={[
                    styles.barFill, 
                    { width: `${(count / stats.totalEntries) * 100}%`, backgroundColor: '#27ae60' }
                  ]} 
                />
              </View>
              <Text style={styles.barValue}>{count}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No category data yet</Text>
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  statLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  barContainer: {
    marginBottom: 15,
  },
  barLabel: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
  },
  barBackground: {
    height: 30,
    backgroundColor: '#ecf0f1',
    borderRadius: 15,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 15,
  },
  barValue: {
    position: 'absolute',
    right: 10,
    top: 25,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  emptyText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
