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
TARGET_PLATFORM="${TARGET_PLATFORM:-linux/amd64}"
GIT_SHA="$(git -C "$GIT_ROOT" rev-parse --short HEAD)"
IMAGE_TAG="${IMAGE_TAG:-git-$GIT_SHA}"
FULL_IMAGE="$IMAGE_NAME:$IMAGE_TAG"
TMP_TAR="${TMP_TAR:-/tmp/${IMAGE_NAME}-${IMAGE_TAG}.tar.gz}"

cleanup() {
  rm -f "$TMP_TAR"
}

trap cleanup EXIT

log_step() {
  printf '\n==> %s\n' "$1"
}

fail() {
  printf '\n[deploy:remote:app] %s\n' "$1" >&2
  exit 1
}

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

ensure_local_checks() {
  log_step "Running local checks"
  (
    cd "$ROOT_DIR"
    pnpm lint
    pnpm build
  )
}

ssh_remote() {
  ssh -i "$SSH_KEY_PATH" -p "$REMOTE_PORT" \
    -o BatchMode=yes \
    -o ConnectTimeout=15 \
    "$REMOTE_USER@$REMOTE_HOST" "$@"
}

scp_remote() {
  scp -i "$SSH_KEY_PATH" -P "$REMOTE_PORT" \
    -o BatchMode=yes \
    -o ConnectTimeout=15 \
    "$@"
}

show_remote_state() {
  log_step "Current remote state"
  ssh_remote "
    set -e
    cd '$REMOTE_DIR'
    printf 'remote git: '
    git rev-parse --short HEAD || true
    printf 'remote env image: '
    grep '^APP_IMAGE=' .env.production || echo 'APP_IMAGE not set'
    docker compose --env-file .env.production -f docker-compose.prod.yml -f docker-compose.ecs.yml -f docker-compose.external-proxy.yml ps
  "
}

verify_remote_app() {
  log_step "Verifying remote app"
  ssh_remote "
    set -e
    cd '$REMOTE_DIR'
    APP_DOMAIN=\$(grep '^APP_DOMAIN=' .env.production | cut -d= -f2- || true)
    curl -fsS http://127.0.0.1:3000/ >/dev/null
    if [ -n \"\$APP_DOMAIN\" ]; then
      curl -kfsSI \"https://\$APP_DOMAIN/login\" >/dev/null
    fi
    printf 'health check passed for image: %s\n' '$FULL_IMAGE'
  " || fail "Remote app health check failed."
}

ensure_local_docker
ensure_local_checks
show_remote_state

log_step "Build info"
echo "git sha: $GIT_SHA"
echo "target image platform: $TARGET_PLATFORM"
echo "image tag: $FULL_IMAGE"

log_step "Building local image"
docker buildx build --platform "$TARGET_PLATFORM" --load -t "$FULL_IMAGE" -f "$ROOT_DIR/Dockerfile" "$ROOT_DIR"

LOCAL_IMAGE_PLATFORM="$(docker image inspect --format '{{.Os}}/{{.Architecture}}' "$FULL_IMAGE")"
if [[ "$LOCAL_IMAGE_PLATFORM" != "$TARGET_PLATFORM" ]]; then
  fail "Built image platform mismatch: expected $TARGET_PLATFORM, got $LOCAL_IMAGE_PLATFORM"
fi

log_step "Syncing repository on server"
ssh_remote "cd '$REMOTE_DIR' && git fetch origin main && git pull --ff-only origin main"

log_step "Packaging image"
docker save "$FULL_IMAGE" | gzip > "$TMP_TAR"

log_step "Uploading image archive to server"
scp_remote "$TMP_TAR" "$REMOTE_USER@$REMOTE_HOST:/tmp/${IMAGE_NAME}-${IMAGE_TAG}.tar.gz"

log_step "Loading image and updating remote app only"
ssh_remote "
  set -e
  cd '$REMOTE_DIR'
  gunzip -c '/tmp/${IMAGE_NAME}-${IMAGE_TAG}.tar.gz' | docker load
  rm -f '/tmp/${IMAGE_NAME}-${IMAGE_TAG}.tar.gz'
  if grep -q '^APP_IMAGE=' .env.production; then
    sed -i 's#^APP_IMAGE=.*#APP_IMAGE=$FULL_IMAGE#' .env.production
  else
    printf '\nAPP_IMAGE=%s\n' '$FULL_IMAGE' >> .env.production
  fi
  docker compose --env-file .env.production -f docker-compose.prod.yml -f docker-compose.ecs.yml -f docker-compose.external-proxy.yml up -d --force-recreate --no-deps --no-build app
  docker compose --env-file .env.production -f docker-compose.prod.yml -f docker-compose.ecs.yml -f docker-compose.external-proxy.yml ps
"

verify_remote_app

log_step "Remote deploy completed"
echo "remote deploy completed with image: $FULL_IMAGE"
