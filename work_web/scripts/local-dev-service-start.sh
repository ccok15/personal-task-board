#!/usr/bin/env bash

set -euo pipefail

LABEL="com.lsl.work-web.local"
PLIST_PATH="$HOME/Library/LaunchAgents/$LABEL.plist"
DOMAIN="gui/$(id -u)"

if ! launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1; then
  if [[ ! -f "$PLIST_PATH" ]]; then
    echo "LaunchAgent plist not found: $PLIST_PATH"
    echo "Run: pnpm local:service:install"
    exit 1
  fi

  launchctl bootstrap "$DOMAIN" "$PLIST_PATH"
fi

launchctl kickstart -k "$DOMAIN/$LABEL"
echo "Started LaunchAgent: $LABEL"
