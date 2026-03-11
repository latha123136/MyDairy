# 🐛 Fix: "Something went wrong - java.io.IOException: failed to download remote update"

## Quick Fixes (Try in Order)

### Solution 1: Clear Cache and Restart (Most Common Fix)

```bash
cd d:\Dairy

# Clear Expo cache
npx expo start -c

# Or use
npx expo start --clear
```

### Solution 2: Use Tunnel Connection

```bash
# Start with tunnel mode (bypasses network issues)
npx expo start --tunnel
```

Then scan the QR code again.

### Solution 3: Use LAN Connection with Same WiFi

```bash
# Make sure your phone and computer are on the SAME WiFi network
npx expo start --lan
```

**Important**: Both devices must be on the same WiFi network!

### Solution 4: Clear Expo Go App Cache (Android)

On your Android device:
1. Open **Settings**
2. Go to **Apps** → **Expo Go**
3. Tap **Storage**
4. Tap **Clear Cache**
5. Tap **Clear Data**
6. Restart Expo Go app
7. Scan QR code again

### Solution 5: Reinstall Expo Go App

1. Uninstall Expo Go from your phone
2. Reinstall from Google Play Store
3. Restart your computer
4. Run `npx expo start -c`
5. Scan QR code

### Solution 6: Check Firewall/Antivirus

Windows Firewall might be blocking the connection:

1. Open **Windows Defender Firewall**
2. Click **Allow an app through firewall**
3. Find **Node.js** and check both Private and Public
4. Click OK
5. Restart: `npx expo start -c`

### Solution 7: Use Direct IP Connection

1. Find your computer's IP address:
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Start Expo:
```bash
npx expo start --lan
```

3. In Expo Go app, manually enter:
```
exp://YOUR_IP_ADDRESS:8081
```

### Solution 8: Update Dependencies

```bash
cd d:\Dairy

# Update Expo CLI
npm install -g expo-cli

# Update project dependencies
npm install

# Clear cache and start
npx expo start -c
```

### Solution 9: Check Metro Bundler Port

```bash
# Use different port if 8081 is blocked
npx expo start --port 8082 -c
```

### Solution 10: Development Build (If All Else Fails)

```bash
# Create development build
npx expo install expo-dev-client

# Run on Android
npx expo run:android
```

## 🔍 Detailed Troubleshooting

### Check Network Connection

**Verify both devices are on same network:**

On Computer (Windows):
```bash
ipconfig
```
Note your IPv4 address (e.g., 192.168.1.100)

On Phone:
- Settings → WiFi → Check connected network
- Should be same network as computer

### Check if Metro Bundler is Running

After running `npx expo start`, you should see:
```
Metro waiting on exp://192.168.x.x:8081
```

If you see errors, the bundler isn't starting properly.

### Common Causes

1. **Different Networks**: Phone on mobile data, computer on WiFi
2. **Firewall Blocking**: Windows Firewall blocking Node.js
3. **Cache Issues**: Old cached data causing conflicts
4. **Expo Go Version**: Outdated Expo Go app
5. **Network Restrictions**: Corporate/school WiFi blocking ports
6. **VPN Active**: VPN on computer or phone interfering

## ✅ Recommended Solution (Works 90% of Time)

```bash
# Step 1: Clear everything
cd d:\Dairy
npx expo start -c

# If that doesn't work, try tunnel:
npx expo start --tunnel

# If tunnel is slow, use LAN (same WiFi required):
npx expo start --lan
```

## 🎯 Best Practices

### For Development:

1. **Always use same WiFi** for phone and computer
2. **Clear cache** when switching between projects
3. **Keep Expo Go updated** on your phone
4. **Disable VPN** during development
5. **Allow Node.js** through firewall

### Alternative: Use Android Emulator

Instead of physical device:

```bash
# Install Android Studio
# Set up Android emulator
# Then run:
npx expo start --android
```

## 📱 Quick Test

After trying a solution, test with:

```bash
npx expo start -c
```

You should see:
```
✓ Metro waiting on exp://192.168.x.x:8081
✓ Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

Scan and wait 30-60 seconds for initial download.

## 🆘 Still Not Working?

### Try USB Connection (ADB)

1. Enable USB Debugging on Android phone
2. Connect phone via USB
3. Run:
```bash
adb devices
npx expo start --localhost
```

### Use Web Version (Temporary)

```bash
npx expo start --web
```

Opens in browser - good for testing UI.

## 📝 Error Variations

Same solutions work for:
- "Something went wrong"
- "Failed to download remote update"
- "Unable to resolve module"
- "Network request failed"
- "Connection timeout"

## 🔧 Nuclear Option (Complete Reset)

If nothing works:

```bash
cd d:\Dairy

# Delete node_modules and cache
rmdir /s /q node_modules
del package-lock.json

# Reinstall everything
npm install

# Clear all caches
npx expo start -c --clear

# Try tunnel mode
npx expo start --tunnel
```

## ✨ Success Indicators

You'll know it's working when:
1. QR code scans successfully
2. Expo Go shows "Downloading JavaScript bundle"
3. Progress bar reaches 100%
4. App loads and shows Welcome Screen

## 💡 Pro Tips

- **First time setup**: Always takes 1-2 minutes to download
- **Subsequent loads**: Should be instant (cached)
- **After code changes**: Hot reload should work automatically
- **If stuck at 99%**: Wait 2-3 minutes, it's still downloading

---

**Most Common Fix**: `npx expo start --tunnel` or `npx expo start -c`
