# 🚀 Quick Reference - Environment Variables Setup

## ✅ Files Created/Updated

| File | Status | Description |
|------|--------|-------------|
| `.env` | ✅ Created | Your actual Firebase credentials (NOT in Git) |
| `.env.example` | ✅ Created | Template for other developers (safe to commit) |
| `config/firebaseConfig.js` | ✅ Updated | Now uses `process.env` |
| `.gitignore` | ✅ Updated | Ignores `.env` files |

---

## ⚡ Quick Start (3 Steps)

### Step 1: Restart Server
```bash
cd d:\Dairy
npx expo start -c
```

### Step 2: Test App
- Login
- Create entry
- Upload photo
- Check profile

### Step 3: Commit Changes
```bash
git add .gitignore .env.example config/firebaseConfig.js
git commit -m "Secure Firebase config with environment variables"
git push
```

---

## 📋 Environment Variables Format

```env
# .env file format (no spaces around =)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCsjU0bpQS9wMjSnkHwdfY5g1sC20JxZa0
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=personal-diary-app-9ae81.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=personal-diary-app-9ae81
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=personal-diary-app-9ae81.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=725668428678
EXPO_PUBLIC_FIREBASE_APP_ID=1:725668428678:web:4fac3c527b72b13003ca07
```

---

## 🔑 Key Rules

1. **Prefix:** All variables MUST start with `EXPO_PUBLIC_`
2. **Restart:** MUST restart server after changing `.env`
3. **No Quotes:** Don't use quotes around values in `.env`
4. **No Spaces:** No spaces around `=` sign
5. **Git:** NEVER commit `.env` file

---

## 🧪 Quick Test

Add to `App.js` temporarily:
```javascript
console.log('API Key:', process.env.EXPO_PUBLIC_FIREBASE_API_KEY?.substring(0, 10));
```

Should see: `API Key: AIzaSyCsjU`

---

## 🚨 If Already Pushed to GitHub

### CRITICAL: Rotate Your Keys!

1. Go to Firebase Console
2. Project Settings → General
3. Regenerate API key
4. Update `.env` with new key
5. Restart server

---

## 📁 Project Structure

```
d:\Dairy/
├── .env                    ← Your secrets (NOT in Git)
├── .env.example            ← Template (safe to commit)
├── .gitignore              ← Ignores .env
└── config/
    └── firebaseConfig.js   ← Uses process.env
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Variables undefined | Restart server with `-c` flag |
| "Missing env vars" error | Check `.env` file exists |
| Auth fails | Verify all 6 variables are set |
| Changes not reflected | Clear cache: `npx expo start -c` |

---

## 💡 Pro Tips

### Tip 1: Multiple Environments
```
.env.development   # Dev Firebase
.env.production    # Prod Firebase
```

### Tip 2: Validate on Startup
```javascript
if (!process.env.EXPO_PUBLIC_FIREBASE_API_KEY) {
  throw new Error('Missing Firebase API Key');
}
```

### Tip 3: Document in README
```markdown
## Setup
1. Copy `.env.example` to `.env`
2. Add your Firebase credentials
3. Run `npx expo start -c`
```

---

## ✅ Checklist

Before committing:
- [ ] `.env` file created
- [ ] `.env` added to `.gitignore`
- [ ] `.env.example` created
- [ ] `firebaseConfig.js` updated
- [ ] Server restarted
- [ ] App tested
- [ ] Old keys rotated (if exposed)

---

## 🎯 One-Line Commands

```bash
# Restart with clean cache
npx expo start -c

# Check if .env exists
dir .env

# View gitignore
type .gitignore

# Test environment variable
node -e "console.log(process.env.EXPO_PUBLIC_FIREBASE_API_KEY)"
```

---

## 📞 Need Help?

Check `FIREBASE_ENV_SETUP.md` for detailed guide.

---

**Remember:** Always restart server after changing `.env`!
