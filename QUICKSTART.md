# Quick Start Guide - Personal Diary App

## 🚀 Running the Application

### Option 1: Using Expo Go (Recommended for Testing)

1. **Install Expo Go on your mobile device**:
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Start the development server**:
   ```bash
   cd d:\Dairy
   npm start
   ```

3. **Scan the QR code**:
   - Android: Use Expo Go app to scan
   - iOS: Use Camera app to scan, then open in Expo Go

### Option 2: Using Android Emulator

1. **Install Android Studio** and set up an emulator

2. **Start the emulator**

3. **Run the app**:
   ```bash
   cd d:\Dairy
   npm run android
   ```

### Option 3: Using iOS Simulator (Mac only)

1. **Install Xcode** from Mac App Store

2. **Run the app**:
   ```bash
   cd d:\Dairy
   npm run ios
   ```

## 📱 Testing the App

### Test Account
Since this uses mock authentication, you can:
1. Sign up with any email/password (meeting requirements)
2. Login with the same credentials

### Sample Test Flow
1. **Sign Up**: 
   - Name: Test User
   - Email: test@example.com
   - Password: Test@123

2. **Login** with above credentials

3. **Create Entry**:
   - Select mood: 😊 Happy
   - Select category: Personal
   - Write: "This is my first diary entry!"
   - Save

4. **Search**: Search for "first"

5. **View Stats**: Check statistics tab

## 🎨 Features to Test

- ✅ Welcome screen with team info
- ✅ Sign up with password validation
- ✅ Login/Logout
- ✅ Forgot password flow
- ✅ Write diary entry
- ✅ Edit existing entry
- ✅ Add mood and category
- ✅ Attach photos (requires device permissions)
- ✅ Record voice notes (requires microphone permission)
- ✅ Search entries
- ✅ View statistics
- ✅ Bottom tab navigation

## 🔧 Troubleshooting

### "Unable to resolve module"
```bash
npm install
npx expo start -c
```

### "Network response timed out"
- Check your firewall settings
- Ensure phone and computer are on same network

### "Permission denied" for photos/audio
- Grant permissions when prompted
- Check device settings if denied

## 📝 Notes

- All data is stored locally on the device
- No internet connection required after initial setup
- Entries persist between app restarts
- No delete option (only edit) as per requirements

## 🎯 Next Steps

After testing, you can:
1. Customize team information in `utils/constants.js`
2. Modify colors and styling in screen files
3. Add more categories or moods
4. Integrate with a real backend when ready

---

**Happy Diary Writing! 📔✨**
