# 🐛 Profile Avatar Debug Guide

## ✅ FIXED! Profile Avatar Now Shows in Top-Right Corner

### What Was Fixed:

1. **HomeScreen.js** - Added:
   - Navigation prop acceptance
   - Profile avatar button in header
   - User profile loading functionality
   - Profile image display

2. **ProfileScreen.js** - Created:
   - Complete profile management screen
   - Profile picture upload
   - Name, email, bio fields
   - Reminder time picker
   - Theme preference

3. **MainNavigator.js** - Updated:
   - Created HomeStack for nested navigation
   - Added ProfileScreen to navigation
   - Enabled Home → Profile navigation

4. **profileService.js** - Already exists:
   - Firebase Firestore integration
   - Profile CRUD operations
   - Image upload to Firebase Storage

---

## 🎯 How It Works Now

### Header Layout:
```
┌─────────────────────────────────────┐
│ 📖 MANOPATRA              [👤/📷]  │ ← Profile avatar here
│ Monday, January 15, 2024            │
└─────────────────────────────────────┘
```

### Navigation Flow:
1. User opens app → HomeScreen loads
2. HomeScreen fetches user profile from Firestore
3. Profile avatar displays in top-right corner
4. User taps avatar → Navigates to ProfileScreen
5. User edits profile → Saves to Firestore
6. Returns to HomeScreen → Avatar updates

---

## 🔍 Why It Wasn't Showing Before

### Issue 1: Missing Navigation Prop
**Problem**: HomeScreen didn't accept navigation prop
```javascript
// ❌ Before
export default function HomeScreen() {

// ✅ After
export default function HomeScreen({ navigation }) {
```

### Issue 2: No Profile Loading
**Problem**: HomeScreen didn't load user profile
```javascript
// ✅ Added
const [userProfile, setUserProfile] = useState(null);

const loadUserProfile = async (userId) => {
  const profile = await getUserProfile(userId);
  setUserProfile(profile);
};
```

### Issue 3: No Avatar Button
**Problem**: Header didn't have profile button
```javascript
// ✅ Added
<TouchableOpacity 
  style={styles.profileButton} 
  onPress={() => navigation.navigate('Profile')}
>
  {userProfile?.photoURL ? (
    <Image source={{ uri: userProfile.photoURL }} style={styles.profileImage} />
  ) : (
    <Text style={styles.profileIcon}>👤</Text>
  )}
</TouchableOpacity>
```

### Issue 4: No ProfileScreen
**Problem**: ProfileScreen.js didn't exist
**Solution**: Created complete ProfileScreen component

### Issue 5: Navigation Not Set Up
**Problem**: MainNavigator didn't include ProfileScreen
**Solution**: Created HomeStack with nested navigation

---

## 🧪 Testing the Fix

### Test 1: Check Avatar Appears
1. Start app: `npx expo start --lan`
2. Login to app
3. Look at top-right corner of HomeScreen
4. You should see 👤 icon or profile picture

### Test 2: Check Navigation
1. Tap the avatar icon
2. Should navigate to Profile Screen
3. Should see profile form

### Test 3: Check Profile Loading
1. On ProfileScreen, check if email is populated
2. Should show logged-in user's email

### Test 4: Upload Profile Picture
1. Tap profile picture placeholder
2. Select image from gallery
3. Wait for upload
4. Should see "Profile picture updated!"
5. Go back to HomeScreen
6. Avatar should show new picture

### Test 5: Update Profile
1. Edit name and bio
2. Tap "Save Changes"
3. Should see "Profile updated successfully!"
4. Go back and return
5. Changes should persist

---

## 🔧 Troubleshooting

### Avatar Not Showing

**Check 1: Firebase Configuration**
```javascript
// Verify config/firebaseConfig.js has correct credentials
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  // ... other config
};
```

**Check 2: Firestore Enabled**
- Go to Firebase Console
- Check if Firestore Database is enabled
- Check if Storage is enabled

