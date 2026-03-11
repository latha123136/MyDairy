@echo off
echo ========================================
echo Fixing Navigation Error
echo ========================================
echo.

cd /d d:\Dairy

echo [1/3] Stopping Metro bundler...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo [2/3] Clearing cache...
rmdir /s /q .expo 2>nul
timeout /t 1 >nul

echo [3/3] Starting with clean cache...
echo.
echo ========================================
echo After app loads:
echo 1. Login to the app
echo 2. Tap the profile avatar (top-right)
echo 3. Should navigate to Profile screen
echo 4. Check console for any errors
echo ========================================
echo.

call npx expo start -c

pause
