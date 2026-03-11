@echo off
echo Starting Expo in TUNNEL mode (works with any network)...
echo This may be slower but more reliable.
echo.
cd /d d:\Dairy
call npx expo start --tunnel --clear
pause
