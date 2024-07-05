import requests


class FileAccess:

    @staticmethod
    def get_downloaded_file(url_path: str):
        return requests.get(url_path).content
