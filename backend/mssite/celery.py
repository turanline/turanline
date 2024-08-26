import os

from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mssite.settings')
app = Celery(
    'mssite',
    broker='redis://redis:6379',
    backend='redis://redis:6379'
)
app.autodiscover_tasks()
