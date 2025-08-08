@echo off
echo 🛡️ GRC Scanner - Development Server
echo ========================================
echo 🚀 Starting development servers...
echo 📍 Backend will run on: http://localhost:5000
echo 📍 Frontend will run on: http://localhost:3000
echo.
echo ⚠️ Press Ctrl+C in each window to stop servers
echo ========================================

echo 🔧 Starting Flask backend...
start "GRC Backend" cmd /k "cd backend && python app.py"

timeout /t 3 /nobreak > nul

echo ⚛️ Starting React frontend...
start "GRC Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ Both servers are starting in separate windows
echo 🔍 Check the new command windows for server status
echo 📱 Frontend will open automatically in your browser
pause