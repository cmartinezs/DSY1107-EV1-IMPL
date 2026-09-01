#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API_DIR="$ROOT_DIR/api"

require() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[ERROR] Falta dependencia requerida: $1" >&2
    exit 1
  fi
}

mvnw() {
  if [[ -x "$API_DIR/mvnw" ]]; then
    "$API_DIR/mvnw" "$@"
  elif [[ -f "$API_DIR/mvnw" ]]; then
    sh "$API_DIR/mvnw" "$@"
  elif command -v mvn >/dev/null 2>&1; then
    echo "[WARN] api/mvnw no existe; usando Maven global como fallback." >&2
    mvn "$@"
  else
    echo "[ERROR] No existe api/mvnw ni Maven global." >&2
    exit 1
  fi
}

echo "== AulaTrack quick check =="
require java
require node
require npm

java -version
mvnw -version
node --version
npm --version

echo
echo "[1/3] Backend: Maven Wrapper tests + package"
(
  cd "$API_DIR"
  mvnw -q test
  mvnw -q -DskipTests package
)

echo
echo "[2/3] React: install + build"
(
  cd "$ROOT_DIR/webapp-react"
  npm install --no-audit --no-fund
  npm run build
)

echo
echo "[3/3] Angular: install + build"
(
  cd "$ROOT_DIR/webapp-ng"
  npm install --no-audit --no-fund
  npm run build
)

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  echo
  echo "[extra] Docker Compose: validando configuración"
  (
    cd "$ROOT_DIR"
    SUPABASE_DB_URL='jdbc:postgresql://example.invalid:5432/postgres?user=test&password=test&sslmode=require' docker compose config --quiet
  )
else
  echo
  echo "[INFO] Docker Compose no disponible; se omite validación de compose."
fi

echo
echo "[OK] Quick check completado."
