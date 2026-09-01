#!/usr/bin/env bash
set -euo pipefail

check() {
  local name="$1"
  local url="$2"
  echo "[CHECK] $name -> $url"
  curl --fail --silent --show-error --max-time 10 "$url" >/dev/null
  echo "[OK] $name"
}

command -v curl >/dev/null 2>&1 || { echo "[ERROR] curl es requerido" >&2; exit 1; }

echo "== AulaTrack runtime smoke check =="
check "API pública" "http://localhost:8080/public/info"
check "API cursos" "http://localhost:8080/api/courses"
check "React" "http://localhost:5173"
check "Angular" "http://localhost:4200"

echo
 echo "[OK] Stack local respondiendo."
