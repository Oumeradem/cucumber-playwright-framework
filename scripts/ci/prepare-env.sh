#!/usr/bin/env bash
# =============================================================================
# prepare-env.sh - Generates a local `.env` from CI-provided environment
# variables so the framework configuration layer reads consistent values
# without ever committing real credentials to the repository.
#
# CI systems set these variables (e.g. as secrets/vars):
#   ENV, BASE_URL, BROWSER, HEADLESS, TIMEOUT, WORKERS, TRACE, SCREENSHOT,
#   VIDEO, USERNAME, PASSWORD, API_BASE_URL
#
# Only variables that are non-empty are written to `.env`; everything else
# falls back to the framework defaults in src/config/config.ts.
#
# Usage: bash scripts/ci/prepare-env.sh
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")/../.."

ENV_FILE=".env"
: > "${ENV_FILE}"

write_var() {
  local name="$1"
  local value="${!name:-}"
  if [[ -n "${value}" ]]; then
    printf '%s=%s\n' "${name}" "${value}" >> "${ENV_FILE}"
  fi
}

for var in ENV BASE_URL BROWSER HEADLESS TIMEOUT WORKERS TRACE SCREENSHOT VIDEO USERNAME PASSWORD API_BASE_URL; do
  write_var "${var}"
done

if [[ ! -s "${ENV_FILE}" ]]; then
  cp .env.example "${ENV_FILE}"
  echo "[prepare-env] no CI variables provided - copied .env.example to .env"
else
  echo "[prepare-env] wrote .env from CI variables (secret values redacted)"
fi
