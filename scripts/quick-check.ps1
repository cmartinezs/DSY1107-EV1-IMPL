$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

function Require-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Falta dependencia requerida: $Name"
    }
}

Write-Host "== AulaTrack quick check =="
Require-Command java
Require-Command mvn
Require-Command node
Require-Command npm

java -version
mvn -version | Select-Object -First 1
node --version
npm --version

Write-Host "`n[1/3] Backend: tests + package"
Push-Location "$Root/api"
try {
    mvn -q test
    mvn -q -DskipTests package
} finally {
    Pop-Location
}

Write-Host "`n[2/3] React: install + build"
Push-Location "$Root/webapp-react"
try {
    if (-not (Test-Path node_modules)) {
        npm install --no-audit --no-fund
    }
    npm run build
} finally {
    Pop-Location
}

Write-Host "`n[3/3] Angular: install + build"
Push-Location "$Root/webapp-ng"
try {
    if (-not (Test-Path node_modules)) {
        npm install --no-audit --no-fund
    }
    npm run build
} finally {
    Pop-Location
}

if (Get-Command docker -ErrorAction SilentlyContinue) {
    try {
        docker compose version | Out-Null
        Write-Host "`n[extra] Docker Compose: validando configuración"
        Push-Location $Root
        try {
            $env:SUPABASE_DB_URL = "jdbc:postgresql://example.invalid:5432/postgres?user=test&password=test&sslmode=require"
            docker compose config --quiet
        } finally {
            Remove-Item Env:SUPABASE_DB_URL -ErrorAction SilentlyContinue
            Pop-Location
        }
    } catch {
        Write-Host "[INFO] Docker Compose no disponible; se omite validación de compose."
    }
} else {
    Write-Host "`n[INFO] Docker no disponible; se omite validación de compose."
}

Write-Host "`n[OK] Quick check completado."
