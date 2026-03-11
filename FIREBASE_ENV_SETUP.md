# 🔒 Securing Firebase Configuration with Environment Variables

## Complete Step-by-Step Implementation Guide

---

## ⚠️ IMPORTANT: Your API Keys Are Currently Exposed!

Your Firebase configuration is currently visible on GitHub. Follow this guide to secure it immediately.

---

## 📋 Step 1: Install Dependencies

Expo SDK 49+ has built-in support for environment variables with the `EXPO_PUBLIC_` prefix. No additional packages needed!

**Verify your Expo version:**
```bash
cd d:\Dairy
npx expo --version
```

✅ You're using Expo SDK 54, which has native `.env` support!

---

## 📝 Step 2: Create .env File

Create a `.env` file in your project root:

**File: `d:\Dairy\.env`**
```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCsjU0bpQS9wMjSnkHwdfY5g1sC20JxZa0
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=personal-diary-app-9ae81.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=personal-diary-app-9ae81
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=personal-diary-app-9ae81.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=725668428678
EXPO_PUBLIC_FIREBASE_APP_ID=1:725668428678:web:4fac3c527b72b13003ca07
```

**✅ Already created for you!**

---

## 📄 Step 3: Create .env.example Template

Create a template file for other developers:

**File: `d:\Dairy\.env.example`**
```env
# Firebase Configuration
# Copy this file to .env and fill in your actual Firebase credentials

EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

**✅ Already created for you!**

---

## 🔧 Step 4: Update firebaseConfig.js

**File: `d:\Dairy\config\firebaseConfig.js`**

```javascript
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Validate that all required environment variables are present
const requiredEnvVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  throw new Error(`Missing environment variables: ${missingVars.join(', ')}. Please check your .env file.`);
}

const app = initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
```

**✅ Already updated for you!**

---

## 🚫 Step 5: Update .gitignore

**File: `d:\Dairy\.gitignore`**

Add these lines to prevent `.env` files from being committed:

```gitignore
# Environment variables
.env
.env.local
.env.*.local
```

**✅ Already updated for you!**

---

## 📁 Step 6: Final Project Structure

```
d:\Dairy/
├── .env                          # ← Your actual secrets (NOT in Git)
├── .env.example                  # ← Template (safe to commit)
├── .gitignore                    # ← Updated to ignore .env
├── config/
│   └── firebaseConfig.js         # ← Updated to use env vars
├── screens/
├── services/
├── navigation/
├── utils/
├── App.js
├── package.json
└── README.md
```

---

## 🧪 Step 7: Testing

### Test 1: Verify Environment Variables Load

Add this temporary code to `App.js` (remove after testing):

```javascript
// At the top of App.js, add:
console.log('Firebase API Key loaded:', process.env.EXPO_PUBLIC_FIREBASE_API_KEY ? '✅ Yes' : '❌ No');
console.log('First 10 chars:', process.env.EXPO_PUBLIC_FIREBASE_API_KEY?.substring(0, 10));
```

### Test 2: Restart Development Server

**IMPORTANT:** Environment variables are loaded at build time, so you MUST restart:

```bash
# Stop current server (Ctrl+C)
cd d:\Dairy
npx expo start -c
```

### Test 3: Check Console Output

You should see:
```
Firebase API Key loaded: ✅ Yes
First 10 chars: AIzaSyCsjU
```

### Test 4: Test App Functionality

1. Login to app
2. Create diary entry
3. Upload photo
4. Navigate to profile

If everything works, environment variables are loaded correctly! ✅

---

## 🔐 Step 8: Secure Your GitHub Repository

### Option A: If You Haven't Pushed Yet

```bash
cd d:\Dairy

# Add .env to gitignore (already done)
# Commit the changes
git add .gitignore .env.example config/firebaseConfig.js
git commit -m "Secure Firebase config with environment variables"
git push
```

### Option B: If You Already Pushed (CRITICAL!)

Your API keys are already on GitHub. You need to:

1. **Rotate your Firebase API keys immediately:**
   - Go to Firebase Console
   - Project Settings → General
   - Under "Your apps" → Web app
   - Regenerate API key

2. **Remove sensitive data from Git history:**

```bash
cd d:\Dairy

# Install git-filter-repo (if not installed)
# pip install git-filter-repo

# Remove firebaseConfig.js from history
git filter-repo --path config/firebaseConfig.js --invert-paths

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

3. **Update .env with new keys**

4. **Commit the secured version:**

