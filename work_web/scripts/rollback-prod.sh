#!/usr/bin/env bash

set -Eeuo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: bash scripts/rollback-prod.sh <git-ref-or-tag>" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_REF="$1"

PREVIOUS_REF="$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || echo "unknown")"

git -C "$ROOT_DIR" fetch --all --tags
git -C "$ROOT_DIR" checkout "$TARGET_REF"

bash "$ROOT_DIR/scripts/deploy-prod.sh"

CURRENT_REF="$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || echo "unknown")"
echo "Rolled back from $PREVIOUS_REF to $CURRENT_REF"
