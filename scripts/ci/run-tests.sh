#!/usr/bin/env bash
# =============================================================================
# run-tests.sh - Runs the Cucumber BDD suite for a tag filter and generates
# all reports (Cucumber HTML/JSON + Allure). Shared by GitHub Actions and
# Jenkins so CI behaviour stays identical across pipelines.
#
# Usage:
#   bash scripts/ci/run-tests.sh            # full suite
#   bash scripts/ci/run-tests.sh smoke      # --tags "@smoke"
#   bash scripts/ci/run-tests.sh regression # --tags "@regression"
#
# Requires: npm dependencies installed and the Playwright Chromium binary
# available (npx playwright install chromium).
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")/../.."

# Generate .env from CI-provided environment variables (no-op locally when
# .env already exists is NOT the behaviour - we always regenerate so CI values
# win over any accidentally committed .env).
bash scripts/ci/prepare-env.sh

TAG="${1:-all}"
case "${TAG}" in
  all)
    TAG_ARGS=()
    ;;
  smoke|sanity|critical|regression|wip)
    TAG_ARGS=(--tags "@${TAG}")
    ;;
  *)
    echo "[run-tests] unknown tag filter '${TAG}' (expected: all|smoke|sanity|critical|regression|wip)" >&2
    exit 2
    ;;
esac

echo "[run-tests] tag filter: @${TAG}"

# shellcheck disable=SC2068
npx cucumber-js "${TAG_ARGS[@]}"

echo "[run-tests] generating reports..."
npm run report:cucumber
npm run report:allure
echo "[run-tests] done."
