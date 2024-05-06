FROM python:3.11
RUN pip install poetry
COPY . .
RUN poetry config virtualenvs.create false --local
RUN poetry install