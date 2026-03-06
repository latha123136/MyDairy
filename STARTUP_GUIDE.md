# Startup Guide - Debugging QR Code Error

## The Issue
The "Something went wrong" error after scanning QR code is typically caused by:
1. Backend server not running
2. Network connection issues between mobile device and backend

## Solution Steps

### Step 1: Start Backend Server

Open a terminal in the backend directory:
```bash
cd backend
npm install
npm start
```

You should see: `Server running on port 3000` and `Connected to MongoDB Atlas`

### Step 2: Configure API URL for Your Device

The app is configured to work with:
- **Android Emulator**: Uses `http://10.0.2.2:3000/api` (automatically)
- **iOS Simulator**: Uses `http://localhost:3000/api` (automatically)
- **Physical Device**: You need to update the API URL

#### For Physical Device:

1. Find your computer's IP address:
   - Windows: Open CMD and type `ipconfig` (look for IPv4 Address)
   - Mac/Linux: Open Terminal and type `ifconfig` (look for inet)

2. Update `utils/api.js`:
   ```javascript
   const API_URL = 'http://YOUR_COMPUTER_IP:3000/api';
   // Example: 'http://192.168.1.100:3000/api'
   ```

3. Make sure your phone and computer are on the same WiFi network

### Step 3: Start React Native App

In the main Dairy directory:
```bash
npm start
```

Then scan the QR code with Expo Go app.

### Step 4: Test the Connection

1. Try to sign up with a new account
2. If you see "Network error. Make sure backend is running." - the backend is not accessible
3. Check that:
   - Backend server is running (Step 1)
   - API URL is correct (Step 2)
   - Firewall is not blocking port 3000

## Quick Test

To verify backend is working, open browser and go to:
- `http://localhost:3000/api/entries` (should show "Please authenticate" error - this is good!)

## Common Issues

1. **"Network error"**: Backend not running or wrong API URL
2. **"Please authenticate"**: Normal - means backend is working
3. **Port 3000 in use**: Change PORT in backend/.env.example to 3001

## Alternative: Test Without Backend First

If you want to test the app without backend, you can temporarily use AsyncStorage:
1. The app will work offline
2. Data stored locally on device
3. No sync across devices
