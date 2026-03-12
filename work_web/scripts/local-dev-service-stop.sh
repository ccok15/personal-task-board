#!/usr/bin/env bash

set -euo pipefail

PLIST_PATH="$HOME/Library/LaunchAgents/com.lsl.work-web.local.plist"
launchctl bootout "gui/$(id -u)" "$PLIST_PATH" >/dev/null 2>&1 || true
echo "Stopped LaunchAgent: com.lsl.work-web.local"
