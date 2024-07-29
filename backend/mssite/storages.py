import os

from django.conf import settings
from django.core.files.storage import FileSystemStorage

from urllib.parse import urljoin


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, *args, **kwargs):
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name

    def url(self, name):
        relative_url = super().url(name)
        return urljoin(settings.MEDIA_URL, relative_url)
