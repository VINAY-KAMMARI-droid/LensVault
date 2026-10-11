@echo off
title LensVault Backend - Spring Boot Server
color 0A

echo ===============================================================================
echo                LENSVAULT - SECURE MEDIA DELIVERY PLATFORM
echo                           Starting Backend Server
echo ===============================================================================
echo.

cd /d "%~dp0backend"

REM Check for Maven executable
set MVN_CMD=mvn
where mvn >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\Users\venky\apache-maven-3.9.6\bin\mvn.cmd" (
        set MVN_CMD=C:\Users\venky\apache-maven-3.9.6\bin\mvn.cmd
    ) else (
        echo [ERROR] Maven not found on PATH or default location.
        echo Please ensure Maven is installed.
        pause
        exit /b 1
    )
)

echo [INFO] Using Maven: %MVN_CMD%
echo [INFO] Database: lensvault_db (MySQL on localhost:3306)
echo [INFO] Starting Spring Boot at http://localhost:8080 ...
echo.

call "%MVN_CMD%" spring-boot:run

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Backend failed to start or exited with an error.
    pause
)
