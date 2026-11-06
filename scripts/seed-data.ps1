# Reseed Database with initial demo accounts, realistic jobs, applications, and logs
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location "$RepoRoot\backend"

$PythonPath = "$RepoRoot\backend\venv\Scripts\python.exe"
if (-not (Test-Path $PythonPath)) {
    $PythonPath = "python"
}

Write-Host "Seeding database..." -ForegroundColor Green
& $PythonPath -m app.data.seed_data
Write-Host "Database successfully reseeded!" -ForegroundColor Green
