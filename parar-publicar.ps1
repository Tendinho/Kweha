$ErrorActionPreference = "SilentlyContinue"
$pidFile = Join-Path $PSScriptRoot ".publicar.pid"

if (-not (Test-Path $pidFile)) {
    Write-Host "Nao encontrei nenhuma publicacao ativa."
    exit 0
}

$pids = Get-Content $pidFile -Raw | ConvertFrom-Json
$parados = @()
if ($pids.tunnel) {
    Stop-Process -Id $pids.tunnel -Force
    $parados += "tunel"
}
if ($pids.server) {
    Stop-Process -Id $pids.server -Force
    $parados += "servidor"
}
Remove-Item $pidFile -Force
if ($parados.Count -gt 0) {
    Write-Host ("Parado: " + ($parados -join " e ") + ".")
} else {
    Write-Host "Nada para parar."
}
