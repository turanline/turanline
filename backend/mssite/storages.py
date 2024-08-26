import os
from urllib.parse import urljoin

from django.conf import settings
from django.core.files.storage import FileSystemStorage


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name: str) -> str:
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name

    def url(self, name: str) -> str:
        relative_url = super().url(name)
        return urljoin(settings.MEDIA_URL, relative_url)
