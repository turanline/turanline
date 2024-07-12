import enum

from django.db import models


class ImportHeaders(enum.Enum):
    name = 'name'
    description = 'description'
    type = 'type'
    category = 'category'
    subTypes = 'subTypes'
    size = 'size'
    amount = 'amount'
    color = 'color'
    compound = 'compound'
    brand = 'brand'
    season = 'season'
    pattern = 'pattern'
    manufacturerCountry = 'manufacturerCountry'
    price = 'price'
    first_image = 'first_image'
    second_image = 'second_image'
    third_image = 'third_image'
    fourth_image = 'fourth_image'
    fifth_image = 'fifth_image'


class ExportHeaders(enum.Enum):
    article_number = 'Артикул'
    name = 'Название'
    description = 'Описание'
    subTypes = 'Подкатегория'
    size = 'Размер'
    amount = 'Кол-во'
    color = 'Код цвета'
    compound = 'Состав'
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
