@echo off
echo ========================================
echo Expo Smart Start - Auto Network Detection
echo ========================================
echo.

cd /d d:\Dairy

echo Checking your network configuration...
echo.
ipconfig | findstr /i "IPv4"
echo.

echo ========================================
echo INSTRUCTIONS:
echo.
echo 1. Check the IP address above (e.g., 192.168.1.100)
echo 2. On your phone, go to WiFi settings
echo 3. Make sure your phone IP starts with same numbers
echo    Example: If computer is 192.168.1.100
echo             Phone should be 192.168.1.xxx
echo.
echo If they match = Same WiFi = Good to go!
echo ========================================
echo.

pause

echo.
echo Starting Expo in LAN mode (fastest and most reliable)...
echo.

call npx expo start --lan --clear

pause
