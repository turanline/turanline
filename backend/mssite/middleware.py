import logging
from typing import Callable

from django.http import HttpRequest, HttpResponse

logger = logging.getLogger(__name__)


class Process500Error:
    def __init__(
        self,
        get_response: Callable[
            [HttpRequest],
            HttpResponse
        ]
    ) -> None:
        self._get_response = get_response

    def __call__(
        self,
        request: HttpRequest
    ) -> HttpResponse:
        return self._get_response(request)

    def process_exception(
        self,
        request: HttpRequest,
        exception: Exception
    ) -> None:
        logger.error(exception)

