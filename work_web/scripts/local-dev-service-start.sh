#!/usr/bin/env bash

set -euo pipefail

LABEL="com.lsl.work-web.local"
launchctl kickstart -k "gui/$(id -u)/$LABEL"
echo "Started LaunchAgent: $LABEL"
