@echo off
echo ===================================================
echo Starting CrazyPDF Full-Stack Workspace
echo ===================================================

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "CrazyPDF Backend" powershell -NoExit -Command "cd backend; ..\venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend on http://localhost:5173 ...
start "CrazyPDF Frontend" powershell -NoExit -Command "cd frontend; npm run dev"

echo.
echo CrazyPDF is running!
echo - Web App:    http://localhost:5173
echo - Backend API: http://localhost:8000
echo - Swagger Docs: http://localhost:8000/docs
echo ===================================================
