@echo off
echo ========================================
echo Environment Variables Setup Complete!
echo ========================================
echo.
echo Files Created:
echo   [x] .env (your Firebase credentials)
echo   [x] .env.example (template)
echo   [x] Updated firebaseConfig.js
echo   [x] Updated .gitignore
echo.
echo ========================================
echo IMPORTANT: Restarting Server
echo ========================================
echo.
echo Environment variables are loaded at build time.
echo The server MUST be restarted to load .env file.
echo.

cd /d d:\Dairy

echo [1/2] Stopping current server...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo [2/2] Starting with clean cache...
echo.
echo ========================================
echo AFTER SERVER STARTS:
echo 1. Scan QR code
echo 2. Test login
echo 3. Check console for:
echo    "Firebase API Key loaded: Yes"
echo 4. If everything works, commit changes!
echo ========================================
echo.

call npx expo start -c --lan

pause
