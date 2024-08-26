import enum

from django.db import models
from django.utils.translation import gettext_lazy as _


class ImportHeaders(enum.Enum):
    name = 'name'
    description = 'description'
    category = 'category'
    category_child = 'category_child'
    category_subchild = 'category_subchild'
    sizes = 'sizes'
    color = 'color'
    compound = 'compound'
    mold = 'mold'
    weight = 'weight'
    season = 'season'
    pattern = 'pattern'
    manufacturerCountry = 'manufacturerCountry'
    price = 'price'


class ExportHeaders(enum.Enum):
    article_number = 'Артикул'
    name = 'Название'
    description = 'Описание'
    category = 'Подкатегория'
    color = 'Цвет'
    compound = 'Состав'
    mold = 'Лекало'
    weight = 'Вес товара'
    season = 'Сезон'
    pattern = 'Узор'
    price = 'Цена'
    manufacturerCountry = 'Страна производства'
    provider = 'Поставщик'


class SeasonChoices(models.TextChoices):
    SUMMER = 'Summer', _('Summer')
    AUTUMN = 'Autumn', _('Autumn')
    WINTER = 'Winter', _('Winter')
    SPRING = 'Spring', _('Spring')
    DEMI_SEASON = 'Demi-season', _('Demi-season')


class MoldChoices(models.TextChoices):
    OVERSIZE = 'Oversize', _('Oversize')
    SLIM = 'Slim', _('Slim')
    SKINNY = 'Skinny', _('Skinny')
    NORMAL = 'Normal', _('Normal')
    NO_MOLD = 'No-mold', _('No-mold')


class ProductStatus(models.TextChoices):
    ACTIVE = 'A', 'Active'
    BIN = 'B', 'Bin'
    ARCHIVE = 'AR', 'Archive'
