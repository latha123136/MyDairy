import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOODS } from '../utils/constants';

const screenWidth = Dimensions.get('window').width;

export default function MoodTrackerScreen() {
  const [moodStats, setMoodStats] = useState({});
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    loadMoodStats();
  }, []);

  const loadMoodStats = async () => {
    try {
      const data = await AsyncStorage.getItem('allEntries');
      if (data) {
        const entries = JSON.parse(data);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthEntries = entries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        });

        const stats = {};
        MOODS.forEach(mood => {
          stats[mood.label] = monthEntries.filter(e => e.mood === mood.label).length;
        });

        setMoodStats(stats);
        setTotalEntries(monthEntries.length);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBarWidth = (count) => {
    if (totalEntries === 0) return 0;
    return (count / totalEntries) * 100;
  };

  const getMoodColor = (label) => {
    const colors = {
      'Happy': '#27ae60',
      'Sad': '#3498db',
      'Excited': '#f39c12',
      'Angry': '#e74c3c',
      'Relaxed': '#9b59b6'
    };
    return colors[label] || '#95a5a6';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mood Tracker</Text>
        <Text style={styles.headerSubtitle}>
          {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 This Month's Mood Statistics</Text>
        <Text style={styles.totalText}>Total Entries: {totalEntries}</Text>

        <View style={styles.chartContainer}>
          {MOODS.map((mood) => {
            const count = moodStats[mood.label] || 0;
            const percentage = totalEntries > 0 ? ((count / totalEntries) * 100).toFixed(1) : 0;

            return (
              <View key={mood.label} style={styles.barContainer}>
                <View style={styles.barLabelContainer}>
                  <Text style={styles.barEmoji}>{mood.emoji}</Text>
                  <Text style={styles.barLabel}>{mood.label}</Text>
                </View>
                <View style={styles.barWrapper}>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.barFill, 
                        { 
                          width: `${getBarWidth(count)}%`,
                          backgroundColor: getMoodColor(mood.label)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barValue}>{count} ({percentage}%)</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 Mood Insights</Text>
        {totalEntries > 0 ? (
          <>
            <Text style={styles.insightText}>
              • Most common mood: {Object.keys(moodStats).reduce((a, b) => 
                moodStats[a] > moodStats[b] ? a : b, 'None')}
            </Text>
            <Text style={styles.insightText}>
              • You've tracked your mood {totalEntries} times this month
            </Text>
            <Text style={styles.insightText}>
              • Keep tracking to see patterns in your emotional well-being
            </Text>
          </>
        ) : (
          <Text style={styles.insightText}>
            Start tracking your moods to see insights here!
          </Text>
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
    marginBottom: 15,
  },
  totalText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    fontWeight: '600',
  },
  chartContainer: {
    marginTop: 10,
  },
  barContainer: {
    marginBottom: 20,
  },
  barLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  barEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  barLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barBackground: {
    flex: 1,
    height: 30,
    backgroundColor: '#ecf0f1',
    borderRadius: 15,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 15,
  },
  barValue: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    minWidth: 70,
  },
  insightText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
    lineHeight: 22,
  },
});