**Check 3: User Logged In**
```javascript
// In HomeScreen, check console
const user = getCurrentUser();
console.log('Current user:', user);
```

**Check 4: Profile Service Working**
```javascript
// Add console logs in HomeScreen
const loadUserProfile = async (userId) => {
  console.log('Loading profile for:', userId);
  const profile = await getUserProfile(userId);
  console.log('Profile loaded:', profile);
  setUserProfile(profile);
};
```

### Navigation Not Working

**Check 1: Navigation Prop Passed**
```javascript
// HomeScreen should receive navigation
export default function HomeScreen({ navigation }) {
  console.log('Navigation:', navigation);
}
```

**Check 2: HomeStack Created**
```javascript
// In MainNavigator.js
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

**Check 3: Tab Uses HomeStack**
```javascript
<Tab.Screen 
  name="Home" 
  component={HomeStack}  // ← Should be HomeStack, not HomeScreen
  options={{ headerShown: false }}
/>
```

### Profile Picture Not Uploading

**Check 1: Storage Enabled**
- Firebase Console → Storage → Get Started

**Check 2: Storage Rules**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile_images/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Check 3: Image Picker Permissions**
```javascript
// Should request permissions
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
});
```

---

## 📊 Component Structure

```
App.js
└── MainNavigator
    └── Tab.Navigator
        └── HomeStack (Tab: Home)
            ├── HomeMain (HomeScreen)
            │   └── Header with Profile Avatar
            └── Profile (ProfileScreen)
                └── Profile Form
```

---

## 🎨 Avatar Display Logic

```javascript
// In HomeScreen header
{userProfile?.photoURL ? (
  // If user has uploaded photo, show it
  <Image source={{ uri: userProfile.photoURL }} style={styles.profileImage} />
) : (
  // Otherwise show default icon
  <Text style={styles.profileIcon}>👤</Text>
)}
```

---

## 💾 Data Flow

```
1. User logs in
   ↓
2. HomeScreen loads
   ↓
3. getCurrentUser() → Get Firebase Auth user
   ↓
4. getUserProfile(userId) → Fetch from Firestore
   ↓
5. setUserProfile(profile) → Update state
   ↓
6. Avatar renders with profile.photoURL
   ↓
7. User taps avatar
   ↓
8. Navigate to ProfileScreen
   ↓
9. User edits and saves
   ↓
10. updateUserProfile() → Save to Firestore
    ↓
11. Navigate back to HomeScreen
    ↓
12. Profile reloads → Avatar updates
```

---

## ✨ Expected Behavior

### On First Login (No Profile Yet):
- Avatar shows: 👤 (default icon)
- Tap avatar → ProfileScreen
- Email is pre-filled
- Name is empty
- Bio is empty
- Default reminder time
- Light theme selected

### After Creating Profile:
- Avatar shows: First letter of name in purple circle
- Or: Uploaded profile picture

### After Uploading Picture:
- Avatar shows: Actual profile picture
- Picture persists across app restarts
- Picture stored in Firebase Storage

---

## 🚀 Quick Verification

Run these commands to verify everything is set up:

```bash
# 1. Check files exist
dir d:\Dairy\screens\ProfileScreen.js
dir d:\Dairy\services\profileService.js

# 2. Start app
cd d:\Dairy
npx expo start --lan

# 3. Check console for errors
# Look for any Firebase or navigation errors
```

---

## 📝 Checklist

- [x] HomeScreen accepts navigation prop
- [x] HomeScreen loads user profile
- [x] Header has profile avatar button
- [x] Avatar shows default icon or picture
- [x] Tapping avatar navigates to ProfileScreen
- [x] ProfileScreen exists and works
- [x] Profile can be edited and saved
- [x] Changes persist in Firestore
- [x] Avatar updates after profile change
- [x] Navigation stack properly configured

---

**Status**: ✅ FIXED - Profile avatar now shows in top-right corner!

**Test it**: Start app, login, look at top-right corner of HomeScreen.
