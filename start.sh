#!/usr/bin/env bash
# Script adaptado para funcionar en Git Bash (Windows) y Linux
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

print_usage() {
  cat <<EOF
Uso: ./start.sh [all|backend|frontend]
EOF
}

run_backend() {
  echo "Iniciando backend..."
  cd "$ROOT_DIR/backend" && npm run dev
}

run_frontend() {
  echo "Iniciando frontend..."
  cd "$ROOT_DIR/frontend" && npm run dev -- --open
}

MODE="${1:-all}"

case "$MODE" in
  all)
    run_backend &
    run_frontend &
    wait
    ;;
  backend) run_backend ;;
  frontend) run_frontend ;;
  *) print_usage; exit 1 ;;
esac
