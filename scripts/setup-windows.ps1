# HireNest Windows Setup Automation Script
# Run from repository root in PowerShell: .\scripts\setup-windows.ps1

Write-Host "==========================================================" -ForegroundColor DarkGreen
Write-Host "         HireNest - Windows Setup & Environment" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor DarkGreen

$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

# 1. Check Python
Write-Host "`n[1/5] Checking Python installation..." -ForegroundColor Cyan
try {
    $pythonVer = python --version
    Write-Host "Found: $pythonVer" -ForegroundColor Green
} catch {
    Write-Error "Python 3.11+ is required but was not found in PATH."
    Exit 1
}

# 2. Check Node & npm
Write-Host "`n[2/5] Checking Node.js and npm..." -ForegroundColor Cyan
try {
    $nodeVer = node -v
    $npmVer = npm -v
    Write-Host "Found Node: $nodeVer | npm: $npmVer" -ForegroundColor Green
} catch {
    Write-Error "Node.js (v18+) is required but was not found in PATH."
    Exit 1
}

# 3. Setup Backend Virtual Environment & Environment File
Write-Host "`n[3/5] Setting up backend environment and dependencies in ./backend..." -ForegroundColor Cyan
Set-Location "$RepoRoot\backend"

if (-not (Test-Path ".env")) {
    Write-Host "Creating backend\.env from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    try {
        $bytes = New-Object byte[] 32
        [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
        $randomSecret = ([BitConverter]::ToString($bytes) -replace '-').ToLower()
        (Get-Content ".env") -replace "CHANGE_THIS_TO_A_SECURE_RANDOM_SECRET_KEY_MIN_32_BYTES", $randomSecret | Set-Content ".env"
        Write-Host "Generated secure cryptographic secret key in backend\.env." -ForegroundColor Green
    } catch {
        Write-Host "Created backend\.env (using default development key)." -ForegroundColor Yellow
    }
}

if (-not (Test-Path "venv")) {
    python -m venv venv
    Write-Host "Created virtual environment." -ForegroundColor Green
} else {
    Write-Host "Virtual environment already exists." -ForegroundColor Yellow
}

$PipPath = "$RepoRoot\backend\venv\Scripts\pip.exe"
& $PipPath install --upgrade pip
& $PipPath install -r requirements.txt
Write-Host "Backend dependencies installed successfully." -ForegroundColor Green

# 4. Setup Frontend Packages
Write-Host "`n[4/5] Installing frontend dependencies in ./frontend..." -ForegroundColor Cyan
Set-Location "$RepoRoot\frontend"
npm install
Write-Host "Frontend dependencies installed successfully." -ForegroundColor Green

# 5. Initialize & Seed Database
Write-Host "`n[5/5] Initializing database and loading realistic seed data..." -ForegroundColor Cyan
Set-Location "$RepoRoot\backend"
$PythonPath = "$RepoRoot\backend\venv\Scripts\python.exe"
& $PythonPath -m app.data.seed_data
Write-Host "Database seeded successfully!" -ForegroundColor Green

Set-Location $RepoRoot
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "HireNest setup completed successfully!" -ForegroundColor Green
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "  Backend:  .\scripts\run-backend.ps1" -ForegroundColor Yellow
Write-Host "  Frontend: .\scripts\run-frontend.ps1" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
