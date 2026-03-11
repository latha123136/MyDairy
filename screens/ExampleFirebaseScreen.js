import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import { signUp, login, logout, getCurrentUser } from '../services/authService';
import { createDiaryEntry, getDiaryEntries, updateDiaryEntry, deleteDiaryEntry } from '../services/diaryService';

export default function ExampleFirebaseScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [entryText, setEntryText] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadEntries(currentUser.uid);
    }
  }, []);

  const handleSignUp = async () => {
    const result = await signUp(email, password);
    if (result.success) {
      setUser(result.user);
      Alert.alert('Success', 'Account created!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      setUser(result.user);
      loadEntries(result.user.uid);
      Alert.alert('Success', 'Logged in!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setUser(null);
      setEntries([]);
      Alert.alert('Success', 'Logged out!');
    }
  };

  const loadEntries = async (userId) => {
    const result = await getDiaryEntries(userId);
    if (result.success) {
      setEntries(result.entries);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleCreateEntry = async () => {
    if (!entryText.trim()) return;
    const result = await createDiaryEntry(user.uid, {
      entry: entryText,
      mood: 'Happy',
      category: 'Personal',
      photos: [],
      voiceNotes: [],
      date: new Date().toISOString()
    });
    if (result.success) {
      setEntryText('');
      loadEntries(user.uid);
      Alert.alert('Success', 'Entry created!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleUpdateEntry = async (entryId) => {
    const result = await updateDiaryEntry(entryId, {
      entry: 'Updated entry text',
      mood: 'Excited',
      category: 'Work',
      photos: [],
      voiceNotes: [],
      date: new Date().toISOString()
    });
    if (result.success) {
      loadEntries(user.uid);
      Alert.alert('Success', 'Entry updated!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    const result = await deleteDiaryEntry(entryId);
    if (result.success) {
      loadEntries(user.uid);
      Alert.alert('Success', 'Entry deleted!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Email:</Text>
        <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
        <Text>Password:</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
        <Button title="Sign Up" onPress={handleSignUp} />
        <Button title="Login" onPress={handleLogin} />
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Logged in as: {user.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
      
      <TextInput 
        value={entryText} 
        onChangeText={setEntryText} 
        placeholder="Write your diary entry..."
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />
      <Button title="Create Entry" onPress={handleCreateEntry} />

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, marginVertical: 5 }}>
            <Text>{item.entry}</Text>
            <Text>Mood: {item.mood}</Text>
            <Button title="Update" onPress={() => handleUpdateEntry(item.id)} />
            <Button title="Delete" onPress={() => handleDeleteEntry(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
