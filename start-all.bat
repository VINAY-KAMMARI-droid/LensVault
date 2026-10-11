@echo off
title LensVault Platform Launcher
color 0E

echo ===============================================================================
echo                LENSVAULT - FULL-STACK PLATFORM LAUNCHER
echo ===============================================================================
echo.
echo Launching Spring Boot Backend in a new window...
start "LensVault Backend (Port 8080)" cmd /c "%~dp0start-backend.bat"

timeout /t 3 /nobreak >nul

echo Launching Vite React Frontend in a new window...
start "LensVault Frontend (Port 5173)" cmd /c "%~dp0start-frontend.bat"

echo.
echo ===============================================================================
echo Platform is launching!
echo.
echo Backend URL:  http://localhost:8080/api/v1
echo Frontend URL: http://localhost:5173
echo.
echo Demo Accounts:
echo  1. Photographer: photographer@lensvault.com / Photographer@123
echo  2. Client Sarah: client.sarah@lensvault.com / Client@123
echo  3. Client David: client.david@lensvault.com / Client@123
echo  4. Administrator: admin@lensvault.com        / Admin@123
echo ===============================================================================
echo.
pause
