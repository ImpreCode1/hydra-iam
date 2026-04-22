#!/bin/sh
set -e

cd /app

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "Running migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed || true

echo "Starting application..."
exec node dist/src/main