```bash
git add .gitignore .env.example config/firebaseConfig.js
git commit -m "Secure Firebase config with environment variables"
git push
```

---

## 🎯 Step 9: How Environment Variables Work in Expo

### Key Points:

1. **Prefix Required:** All public env vars must start with `EXPO_PUBLIC_`
2. **Build Time:** Variables are embedded at build time, not runtime
3. **Restart Required:** Must restart dev server after changing `.env`
4. **No Package Needed:** Expo SDK 49+ has native support

### Access Pattern:

```javascript
// ✅ Correct
process.env.EXPO_PUBLIC_FIREBASE_API_KEY

// ❌ Wrong (no prefix)
process.env.FIREBASE_API_KEY

// ❌ Wrong (not accessible)
import.meta.env.EXPO_PUBLIC_FIREBASE_API_KEY
```

---

## 📚 Step 10: Best Practices

### 1. Never Commit .env Files

```gitignore
# Always in .gitignore
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 2. Always Provide .env.example

```env
# .env.example - Safe to commit
EXPO_PUBLIC_FIREBASE_API_KEY=your_key_here
```

### 3. Document Environment Variables

In your README.md:

```markdown
## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your Firebase credentials
3. Restart the dev server
```

### 4. Validate Environment Variables

```javascript
// In firebaseConfig.js
if (!process.env.EXPO_PUBLIC_FIREBASE_API_KEY) {
  throw new Error('Missing EXPO_PUBLIC_FIREBASE_API_KEY');
}
```

### 5. Use Different Configs for Different Environments

```
.env.development  # Development Firebase project
.env.production   # Production Firebase project
```

---

## 🚨 Security Checklist

- [x] `.env` file created with Firebase credentials
- [x] `.env.example` template created
- [x] `firebaseConfig.js` updated to use `process.env`
- [x] `.env` added to `.gitignore`
- [x] Environment variable validation added
- [ ] Old API keys rotated in Firebase Console
- [ ] Sensitive data removed from Git history
- [ ] App tested with new configuration
- [ ] README updated with setup instructions

---

## 🔄 Step 11: Restart and Test

### Complete Restart Process:

```bash
# 1. Stop the current server
# Press Ctrl+C in terminal

# 2. Clear cache and restart
cd d:\Dairy
npx expo start -c

# 3. Scan QR code and test app

# 4. Verify in console:
# Should see: "Firebase API Key loaded: ✅ Yes"
```

---

## 🆘 Troubleshooting

### Issue 1: "Missing environment variables" Error

**Solution:**
```bash
# Ensure .env file exists
dir .env

# Restart with cache clear
npx expo start -c
```

### Issue 2: Environment Variables Are Undefined

**Solution:**
```bash
# Check .env file format (no spaces around =)
# Correct: EXPO_PUBLIC_FIREBASE_API_KEY=value
# Wrong:   EXPO_PUBLIC_FIREBASE_API_KEY = value

# Restart server
npx expo start -c
```

### Issue 3: Firebase Authentication Fails

**Solution:**
```bash
# Verify all 6 variables are set
# Check for typos in variable names
# Ensure values don't have quotes in .env file
```

### Issue 4: Changes Not Reflected

**Solution:**
```bash
# Environment variables are cached
# Must restart server after .env changes
npx expo start -c --clear
```

---

## 📖 Additional Resources

### Expo Environment Variables Documentation:
https://docs.expo.dev/guides/environment-variables/

### Firebase Security Best Practices:
https://firebase.google.com/docs/projects/api-keys

### Git History Cleanup:
https://github.com/newren/git-filter-repo

---

## ✅ Summary

### What You've Done:

1. ✅ Created `.env` file with Firebase credentials
2. ✅ Created `.env.example` template
3. ✅ Updated `firebaseConfig.js` to use environment variables
4. ✅ Added `.env` to `.gitignore`
5. ✅ Added validation for missing variables

### What You Need to Do:

1. **Restart the dev server:** `npx expo start -c`
2. **Test the app** to ensure everything works
3. **Rotate Firebase API keys** (if already pushed to GitHub)
4. **Remove sensitive data** from Git history (if needed)
5. **Commit and push** the secured version

---

## 🎉 You're Done!

Your Firebase configuration is now secure and won't be exposed in your GitHub repository!

**Next Steps:**
1. Press `Ctrl+C` to stop current server
2. Run: `npx expo start -c`
3. Test your app
4. Commit changes to Git

---

**Need Help?** Check the troubleshooting section or Expo documentation.
