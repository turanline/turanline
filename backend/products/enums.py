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
    weight = 'weight'
    brand = 'brand'
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
    weight = 'Вес товара'
    brand = 'Производитель'
    season = 'Сезон'
    pattern = 'Узор'
    price = 'Цена'
    manufacturerCountry = 'Страна производства'
    provider = 'Поставщик'


class SeasonChoices(models.TextChoices):
    SUMMER = 'S', 'Summer'
    WINTER = 'W', 'Winter'
    DEMI_SEASON = 'DS', 'Demi-season'
    ALL_SEASON = 'AS', 'All-season'


class ProductStatus(models.TextChoices):
    UNDER_CONSIDERATION = 'UC', 'Under consideration'
    REJECTED = 'R', 'Rejected'
    ACCEPTED = 'A', 'Accepted'
    BIN = 'B', 'Bin'
