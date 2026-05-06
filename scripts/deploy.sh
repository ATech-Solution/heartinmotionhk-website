#!/bin/bash
set -e

SERVER_USER="your_user"
SERVER_HOST="your_server_ip"
SERVER_PORT="22"
APP_DIR="/var/www/heartinmotionhk"

echo "Deploying heartinmotionhk to $SERVER_HOST..."

ssh -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
  set -e
  cd /var/www/heartinmotionhk

  echo "--- git pull ---"
  git pull origin dev

  echo "--- npm install ---"
  npm install --production=false

  echo "--- migrate ---"
  NODE_OPTIONS='--import tsx' npm run migrate

  echo "--- build ---"
  npm run build

  echo "--- pm2 restart ---"
  pm2 restart heartinmotionhk

  echo "--- Done ---"
  pm2 status
ENDSSH

echo "Deploy finished."
