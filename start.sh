#!/bin/bash
set -e

echo "[start] Running DB migrations..."
python3 scripts/migrate-db.py

echo "[start] Starting Next.js server..."
exec node .next/standalone/server.js
