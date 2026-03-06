# 🔧 Troubleshooting Guide - Personal Diary App

## Common Issues and Solutions

---

## 🚀 Installation Issues

### Issue: "npm install" fails
**Symptoms:**
- Error messages during installation
- Missing dependencies

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "Cannot find module" errors
**Symptoms:**
- App crashes on start
- Module not found errors

**Solutions:**
```bash
# Install missing dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install expo-image-picker expo-av
npm install react-native-gesture-handler
```

---

## 📱 Running the App

### Issue: Metro bundler won't start
**Symptoms:**
- "npm start" hangs
- Port already in use

**Solutions:**
```bash
# Kill existing Metro process
# Windows:
taskkill /F /IM node.exe

# Mac/Linux:
killall node

# Start with cache clear
npx expo start -c
```

### Issue: QR code won't scan
**Symptoms:**
- Camera doesn't recognize QR code
- Expo Go doesn't open

**Solutions:**
1. Ensure phone and computer are on same WiFi network
2. Try tunnel mode: `npx expo start --tunnel`
3. Manually enter URL in Expo Go app
4. Check firewall settings

### Issue: "Network response timed out"
**Symptoms:**
- App won't load on device
- Connection errors

**Solutions:**
1. Check WiFi connection
2. Restart Metro bundler
3. Use tunnel mode: `npx expo start --tunnel`
4. Disable VPN if active
5. Check firewall/antivirus settings

---

## 🔐 Authentication Issues

### Issue: Can't sign up
**Symptoms:**
- "Invalid password" error
- Sign up button doesn't work

