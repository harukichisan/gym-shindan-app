#!/usr/bin/env bash
set -euo pipefail

npx @stoplight/prism-cli mock docs/openapi.yaml -p 4010 --cors
