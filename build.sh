#!/usr/bin/env bash
# build.sh — Build the website Docker image.
#
# Usage:
#   ./build.sh [DS_VERSION] [HASH] [SITE_URL] [GA_ID] [extra docker build args...]
#
# Examples:
#   ./build.sh                                                  # defaults: DS_VERSION=9.3.1, HASH=1, SITE_URL=http://localhost:3000, GA_ID unset
#   ./build.sh 9.3.1 2                                          # bump HASH to bust asset cache
#   ./build.sh 9.3.0 1                                          # upgrade to a new DocumentServer version
#   ./build.sh 9.3.1 1 https://office.example.com               # bake in your real domain (sitemap/robots/OG/canonical)
#   ./build.sh 9.3.1 1 https://office.example.com G-XXXXXXXXXX  # optionally enable Google Analytics
#   ./build.sh 9.3.1 1 https://office.example.com "" --no-cache
#   ./build.sh 9.3.1 1 https://office.example.com "" --push --tag my-registry/rakko-office:latest

set -euo pipefail

DS_VERSION="${1:-9.3.1}"
HASH="${2:-1}"
SITE_URL="${3:-http://localhost:3000}"
GA_ID="${4:-}"
# Discard only as many positional args as were actually supplied (min($#, 4)),
# so calling with fewer args (e.g. the documented `./build.sh 9.3.1 2` form)
# doesn't leak DS_VERSION/HASH/SITE_URL/GA_ID into the docker build args below.
shift "$(( $# < 4 ? $# : 4 ))" 2>/dev/null || true   # remaining args forwarded to docker build

echo "→ DocumentServer version : ${DS_VERSION}"
echo "→ Hash / revision        : ${HASH}"
echo "→ Asset directory        : /v${DS_VERSION}-${HASH}"
echo "→ Site URL               : ${SITE_URL}"
echo "→ Google Analytics ID    : ${GA_ID:-<disabled>}"

docker build \
  --build-arg "DS_VERSION=${DS_VERSION}" \
  --build-arg "HASH=${HASH}" \
  --build-arg "SITE_URL=${SITE_URL}" \
  --build-arg "GA_ID=${GA_ID}" \
  --tag "rakko-office:latest" \
  --tag "rakko-office:${DS_VERSION}-${HASH}" \
  "$@" \
  .

echo ""
echo "✓ Build complete."
echo "  Image tags:"
echo "    rakko-office:latest"
echo "    rakko-office:${DS_VERSION}-${HASH}"
echo ""
echo "  Run with:"
echo "    docker run -p 80:80 rakko-office:latest"