**Solutions:**
1. Ensure password meets requirements:
   - Minimum 8 characters
   - At least one uppercase letter (A-Z)
   - At least one special symbol (!@#$%^&*(),.?":{}|<>)
2. Example valid password: `Test@123`
3. Check all fields are filled

### Issue: Can't login
**Symptoms:**
- "Invalid credentials" error
- Login fails

**Solutions:**
1. Ensure you've signed up first
2. Use exact same email and password from signup
3. Check for typos
4. Try signing up again if needed

### Issue: Stuck on login screen
**Symptoms:**
- Login successful but doesn't navigate
- App freezes

**Solutions:**
```bash
# Clear app data
# Close app completely
# Restart Metro bundler
npx expo start -c
```

---

## 📝 Diary Entry Issues

### Issue: Can't save entry
**Symptoms:**
- "Please write something" error
- Save button doesn't work

**Solutions:**
1. Ensure text area has content
2. Check AsyncStorage permissions
3. Try restarting app

### Issue: Entry not loading
**Symptoms:**
- Today's entry doesn't appear
- Blank home screen

**Solutions:**
1. Check date/time on device is correct
2. Try creating new entry
3. Check AsyncStorage data:
```javascript
// In React Native Debugger
AsyncStorage.getAllKeys().then(keys => console.log(keys))
```

### Issue: Can't edit entry
**Symptoms:**
- Update button doesn't work
- Changes not saving

**Solutions:**
1. Ensure you're editing today's entry
2. Check text area is not empty
3. Try closing and reopening app

---

## 📷 Photo & Media Issues

### Issue: Photo picker doesn't open
**Symptoms:**
- Nothing happens when tapping Photo button
- Permission denied

**Solutions:**
1. Grant photo library permission:
   - iOS: Settings → App → Photos → Allow
   - Android: Settings → Apps → Permissions → Storage
2. Restart app after granting permission
3. Check app.json has correct permissions

### Issue: Photos not displaying
**Symptoms:**
- Photos selected but don't show
- Broken image icons

**Solutions:**
1. Check photo file exists
2. Try selecting different photo
3. Check device storage space
4. Restart app

### Issue: Voice recording fails
**Symptoms:**
- "Failed to start recording" error
- Microphone not working

**Solutions:**
1. Grant microphone permission:
   - iOS: Settings → App → Microphone → Allow
   - Android: Settings → Apps → Permissions → Microphone
2. Close other apps using microphone
3. Restart device
4. Check app.json has microphone permission

---

## 🔍 Search Issues

### Issue: Search not working
**Symptoms:**
- No results appear
- Search doesn't filter

**Solutions:**
1. Ensure entries exist (create some first)
2. Try different search terms
3. Check spelling
4. Search is case-insensitive

### Issue: Can't open entry from search
**Symptoms:**
- Tapping entry does nothing
- App crashes

**Solutions:**
1. Restart app
2. Check entry data is valid
3. Try searching for different entry

---

## 📊 Statistics Issues

### Issue: Statistics not showing
**Symptoms:**
- Empty statistics screen
- "No data yet" messages

**Solutions:**
1. Create some diary entries first
2. Ensure entries have mood and category
3. Wait a moment for calculations
4. Restart app

### Issue: Wrong statistics
**Symptoms:**
- Incorrect counts
- Wrong percentages

**Solutions:**
1. Check all entries are saved properly
2. Restart app to recalculate
3. Verify entry dates are correct

---

## 💾 Data & Storage Issues

### Issue: Data not persisting
**Symptoms:**
- Entries disappear after closing app
- Have to login again

**Solutions:**
1. Check AsyncStorage is working:
```bash
# Clear and reinstall
npm install @react-native-async-storage/async-storage
```
2. Don't clear app data/cache manually
3. Check device storage space

### Issue: Lost all data
**Symptoms:**
- All entries gone
- Have to sign up again

**Solutions:**
1. Data is stored locally only
2. Clearing app data will delete everything
3. No recovery possible (no backend)
4. Prevention: Don't clear app data

---

## 🎨 UI/Display Issues

### Issue: Layout looks broken
**Symptoms:**
- Overlapping elements
- Text cut off
- Buttons not visible

**Solutions:**
1. Restart app
2. Check device screen size
3. Try rotating device
4. Update to latest Expo version

### Issue: Keyboard covers input
**Symptoms:**
- Can't see what you're typing
- Input hidden behind keyboard

**Solutions:**
1. Scroll the view
2. This is normal behavior
3. Keyboard will dismiss when done

### Issue: App is slow
**Symptoms:**
- Laggy navigation
- Slow loading

**Solutions:**
1. Close other apps
2. Restart device
3. Clear Metro cache: `npx expo start -c`
4. Check device storage space

---

## 🔄 Navigation Issues

### Issue: Can't navigate between screens
**Symptoms:**
- Buttons don't work
- Stuck on one screen

**Solutions:**
1. Restart app
2. Check for JavaScript errors in console
3. Reinstall dependencies:
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
```

### Issue: Back button doesn't work
**Symptoms:**
- Can't go back
- Navigation broken

**Solutions:**
1. Use device back button (Android)
2. Swipe from left edge (iOS)
3. Restart app

---

## 🐛 Debugging Tips

### Enable Debug Mode
```bash
# Start with debugging
npx expo start --dev-client

# Open React Native Debugger
# Press Ctrl+M (Android) or Cmd+D (iOS)
# Select "Debug"
```

### Check Console Logs
```bash
# View logs in terminal
npx expo start

# Logs will appear in terminal
# Look for errors or warnings
```

### Clear All Data (Fresh Start)
```bash
# Stop Metro bundler
# Delete node_modules
rm -rf node_modules

# Clear cache
npm cache clean --force

# Reinstall
npm install

# Start fresh
npx expo start -c
```

---

## 📱 Device-Specific Issues

### Android Issues

**Issue: App won't install on emulator**
```bash
# Start emulator first
# Then run:
npm run android
```

**Issue: White screen on Android**
- Enable USB debugging
- Check Android version (minimum Android 5.0)
- Clear app data and reinstall

### iOS Issues

**Issue: App won't run on simulator**
```bash
# Install iOS simulator
# Then run:
npm run ios
```

**Issue: Permission issues on iOS**
- Check Info.plist has correct permissions
- Reinstall app
- Reset simulator

---

## 🆘 Emergency Fixes

### Nuclear Option (Complete Reset)
```bash
# 1. Stop all processes
# Kill Metro bundler

# 2. Delete everything
rm -rf node_modules
rm -rf .expo
rm package-lock.json

# 3. Reinstall
npm install

# 4. Start fresh
npx expo start -c
```

### Can't Fix? Try This
1. Check you're in correct directory: `cd d:\Dairy`
2. Check Node.js version: `node --version` (should be 14+)
3. Check npm version: `npm --version`
4. Update Expo CLI: `npm install -g expo-cli`
5. Create new Expo project and copy files

---

## 📞 Getting Help

### Before Asking for Help
1. ✅ Read error message carefully
2. ✅ Check this troubleshooting guide
3. ✅ Try restarting app
4. ✅ Try clearing cache
5. ✅ Check console for errors

### Information to Provide
- Device type (Android/iOS)
- Device version
- Error message (exact text)
- Steps to reproduce
- What you've tried already

### Useful Commands
```bash
# Check versions
node --version
npm --version
expo --version

# View all logs
npx expo start --dev-client

# Check installed packages
npm list

# Verify installation
npm install --dry-run
```

---

## ✅ Prevention Tips

### Best Practices
1. ✅ Always use `npx expo start -c` after changes
2. ✅ Don't clear app data manually
3. ✅ Keep device and computer on same network
4. ✅ Grant all permissions when asked
5. ✅ Keep Expo Go app updated
6. ✅ Don't modify node_modules
7. ✅ Commit code regularly (if using git)

### Regular Maintenance
```bash
# Weekly: Clear cache and restart
npx expo start -c

# Monthly: Update dependencies
npm update

# As needed: Clear Metro cache
rm -rf .expo
```

---

## 🎯 Quick Fixes Checklist

When something goes wrong, try these in order:

- [ ] Restart the app
- [ ] Restart Metro bundler
- [ ] Clear Metro cache: `npx expo start -c`
- [ ] Restart device
- [ ] Check WiFi connection
- [ ] Check permissions
- [ ] Clear and reinstall: `rm -rf node_modules && npm install`
- [ ] Check this guide for specific issue
- [ ] Try on different device
- [ ] Create fresh project and copy files

---

## 📚 Additional Resources

- Expo Documentation: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- React Native: https://reactnative.dev
- Stack Overflow: Search for specific errors

---

**Most issues can be fixed with a simple restart or cache clear! 🔄**

If you're still stuck, check the error message carefully and search for it online.
