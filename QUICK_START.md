# 🚀 User Profile Feature - Quick Start Guide

## ✅ What's Been Created

### Frontend Files (React Native)
- ✅ `screens/ProfileScreen.js` - Complete profile UI
- ✅ `services/profileService.js` - Firebase Firestore operations
- ✅ `services/apiService.js` - Backend API integration
- ✅ `config/firebase.js` - Firebase configuration
- ✅ Updated `screens/HomeScreen.js` - Profile avatar in header
- ✅ Updated `navigation/MainNavigator.js` - Profile navigation

### Backend Files (Node.js)
- ✅ `backend/server.js` - Express server
- ✅ `backend/routes/profile.js` - API endpoints
- ✅ `backend/package.json` - Dependencies

### Documentation
- ✅ `FIREBASE_SETUP.md` - Firebase setup instructions
- ✅ `backend/README.md` - Backend setup guide
- ✅ `PROFILE_FEATURE.md` - Complete documentation

## 🔧 Setup Steps

### Step 1: Configure Firebase (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Click the web icon (</>) to register your app
4. Copy the configuration object

5. **Update `d:\Dairy\config\firebase.js`**:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123"
};
```

6. Enable services in Firebase Console:
   - **Authentication** → Email/Password
   - **Firestore Database** → Create database
   - **Storage** → Get started

### Step 2: Run Frontend (2 minutes)

```bash
cd d:\Dairy
npm install
npm start
```

### Step 3: Backend Setup (Optional - 5 minutes)

```bash
cd d:\Dairy\backend
npm install
```

Download Firebase Admin SDK key:
- Firebase Console → Project Settings → Service Accounts
- Generate New Private Key → Save as `backend/serviceAccountKey.json`

Update `backend/server.js`:
```javascript
storageBucket: 'your-project-id.appspot.com'
```

Start server:
```bash
npm start
```

## 🎯 How It Works

### User Flow
1. User logs in → Firebase Auth
2. Home screen displays → Profile avatar in top-right corner
3. Tap avatar → Navigate to Profile Screen
4. Edit profile → Save to Firestore
5. Profile updates everywhere

### Profile Avatar Location
```
┌─────────────────────────────────┐
│ 📖 MANOPATRA          [👤]     │ ← Profile avatar here
│ Monday, January 15, 2024        │
└─────────────────────────────────┘
```

### Profile Screen Features
- 📷 Profile Picture (tap to change)
- 👤 Name (editable)
- 📧 Email (read-only)
- 📝 Bio (optional, multiline)
- ⏰ Daily Reminder Time (time picker)
- 🌓 Theme Preference (Light/Dark toggle)
- 💾 Save Button

## 📊 Firestore Structure

```
users (collection)
  └── {userId} (document)
      ├── email: "user@example.com"
      ├── name: "John Doe"
      ├── bio: "Love writing daily thoughts"
      ├── photoURL: "https://firebasestorage..."
      ├── reminderTime: "2024-01-15T09:00:00.000Z"
      ├── theme: "light"
      ├── createdAt: Timestamp
      └── updatedAt: Timestamp
```

## 🔌 API Endpoints (Backend)

```
GET    /api/profile/:userId     - Get user profile
PUT    /api/profile/:userId     - Update profile
POST   /api/profile/:userId     - Create profile
```

## 🎨 UI Preview

### Home Screen Header
```
╔═══════════════════════════════════╗
║ 📖 MANOPATRA              [Photo] ║
║ Monday, January 15, 2024          ║
╚═══════════════════════════════════╝
```

### Profile Screen
```
╔═══════════════════════════════════╗
║ ← Back    My Profile              ║
╠═══════════════════════════════════╣
║                                   ║
║          [Profile Photo]          ║
║              📷                   ║
║                                   ║
║ ┌─────────────────────────────┐  ║
║ │ Name                        │  ║
║ │ [John Doe            ]      │  ║
║ └─────────────────────────────┘  ║
║                                   ║
║ ┌─────────────────────────────┐  ║
║ │ Email                       │  ║
║ │ [user@example.com    ]      │  ║
║ └─────────────────────────────┘  ║
║                                   ║
║ ┌─────────────────────────────┐  ║
║ │ Bio                         │  ║
║ │ [Tell us about yourself...] │  ║
║ │                             │  ║
║ └─────────────────────────────┘  ║
║                                   ║
║ ┌─────────────────────────────┐  ║
║ │ Daily Reminder Time         │  ║
║ │ ⏰ 09:00 AM                 │  ║
║ └─────────────────────────────┘  ║
║                                   ║
║ ┌─────────────────────────────┐  ║
║ │ Theme Preference            │  ║
║ │ [☀️ Light]  [🌙 Dark]       │  ║
║ └─────────────────────────────┘  ║
║                                   ║
║ ┌─────────────────────────────┐  ║
║ │     💾 Save Changes         │  ║
║ └─────────────────────────────┘  ║
╚═══════════════════════════════════╝
```

## 🧪 Testing Checklist

- [ ] Profile avatar appears in Home screen header
- [ ] Tapping avatar navigates to Profile screen
- [ ] Can edit name and bio
- [ ] Can select reminder time
- [ ] Can toggle theme preference
- [ ] Can upload/change profile picture
- [ ] Save button updates Firestore
- [ ] Profile data persists after app restart
- [ ] Avatar updates after changing photo

## 🐛 Troubleshooting

### Issue: Profile avatar not showing
**Solution**: Check if user is logged in and Firebase is configured

### Issue: Can't upload image
**Solution**: Enable Firebase Storage and check permissions

### Issue: Data not saving
**Solution**: Check Firestore rules and Firebase configuration

### Issue: Backend not working
**Solution**: Ensure server is running and API_BASE_URL is correct

## 📱 Test the Feature

1. **Sign up/Login** to the app
2. **Look at top-right** of Home screen → See avatar
3. **Tap avatar** → Navigate to Profile
4. **Edit your info** → Name, bio, etc.
5. **Upload photo** → Tap profile picture
6. **Set reminder** → Tap time picker
7. **Choose theme** → Light or Dark
8. **Save** → Data stored in Firestore

## 🎉 You're Done!

The User Profile feature is fully implemented and ready to use. Just configure Firebase and start the app!

## 📚 Additional Resources

- **Full Documentation**: `PROFILE_FEATURE.md`
- **Firebase Setup**: `FIREBASE_SETUP.md`
- **Backend Guide**: `backend/README.md`

## 💡 Next Steps

1. Configure Firebase credentials
2. Test the feature
3. Customize colors/styling if needed
4. Add more profile fields (optional)
5. Implement theme switching logic (optional)

---

**Need Help?** Check the documentation files or Firebase Console for troubleshooting.
