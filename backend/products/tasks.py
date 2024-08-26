import logging

from celery import shared_task
from django.core.files.base import ContentFile
from import_export import exceptions
from tablib import Dataset

from providers import models as provider_models

from . import enums, models, resources

logger = logging.getLogger(__name__)


@shared_task
def import_products_task(
    file_data: bytes,
    provider_id: int
) -> None:
    try:
        product_resource = resources.ProductsResource(
            provider_id=provider_id
        )
        dataset = Dataset(
            headers=[item.value for item in enums.ImportHeaders]
        )

        for item in Dataset().load(file_data):
            dataset.append(item)

        result = product_resource.import_data(
            dataset,
            dry_run=True,
            raise_errors=True
        )
        if result.has_errors():
            raise exceptions.ImportError

        product_resource.import_data(dataset, dry_run=False)
    except exceptions.ImportError as error:
        logger.error(f'Celery task error: {error}')


@shared_task
def export_products_task(
    provider_id: int,
    language_code: str
) -> None:
    provider = provider_models.Provider.objects.get(
        user_id=provider_id
    )
    queryset = models.ProductTranslation.objects.select_related(
        'master'
    ).filter(
        master__provider=provider,
        language_code=language_code
    )
    dataset = resources.ExportProductsResource().export(queryset)
    dataset.headers = [item.value for item in enums.ExportHeaders]
    content_file = ContentFile(
        dataset.export('xlsx'),
        name=f'{provider.company}_products.xlsx'
    )
    provider.last_downloaded_file.save(content_file)
