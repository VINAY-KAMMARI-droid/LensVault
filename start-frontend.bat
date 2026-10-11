@echo off
title LensVault Frontend - Vite React Client
color 0B

echo ===============================================================================
echo                LENSVAULT - SECURE MEDIA DELIVERY PLATFORM
echo                          Starting Frontend Client
echo ===============================================================================
echo.

cd /d "%~dp0frontend"

echo [INFO] Starting Vite React application at http://localhost:5173 ...
echo.

call npm.cmd run dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Frontend failed to start or exited with an error.
    pause
)
