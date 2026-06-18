#!/bin/bash
set -e

echo "[start] Running DB migrations..."
node scripts/migrate-db.mjs

echo "[start] Starting Next.js server..."
exec node .next/standalone/server.js
