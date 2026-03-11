@echo off
echo ========================================
echo Starting Expo with USB Connection
echo ========================================
echo.

echo Checking USB connection...
adb devices
echo.

if errorlevel 1 (
    echo ERROR: ADB not found!
    echo Please install Android Studio or ADB platform tools.
    echo See USB_SETUP.md for instructions.
    pause
    exit
)

echo If you see your device listed above, you're good to go!
echo If not, check USB_SETUP.md for troubleshooting.
echo.
pause

echo Starting Expo...
cd /d d:\Dairy
call npx expo start --localhost

pause
