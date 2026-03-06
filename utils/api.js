import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For Android emulator use 10.0.2.2, for physical device use your computer's IP
const API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3000/api' 
  : 'http://localhost:3000/api';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const signup = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (response.ok) {
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    return { error: 'Network error. Make sure backend is running.' };
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    return { error: 'Network error. Make sure backend is running.' };
  }
};

export const createEntry = async (entry, mood, category, photos) => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ entry, mood, category, photos })
    });
    return await response.json();
  } catch (error) {
    return { error: 'Network error' };
  }
};

export const getEntries = async () => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/entries`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const getTodayEntry = async () => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/entries/today`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const updateEntry = async (id, entry, mood, category, photos) => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/entries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ entry, mood, category, photos })
    });
    return await response.json();
  } catch (error) {
    return { error: 'Network error' };
  }
};

export const searchEntries = async (query) => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/entries/search?query=${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    return [];
  }
};
