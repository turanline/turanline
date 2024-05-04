FROM python:3.10.12-alpine

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY . .

RUN apk update && pip install --user poetry

ENV PATH="${PATH}:/root/.local/bin"

RUN poetry install
RUN chmod +x entrypoint.sh
