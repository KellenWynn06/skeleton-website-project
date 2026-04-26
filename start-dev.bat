@echo off
title Full Stack Dev Server

echo Starting backend...
start cmd /k "cd backend && uvicorn app.main:app --reload"

timeout /t 2 >nul

echo Starting frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo Servers starting...
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
pause