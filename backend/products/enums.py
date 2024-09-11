import enum

from django.db import models


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
    material = 'material'
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
    pattern = 'Узор'
    mold = 'Лекало'
    material = 'Материал'
    weight = 'Вес товара'
    season = 'Сезон'
    price = 'Цена'
    manufacturerCountry = 'Страна производства'
    provider = 'Поставщик'


class SeasonChoices(models.TextChoices):
    SUMMER = 'Summer', 'Summer'
    AUTUMN = 'Autumn', 'Autumn'
    WINTER = 'Winter', 'Winter'
    SPRING = 'Spring', 'Spring'
    DEMI_SEASON = 'Demi-season', 'Demi-season'


class MoldChoices(models.TextChoices):
    OVERSIZE = 'Oversize', 'Oversize'
    SLIM = 'Slim', 'Slim'
    SKINNY = 'Skinny', 'Skinny'
    NORMAL = 'Normal', 'Normal'
    NO_MOLD = 'No-mold', 'No-mold'


class MaterialChoices(models.TextChoices):
    COTTON = 'Cotton', 'Cotton'
    POLYESTER = 'Polyester', 'Polyester'
    WOOL = 'Wool', 'Wool'
    SILK = 'Silk', 'Silk'
    LINEN = 'Linen', 'Linen'


class ProductStatus(models.TextChoices):
    ACTIVE = 'A', 'Active'
    BIN = 'B', 'Bin'
    ARCHIVE = 'AR', 'Archive'
