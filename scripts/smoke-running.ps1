$ErrorActionPreference = "Stop"

function Check-Url([string]$Name, [string]$Url) {
    Write-Host "[CHECK] $Name -> $Url"
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 300) {
        throw "$Name respondió HTTP $($response.StatusCode)"
    }
    Write-Host "[OK] $Name"
}

Write-Host "== AulaTrack runtime smoke check =="
Check-Url "API pública" "http://localhost:8080/public/info"
Check-Url "API cursos" "http://localhost:8080/api/courses"
Check-Url "React" "http://localhost:5173"
Check-Url "Angular" "http://localhost:4200"

Write-Host "`n[OK] Stack local respondiendo."
