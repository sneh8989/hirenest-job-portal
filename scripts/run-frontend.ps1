# Start HireNest React Frontend Dev Server on Windows
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location "$RepoRoot\frontend"

Write-Host "Starting HireNest Frontend on http://127.0.0.1:5173 ..." -ForegroundColor Green
npm run dev -- --host 127.0.0.1 --port 5173
