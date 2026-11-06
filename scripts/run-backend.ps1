# Start HireNest FastAPI Backend Server on Windows
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location "$RepoRoot\backend"

$PythonPath = "$RepoRoot\backend\venv\Scripts\python.exe"
if (-not (Test-Path $PythonPath)) {
    Write-Host "Virtual environment not found at backend\venv. Running with system python..." -ForegroundColor Yellow
    $PythonPath = "python"
}

Write-Host "Starting HireNest Backend on http://127.0.0.1:8000 ..." -ForegroundColor Green
Write-Host "API Interactive Docs: http://127.0.0.1:8000/docs" -ForegroundColor Cyan
& $PythonPath -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
