#!/bin/sh
# wait-for-postgres.sh
set -e

host="postgres"
port="5432"

echo "Waiting for Postgres at $host:$port..."

until pg_isready -h "$host" -p "$port" -U "$user"; do
  sleep 1
done
echo "Postgres is up!"