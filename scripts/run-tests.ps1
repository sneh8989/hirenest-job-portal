# Run full test suite for HireNest (Backend tests + Frontend typecheck/build)
$RepoRoot = Split-Path -Parent $PSScriptRoot

Write-Host "========================================" -ForegroundColor DarkGreen
Write-Host " Running HireNest Backend Tests (pytest)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor DarkGreen

Set-Location "$RepoRoot\backend"
$PythonPath = "$RepoRoot\backend\venv\Scripts\python.exe"
if (-not (Test-Path $PythonPath)) {
    $PythonPath = "python"
}

& $PythonPath -m pytest tests/test_api.py -v
$backendResult = $LASTEXITCODE

Write-Host "`n========================================" -ForegroundColor DarkGreen
Write-Host " Running Frontend Build & Type Validation" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor DarkGreen

Set-Location "$RepoRoot\frontend"
npm run build
$frontendResult = $LASTEXITCODE

Set-Location $RepoRoot
if ($backendResult -eq 0 -and $frontendResult -eq 0) {
    Write-Host "`nALL TESTS & BUILDS PASSED SUCCESSFULLY!" -ForegroundColor Green
} else {
    Write-Host "`nSOME TESTS OR BUILDS FAILED. Review logs above." -ForegroundColor Red
}
