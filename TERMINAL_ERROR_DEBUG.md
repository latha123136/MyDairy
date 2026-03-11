# 🐛 Terminal Error Debugging Guide

## How to Share Terminal Error

Please provide the following information:

### 1. Copy the Full Error Message
```
Example:
ERROR: [error message here]
at [file path]
line [number]
```

### 2. What Command Were You Running?
```bash
# Example:
npx expo start
# or
npm start
# or
npx expo start --lan
```

### 3. When Did the Error Occur?
- [ ] When starting the app
- [ ] When scanning QR code
- [ ] When clicking profile avatar
- [ ] When loading a screen
- [ ] Other: ___________

### 4. Screenshot or Copy-Paste
Take a screenshot or copy-paste the entire terminal output.

---

## Common Terminal Errors & Quick Fixes

### Error 1: "Cannot find module"
```
Error: Cannot find module 'module-name'
```

**Fix:**
```bash
cd d:\Dairy
npm install
```

---

### Error 2: "Port already in use"
```
Error: listen EADDRINUSE: address already in use :::8081
```

**Fix:**
```bash
taskkill /F /IM node.exe
npx expo start
```

---

### Error 3: "Metro bundler error"
```
Error: Metro bundler has encountered an internal error
```

**Fix:**
```bash
npx expo start -c
```

---

### Error 4: "Firebase error"
```
Error: Firebase: Error (auth/...)
```

**Fix:**
Check `config/firebaseConfig.js` has correct credentials.

---

### Error 5: "Navigation error"
```
Error: The action 'NAVIGATE' with payload...
```

**Fix:**
```bash
npx expo start -c
```

---

### Error 6: "Module resolution failed"
```
Error: Unable to resolve module
```

**Fix:**
```bash
cd d:\Dairy
rm -rf node_modules
npm install
npx expo start -c
```

---

### Error 7: "Syntax error"
```
SyntaxError: Unexpected token
```

**Fix:**
Check the file mentioned in error for syntax issues (missing brackets, quotes, etc.)

---

### Error 8: "Network error"
```
Error: Network request failed
```

**Fix:**
- Check internet connection
- Use `npx expo start --lan` instead of `--tunnel`
- Ensure phone and computer on same WiFi

---

### Error 9: "Build error"
```
Error: Build failed
```

**Fix:**
```bash
cd d:\Dairy
npx expo start -c --clear
```

---

### Error 10: "Dependency error"
```
Error: Package dependency mismatch
```

**Fix:**
```bash
cd d:\Dairy
rm -rf node_modules package-lock.json
npm install
```

---

## 🔍 How to Get Detailed Error Info

### Enable Verbose Logging:
```bash
npx expo start --verbose
```

### Check Full Stack Trace:
Look for lines starting with:
- `Error:`
- `at`
- `in`
- `from`

### Copy Everything:
Select all terminal text and copy (Ctrl+A, Ctrl+C)

---

## 📋 Error Report Template

Please provide:

```
1. Command run:
   [command here]

2. Error message:
   [full error here]

3. Stack trace:
   [stack trace here]

4. What you were doing:
   [description]

5. When it started:
   [when]

6. Already tried:
   [ ] Clearing cache
   [ ] Restarting Metro
   [ ] Reinstalling node_modules
   [ ] Other: _______
```

---

## 🚀 Quick Diagnostic Commands

Run these and share output:

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check Expo version
npx expo --version

# Check if port is in use
netstat -ano | findstr :8081

# Check running node processes
tasklist | findstr node
```

---

## 💡 Common Solutions

### Solution 1: Clean Restart
```bash
taskkill /F /IM node.exe
cd d:\Dairy
npx expo start -c
```

### Solution 2: Reinstall Dependencies
```bash
cd d:\Dairy
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Solution 3: Clear All Caches
```bash
cd d:\Dairy
rmdir /s /q node_modules
rmdir /s /q .expo
del package-lock.json
npm install
npx expo start -c
```

---

## 🆘 Emergency Commands

If nothing works:

```bash
# Stop everything
taskkill /F /IM node.exe

# Navigate to project
cd d:\Dairy

# Nuclear clean
rmdir /s /q node_modules
rmdir /s /q .expo
del package-lock.json

# Fresh install
npm cache clean --force
npm install

# Start clean
npx expo start -c --clear
```

---

## 📸 How to Share Error

### Option 1: Screenshot
1. Press `Windows + Shift + S`
2. Select terminal area
3. Paste in chat

### Option 2: Copy Text
1. Select terminal text
2. Right-click → Copy
3. Paste in chat

### Option 3: Save to File
```bash
# Redirect output to file
npx expo start > error.log 2>&1
```

Then share `error.log` file.

---

## ⚡ Quick Checks

Before reporting error:

- [ ] Node.js installed? (`node --version`)
- [ ] npm working? (`npm --version`)
- [ ] In correct directory? (`cd d:\Dairy`)
- [ ] Dependencies installed? (`dir node_modules`)
- [ ] Internet connected?
- [ ] Firewall not blocking?

---

**Please share your terminal error and I'll help debug it!**
