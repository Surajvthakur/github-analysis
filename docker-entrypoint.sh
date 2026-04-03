#!/bin/sh
set -e
cd /app
if [ -f ./.env ]; then
  set -a
  . ./.env
  set +a
fi
exec "$@"
