#!/bin/sh

poetry run celery -A mssite worker --loglevel=info --pool=solo
