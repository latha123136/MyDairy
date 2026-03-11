@echo off
echo Starting Expo in LAN mode (requires same WiFi network)...
echo Make sure your phone and computer are on the SAME WiFi!
echo.
cd /d d:\Dairy
call npx expo start --lan --clear
pause
