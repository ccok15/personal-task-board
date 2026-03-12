#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-3011}"
HOST="${HOST:-127.0.0.1}"
PID_FILE="$ROOT_DIR/.next/local-dev-$PORT.pid"
LOG_FILE="$ROOT_DIR/.next/local-dev-$PORT.log"

mkdir -p "$ROOT_DIR/.next"

if [[ -f "$PID_FILE" ]]; then
  EXISTING_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "$EXISTING_PID" ]] && kill -0 "$EXISTING_PID" 2>/dev/null; then
    echo "Local dev server is already running:"
    echo "  PID: $EXISTING_PID"
    echo "  URL: http://$HOST:$PORT"
    echo "  Log: $LOG_FILE"
    exit 0
  fi
  rm -f "$PID_FILE"
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT is already in use. Please free it or choose another PORT."
  exit 1
fi

cd "$ROOT_DIR"
: >"$LOG_FILE"
nohup script -q /dev/null zsh -lc "cd '$ROOT_DIR' && pnpm exec next dev --hostname '$HOST' --port '$PORT' >> '$LOG_FILE' 2>&1" >/dev/null 2>&1 < /dev/null &
SERVER_PID=$!
echo "$SERVER_PID" >"$PID_FILE"

for _ in {1..30}; do
  if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1 && curl --silent --max-time 5 "http://$HOST:$PORT" >/dev/null 2>&1; then
    echo "Local dev server started:"
    echo "  PID: $SERVER_PID"
    echo "  URL: http://$HOST:$PORT"
    echo "  Log: $LOG_FILE"
    exit 0
  fi

  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "Local dev server exited unexpectedly. Recent log:"
    tail -n 60 "$LOG_FILE" 2>/dev/null || true
    rm -f "$PID_FILE"
    exit 1
  fi

  sleep 1
done

echo "Local dev server did not become ready in time. Recent log:"
tail -n 60 "$LOG_FILE" 2>/dev/null || true
exit 1
