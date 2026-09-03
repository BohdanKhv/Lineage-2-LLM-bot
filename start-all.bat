@echo off
title L2 Arena - start everything
rem One-click start: MariaDB -> login server -> game server -> control panel -> browser.
rem The pack's own start.bat files are used (correct JVM flags + game server restart loop);
rem they need Java 8 on PATH, which is not there by default, so it is added here.
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-8.0.504.1-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [1/4] MariaDB service...
net start MariaDB >nul 2>&1 || echo       (already running)

echo [2/4] Login server (port 2106)...
start "L2 Login Server" /D "D:\l2srv\login" cmd /k start.bat
timeout /t 6 /nobreak >nul

echo [3/4] Game server (port 7777) - takes ~30-60s to load...
start "L2 Game Server" /D "D:\l2srv\game" cmd /k start.bat

echo [4/4] Arena control panel (http://127.0.0.1:8080)...
start "L2 Arena Panel" /D "D:\l2 project\bot" cmd /k node server\api.js
timeout /t 4 /nobreak >nul
start "" http://127.0.0.1:8080

echo.
echo All started - each server has its own console window (close those to stop).
echo The panel's Actions tab shows gameserver / loginserver status pills; wait for both to be "up".
timeout /t 8 >nul
