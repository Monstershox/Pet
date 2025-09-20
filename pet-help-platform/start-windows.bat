@echo off
echo Starting Pet Help Platform...
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo [2/4] Installing frontend dependencies...
cd frontend
if not exist node_modules (
    echo Installing packages...
    call npm install
) else (
    echo Dependencies already installed
)
echo.

echo [3/4] Creating environment file...
if not exist .env.local (
    echo NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 > .env.local
    echo Environment file created
) else (
    echo Environment file already exists
)
echo.

echo [4/4] Starting frontend server...
echo.
echo ===================================
echo Frontend will start at http://localhost:3000
echo ===================================
echo.
start cmd /k npm run dev

cd ..
echo.
echo NOTE: Backend requires Python.
echo To run the backend manually:
echo 1. Install Python from https://python.org
echo 2. Open new terminal in backend folder
echo 3. Run: pip install -r requirements.txt
echo 4. Run: python main.py
echo.
pause