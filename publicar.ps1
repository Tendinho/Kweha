param([switch]$NoBrowser)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$arch = if ($env:PROCESSOR_ARCHITECTURE -eq "ARM64") { "arm64" } else { "amd64" }
$cloudflared = Join-Path $PSScriptRoot "cloudflared.exe"

if (-not (Test-Path $cloudflared)) {
    Write-Host "A transferir o Cloudflare Tunnel (so da primeira vez)..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-$arch.exe" -OutFile $cloudflared
}

$envFile = Join-Path $PSScriptRoot ".env"
$settings = @{}
if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile) {
        if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
            $settings[$matches[1]] = $matches[2].Trim().Trim('"').Trim("'")
        }
    }
}

$port = if ($settings["PORT"]) { $settings["PORT"] } else { "8000" }
$targetHost = if ($settings["HOST"] -and $settings["HOST"] -notin @("0.0.0.0", "::")) { $settings["HOST"] } else { "127.0.0.1" }
$baseUrl = "http://${targetHost}:${port}"

$alreadyRunning = $false
try {
    Invoke-RestMethod -Uri "$baseUrl/api/health" -TimeoutSec 2 | Out-Null
    $alreadyRunning = $true
} catch {
    $alreadyRunning = $false
}

$server = $null
if ($alreadyRunning) {
    Write-Host "O servidor Kweha ja esta a correr em $baseUrl." -ForegroundColor Cyan
} else {
    $node = (Get-Command node -ErrorAction SilentlyContinue).Source
    if (-not $node) {
        Write-Host "Node.js nao encontrado. Instala o Node.js 24 e tenta outra vez." -ForegroundColor Red
        exit 1
    }

    $env:COOKIE_SECURE = "1"
    $server = Start-Process -FilePath $node -ArgumentList @("--env-file-if-exists=.env", "server/server.js") -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Hidden
    Start-Sleep -Seconds 2

    if ($server.HasExited) {
        throw "O servidor Kweha nao arrancou. Corre 'npm start' para ver o erro."
    }
}

$log = Join-Path $env:TEMP ("kweha-cloudflared-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".log")
$tunnel = Start-Process -FilePath $cloudflared -ArgumentList @("tunnel", "--url", $baseUrl, "--logfile", $log, "--loglevel", "info") -PassThru -WindowStyle Hidden

$pidFile = Join-Path $PSScriptRoot ".publicar.pid"
$state = @{ tunnel = $tunnel.Id }
if ($server) {
    $state["server"] = $server.Id
}
$state | ConvertTo-Json | Set-Content -Path $pidFile

$publicUrl = $null
for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Milliseconds 500
    if (Test-Path $log) {
        $text = Get-Content $log -Raw -ErrorAction SilentlyContinue
        if ($text -match "https://[a-z0-9-]+\.trycloudflare\.com") {
            $publicUrl = $Matches[0]
            break
        }
    }
}

Write-Host ""
if ($publicUrl) {
    Write-Host "LINK PUBLICO: $publicUrl" -ForegroundColor Green
    Write-Host "Partilha este link com os outros jogadores." -ForegroundColor Yellow
    Write-Host "Mantem esta janela aberta enquanto jogam." -ForegroundColor Yellow
    if (-not $NoBrowser) {
        Start-Process $publicUrl
    }
} else {
    Write-Host "Nao encontrei o link do tunel. Consulta o log: $log" -ForegroundColor Red
}

Write-Host ""
Write-Host "Para terminar, fecha esta janela ou executa parar-publicar.bat." -ForegroundColor Cyan

try {
    Wait-Process -Id $tunnel.Id -ErrorAction Stop
} finally {
    Stop-Process -Id $tunnel.Id -Force -ErrorAction SilentlyContinue
    if ($server) {
        Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
    }
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}
