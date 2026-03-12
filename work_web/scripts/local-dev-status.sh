#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-3011}"
HOST="${HOST:-127.0.0.1}"
PID_FILE="$ROOT_DIR/.next/local-dev-$PORT.pid"
LOG_FILE="$ROOT_DIR/.next/local-dev-$PORT.log"

if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "$PID" ]] && kill -0 "$PID" 2>/dev/null; then
    echo "Local dev server is running:"
    echo "  PID: $PID"
    echo "  URL: http://$HOST:$PORT"
    echo "  Log: $LOG_FILE"
    if curl --silent --max-time 5 "http://$HOST:$PORT" >/dev/null 2>&1; then
      echo "  Health: OK"
    else
      echo "  Health: process exists but HTTP check failed"
    fi
    exit 0
  fi
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT is listening, but no managed PID file was found."
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN
  exit 0
fi

echo "Local dev server is not running on http://$HOST:$PORT"
exit 1
