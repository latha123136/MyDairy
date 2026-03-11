@echo off
echo ========================================
echo Clean Start - Clearing All Caches
echo ========================================
echo.

cd /d d:\Dairy

echo [1/3] Killing existing processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo [2/3] Clearing caches...
call npx expo start -c --clear
timeout /t 3 >nul
taskkill /F /IM node.exe 2>nul

echo [3/3] Starting fresh...
echo.
call npx expo start --clear

pause
