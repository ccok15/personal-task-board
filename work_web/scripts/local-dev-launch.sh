#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

exec pnpm exec next dev --webpack --hostname 127.0.0.1 --port 3011
