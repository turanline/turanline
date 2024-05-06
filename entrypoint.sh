#!/bin/sh

poetry run python3 manage.py collectstatic --noinput --force
poetry run python3 manage.py makemigrations --noinput
poetry run python3 manage.py migrate --noinput
poetry run gunicorn --bind 0.0.0.0:8000 mssite.wsgi:application --log-level info