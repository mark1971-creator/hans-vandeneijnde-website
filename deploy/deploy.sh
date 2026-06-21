#!/usr/bin/env bash
set -euo pipefail

# Build and deploy static export on the VPS.
# Usage (on server):
#   ./deploy/deploy.sh /var/www/hans-portfolio
#
# Prerequisites: Node.js 20+, npm, git, nginx

APP_DIR="${1:-/var/www/hans-portfolio}"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Building in $REPO_DIR"
cd "$REPO_DIR"

export NODE_ENV=production
npm ci
npm run build

echo "==> Publishing static export to $APP_DIR/out"
mkdir -p "$APP_DIR"
rsync -a --delete "$REPO_DIR/out/" "$APP_DIR/out/"

echo "==> Done. Ensure nginx root points to: $APP_DIR/out"
echo "    sudo nginx -t && sudo systemctl reload nginx"
