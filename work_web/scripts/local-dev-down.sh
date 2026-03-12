#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-3011}"
PID_FILE="$ROOT_DIR/.next/local-dev-$PORT.pid"

if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "$PID" ]] && kill -0 "$PID" 2>/dev/null; then
    kill "$PID" 2>/dev/null || true
    sleep 1
    if kill -0 "$PID" 2>/dev/null; then
      kill -9 "$PID" 2>/dev/null || true
    fi
    echo "Stopped local dev server PID $PID"
  fi
  rm -f "$PID_FILE"
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  EXTRA_PIDS="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN | tr '\n' ' ')"
  if [[ -n "${EXTRA_PIDS// }" ]]; then
    kill $EXTRA_PIDS 2>/dev/null || true
    echo "Stopped listener(s) on port $PORT: $EXTRA_PIDS"
  fi
fi
