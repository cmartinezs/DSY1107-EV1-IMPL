#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

require() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[ERROR] Falta dependencia requerida: $1" >&2
    exit 1
  fi
}

echo "== AulaTrack quick check =="
require java
require mvn
require node
require npm

java -version
mvn -version | head -n 1
node --version
npm --version

echo
echo "[1/3] Backend: tests + package"
(
  cd "$ROOT_DIR/api"
  mvn -q test
  mvn -q -DskipTests package
)

echo
echo "[2/3] React: install + build"
(
  cd "$ROOT_DIR/webapp-react"
  if [[ ! -d node_modules ]]; then
    npm install --no-audit --no-fund
  fi
  npm run build
)

echo
echo "[3/3] Angular: install + build"
(
  cd "$ROOT_DIR/webapp-ng"
  if [[ ! -d node_modules ]]; then
    npm install --no-audit --no-fund
  fi
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
