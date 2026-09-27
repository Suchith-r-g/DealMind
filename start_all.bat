@echo off
echo ============================================================
echo  DealMind: Deal Intelligence Agent
echo  Persistent B2B Sales Memory Powered by Hindsight
echo ============================================================
echo.

set SCRIPT_DIR=%~dp0
set VENV_PYTHON=%SCRIPT_DIR%venv\Scripts\python.exe

REM Read environment variables from backend\.env if present
if exist "%SCRIPT_DIR%backend\.env" (
    for /f "tokens=1,2 delims==" %%a in ('findstr /v "^#" "%SCRIPT_DIR%backend\.env"') do (
        if "%%a"=="GROQ_API_KEY" set GROQ_KEY=%%b
        if "%%a"=="GROQ_MODEL" set GROQ_MOD=%%b
        if "%%a"=="HINDSIGHT_BASE_URL" set HINDSIGHT_URL=%%b
    )
)

echo [1/3] Starting DealMind Backend (FastAPI) on port 8000...
start "DealMind Backend" cmd /k "cd /d %SCRIPT_DIR%backend && ..\venv\Scripts\python -m uvicorn main:app --port 8000 --host 127.0.0.1 --reload"

timeout /t 4 /nobreak > nul

echo [2/3] Starting DealMind Frontend (Vite + React) on port 5173...
start "DealMind Frontend" cmd /k "cd /d %SCRIPT_DIR%frontend && npm run dev"

timeout /t 3 /nobreak > nul

echo [3/3] Checking services...
echo.
echo ============================================================
echo  DealMind is Running!
echo.
echo  - Frontend Dashboard:   http://127.0.0.1:5173
echo  - Backend API Docs:     http://127.0.0.1:8000/docs
echo  - Health & Memories:    http://127.0.0.1:8000/api/deals
echo ============================================================
echo.
echo Press any key to open the dashboard in your default browser...
pause > nul
start http://127.0.0.1:5173

