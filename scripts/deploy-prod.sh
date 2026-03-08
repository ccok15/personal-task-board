#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.production}"
COMPOSE_FILE="$ROOT_DIR/docker-compose.prod.yml"
EXTERNAL_PROXY_COMPOSE_FILE="$ROOT_DIR/docker-compose.external-proxy.yml"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing production env file: $ENV_FILE" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required on the server." >&2
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${POSTGRES_DB:?POSTGRES_DB is required}"

PROXY_MODE="${PROXY_MODE:-standalone}"
case "$PROXY_MODE" in
  standalone|external)
    ;;
  *)
    echo "Unsupported PROXY_MODE: $PROXY_MODE" >&2
    echo "Expected one of: standalone, external" >&2
    exit 1
    ;;
esac

COMPOSE_ARGS=(-f "$COMPOSE_FILE")
UP_SERVICES=(app proxy)

if [[ "$PROXY_MODE" == "external" ]]; then
  COMPOSE_ARGS+=(-f "$EXTERNAL_PROXY_COMPOSE_FILE")
  UP_SERVICES=(app)
fi

compose() {
  docker compose --env-file "$ENV_FILE" "${COMPOSE_ARGS[@]}" "$@"
}

CURRENT_REF="$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || echo "unknown")"
echo "Deploying commit: $CURRENT_REF"
echo "Proxy mode: $PROXY_MODE"

compose build app
compose up -d db

echo "Waiting for PostgreSQL..."
for attempt in $(seq 1 30); do
  if compose exec -T db pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; then
    break
  fi

  if [[ "$attempt" -eq 30 ]]; then
    echo "PostgreSQL did not become ready in time." >&2
    exit 1
  fi

  sleep 2
done

compose run --rm --no-deps app pnpm prisma:migrate:deploy
compose run --rm --no-deps app pnpm prisma:seed
compose up -d "${UP_SERVICES[@]}"
compose ps
