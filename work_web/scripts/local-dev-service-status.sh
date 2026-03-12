#!/usr/bin/env bash

set -euo pipefail

LABEL="com.lsl.work-web.local"
launchctl print "gui/$(id -u)/$LABEL"
