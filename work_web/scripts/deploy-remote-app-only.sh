#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GIT_ROOT="$(cd "$ROOT_DIR/.." && pwd)"
REMOTE_HOST="${REMOTE_HOST:-47.102.131.206}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_PORT="${REMOTE_PORT:-22}"
REMOTE_DIR="${REMOTE_DIR:-/opt/personal-task-board/work_web}"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/id_ed25519_personal_task_board_ecs_temp}"
IMAGE_NAME="${IMAGE_NAME:-personal-task-board-app}"
GIT_SHA="$(git -C "$GIT_ROOT" rev-parse --short HEAD)"
IMAGE_TAG="${IMAGE_TAG:-git-$GIT_SHA}"
FULL_IMAGE="$IMAGE_NAME:$IMAGE_TAG"

ensure_local_docker() {
  if docker info >/dev/null 2>&1; then
    return 0
  fi

  if command -v colima >/dev/null 2>&1; then
    echo "Local Docker is not running. Starting Colima..."
    colima start
    docker info >/dev/null 2>&1
    return 0
  fi

  echo "Docker daemon is not available locally." >&2
  echo "Please start Docker Desktop or Colima, then retry." >&2
  exit 1
}

ssh_remote() {
  ssh -i "$SSH_KEY_PATH" -p "$REMOTE_PORT" \
    -o BatchMode=yes \
    -o ConnectTimeout=15 \
    "$REMOTE_USER@$REMOTE_HOST" "$@"
}

ensure_local_docker

echo "Building local image: $FULL_IMAGE"
docker build -t "$FULL_IMAGE" -f "$ROOT_DIR/Dockerfile" "$ROOT_DIR"

echo "Syncing repository on server..."
ssh_remote "cd '$REMOTE_DIR' && git fetch origin main && git pull --ff-only origin main"

echo "Streaming image to server..."
docker save "$FULL_IMAGE" | gzip | ssh -i "$SSH_KEY_PATH" -p "$REMOTE_PORT" \
  -o BatchMode=yes \
  -o ConnectTimeout=15 \
  "$REMOTE_USER@$REMOTE_HOST" "gunzip | docker load"

echo "Updating server app only (database untouched)..."
ssh_remote "
  set -e
  cd '$REMOTE_DIR'
  if grep -q '^APP_IMAGE=' .env.production; then
    sed -i 's#^APP_IMAGE=.*#APP_IMAGE=$FULL_IMAGE#' .env.production
  else
    printf '\nAPP_IMAGE=%s\n' '$FULL_IMAGE' >> .env.production
  fi
  docker compose --env-file .env.production -f docker-compose.prod.yml -f docker-compose.ecs.yml -f docker-compose.external-proxy.yml up -d --no-deps --no-build app
  docker compose --env-file .env.production -f docker-compose.prod.yml -f docker-compose.ecs.yml -f docker-compose.external-proxy.yml ps
"

echo "Remote deploy completed with image: $FULL_IMAGE"
