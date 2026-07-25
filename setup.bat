@echo off
title AI Metadata Cleaner Setup
echo ===================================================
echo   AI Metadata Cleaner - Pembersih Metadata Gambar
echo ===================================================
echo.

echo [1/3] Menjalankan Backend FastAPI di port 8080...
start "AI Cleaner - Backend" cmd /k "cd /d D:\Code\AI Metadata Cleaner\backend && .\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8080 --host 127.0.0.1 --reload"

echo [2/3] Menjalankan Frontend Next.js di port 3000...
start "AI Cleaner - Frontend" cmd /k "cd /d D:\Code\AI Metadata Cleaner\frontend && npm run dev -- -p 3000"

echo [3/3] Membuka aplikasi di browser...
timeout /t 5 >nul
start http://localhost:3000

echo.
echo ===================================================
echo Server berhasil dijalankan!
echo Silakan gunakan jendela command prompt baru yang terbuka.
echo ===================================================
pause
