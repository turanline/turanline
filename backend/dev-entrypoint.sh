#!/bin/sh
poetry install
# Collect static files (optional for development)
poetry run python3 manage.py collectstatic --noinput --force

# Make migrations and migrate database
poetry run python3 manage.py makemigrations --noinput
poetry run python3 manage.py migrate --noinput

# Start the Django development server on 0.0.0.0:8000
poetry run python3 manage.py runserver 0.0.0.0:8000
