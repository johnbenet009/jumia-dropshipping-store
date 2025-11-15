@echo off
echo ========================================
echo   Jumia Reseller Store - Dev Servers
echo ========================================
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "node server.js"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd FRONTEND && npm run dev"
echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
