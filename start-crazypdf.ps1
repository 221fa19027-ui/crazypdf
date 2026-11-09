Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting CrazyPDF Full-Stack Workspace" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# Start Backend
Write-Host "[1/2] Starting FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; ..\venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "[2/2] Starting Frontend on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`nCrazyPDF is running!" -ForegroundColor Green
Write-Host "  Web App:      http://localhost:5173" -ForegroundColor White
Write-Host "  Backend API:  http://localhost:8000" -ForegroundColor White
Write-Host "  Swagger Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Cyan
