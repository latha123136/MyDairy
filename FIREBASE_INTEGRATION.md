# Firebase Backend Integration Guide

## Files Created

1. **config/firebaseConfig.js** - Firebase initialization
2. **services/authService.js** - Authentication functions
3. **services/diaryService.js** - Firestore CRUD operations
4. **screens/ExampleFirebaseScreen.js** - Example usage

## Setup Instructions

### 1. Firebase is already installed in package.json

### 2. Firebase Console Setup

Go to Firebase Console and:
- Enable **Email/Password Authentication**
- Create **Firestore Database** (start in test mode)
- Add this security rule in Firestore Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /diaryEntries/{entry} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

## Usage in Your App

### Authentication Example

```javascript
import { signUp, login, logout, getCurrentUser } from './services/authService';

// Sign up
const result = await signUp('user@example.com', 'password123');
if (result.success) {
  console.log('User:', result.user);
}

// Login
const result = await login('user@example.com', 'password123');
if (result.success) {
  console.log('User:', result.user);
}

// Logout
await logout();

// Get current user
const user = getCurrentUser();
```

### Diary Operations Example

```javascript
import { createDiaryEntry, getDiaryEntries, updateDiaryEntry, deleteDiaryEntry } from './services/diaryService';

// Create entry
const result = await createDiaryEntry(userId, {
  entry: 'Today was amazing!',
  mood: 'Happy',
  category: 'Personal',
  photos: [],
  voiceNotes: [],
  date: new Date().toISOString()
});

// Get all entries
const result = await getDiaryEntries(userId);
if (result.success) {
  console.log('Entries:', result.entries);
}

// Update entry
await updateDiaryEntry(entryId, {
  entry: 'Updated text',
  mood: 'Excited',
  category: 'Work',
  photos: [],
  voiceNotes: [],
  date: new Date().toISOString()
});

// Delete entry
await deleteDiaryEntry(entryId);
```

## Integration with HomeScreen

Replace AsyncStorage calls with Firebase:

```javascript
// Instead of AsyncStorage
const handleSave = async () => {
  const user = getCurrentUser();
  if (!user) return;
  
  const result = await createDiaryEntry(user.uid, {
    entry,
    mood,
    category,
    photos,
    voiceNotes,
    date: selectedDate.toISOString()
  });
  
  if (result.success) {
    Alert.alert('Success', 'Entry saved!');
    loadAllEntries();
  }
};

const loadAllEntries = async () => {
  const user = getCurrentUser();
  if (!user) return;
  
  const result = await getDiaryEntries(user.uid);
  if (result.success) {
    setAllEntries(result.entries);
  }
};
```

## Error Handling

All functions return `{ success: true/false, error: 'message' }` format for consistent error handling.
