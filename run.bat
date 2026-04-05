@echo off
echo =======================================
echo     Starting AI Study Assistant...
echo =======================================

echo.
echo Starting Backend Database Server...
start "Backend Server" cmd /k "cd backend && npx nodemon server.js"

echo.
echo Starting Frontend React Interface...
start "Frontend UI" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo Keep those windows open while you are coding.
pause
