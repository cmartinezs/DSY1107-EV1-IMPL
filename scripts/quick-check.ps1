$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$ApiDir = Join-Path $Root "api"

function Require-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Falta dependencia requerida: $Name"
    }
}

function Invoke-MavenWrapper {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)

    $cmd = Join-Path $ApiDir "mvnw.cmd"
    $sh = Join-Path $ApiDir "mvnw"

    if (Test-Path $cmd) {
        & $cmd @Args
    } elseif ((Test-Path $sh) -and (Get-Command bash -ErrorAction SilentlyContinue)) {
        & bash $sh @Args
    } elseif (Get-Command mvn -ErrorAction SilentlyContinue) {
        Write-Warning "api/mvnw no existe; usando Maven global como fallback."
        & mvn @Args
    } else {
        throw "No existe Maven Wrapper en api/ ni Maven global."
    }

    if ($LASTEXITCODE -ne 0) {
        throw "Maven Wrapper finalizó con código $LASTEXITCODE"
    }
}

Write-Host "== AulaTrack quick check =="
Require-Command java
Require-Command node
Require-Command npm

java -version
Invoke-MavenWrapper -Args @("-version")
node --version
npm --version

Write-Host "`n[1/3] Backend: Maven Wrapper tests + package"
Push-Location $ApiDir
try {
    Invoke-MavenWrapper -Args @("-q", "test")
    Invoke-MavenWrapper -Args @("-q", "-DskipTests", "package")
} finally {
    Pop-Location
}

Write-Host "`n[2/3] React: install + build"
Push-Location "$Root/webapp-react"
try {
    npm install --no-audit --no-fund
    npm run build
} finally {
    Pop-Location
}

Write-Host "`n[3/3] Angular: install + build"
Push-Location "$Root/webapp-ng"
try {
    npm install --no-audit --no-fund
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
