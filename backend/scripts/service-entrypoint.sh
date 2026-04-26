#!/bin/sh
set -e

if [ -n "${DATABASE_URL}" ]; then
  python - <<'PY'
import os
import time

import psycopg

dsn = os.environ["DATABASE_URL"]

for attempt in range(30):
    try:
        with psycopg.connect(dsn, connect_timeout=3):
            break
    except psycopg.OperationalError:
        if attempt == 29:
            raise
        time.sleep(2)
PY
fi

python manage.py migrate --noinput
python manage.py seed_data

exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:${PORT:-8000} \
  --workers ${GUNICORN_WORKERS:-2} \
  --timeout 120
