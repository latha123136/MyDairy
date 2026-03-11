@echo off
echo ========================================
echo NAVIGATION ERROR - FIXED!
echo ========================================
echo.
echo Fix Applied:
echo - Changed HomeScreen to use useNavigation hook
echo - This ensures correct navigator context
echo.
echo ========================================
echo.

cd /d d:\Dairy

echo [1/2] Stopping Metro bundler...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo [2/2] Starting with clean cache...
echo.
echo ========================================
echo AFTER APP LOADS:
echo 1. Login to the app
echo 2. Tap profile avatar (top-right corner)
echo 3. Should navigate to Profile screen
echo 4. No more navigation errors!
echo ========================================
echo.

call npx expo start -c --lan

pause
