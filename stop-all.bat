@echo off
title L2 Arena - stop servers
rem Stops the game server and login server (Java). MariaDB (service) and the panel are left alone;
rem close the "L2 Arena Panel" window to stop the panel.
echo Stopping game server + login server...
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='java.exe'\" | Where-Object { $_.CommandLine -match 'BootManager|L2LoginServer' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force; Write-Host ('  stopped java pid ' + $_.ProcessId) }"
echo Done.
timeout /t 4 >nul
