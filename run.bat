@echo off
title Kaizen Starter
echo ==========================================
echo Starting Kaizen AI Backend (FastAPI)...
echo ==========================================
start "Kaizen Backend (Port 8000)" cmd /k "cd /d D:\projects\kaizen-hf26\backend && .venv\Scripts\activate && python -m app.main"

echo ==========================================
echo Starting Kaizen Frontend (Next.js)...
echo ==========================================
start "Kaizen Frontend (Port 3000)" cmd /k "cd /d D:\projects\kaizen-hf26\frontend && npm run dev"

timeout /t 4 >nul
echo Opening Kaizen in your browser...
start http://localhost:3000
