@echo off
echo ========================================
echo Expo QR Code Error - Auto Fix Script
echo ========================================
echo.

echo [1/5] Stopping any running Metro bundler...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo [2/5] Clearing Expo cache...
cd /d d:\Dairy
call npx expo start -c --clear 2>nul
timeout /t 2 >nul

echo [3/5] Clearing npm cache...
call npm cache clean --force

echo [4/5] Checking Node.js installation...
node --version
npm --version

echo [5/5] Starting Expo with tunnel mode...
echo.
echo ========================================
echo INSTRUCTIONS:
echo 1. Wait for QR code to appear
echo 2. Open Expo Go app on your phone
echo 3. Scan the QR code
echo 4. Wait 1-2 minutes for first download
echo ========================================
echo.

call npx expo start --tunnel

pause
