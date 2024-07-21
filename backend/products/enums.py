import enum

from django.db import models


class SizeRange(enum.Enum):
    size_xs = 'XS'
    size_s = 'S'
    size_m = 'M'
    size_l = 'L'
    size_xl = 'XL'
    size_2xl = '2XL'
    size_3xl = '3XL'
    size_4xl = '4XL'
    size_5xl = '5XL'
    size_6xl = '6XL'

class ImportHeaders(enum.Enum):
    name = 'name'
    description = 'description'
    category = 'category'
    category_child = 'category_child'
    category_subchild = 'category_subchild'
    amount = 'amount'
    size_xs = 'XS'
    size_s = 'S'
    size_m = 'M'
    size_l = 'L'
    size_xl = 'XL'
    size_2xl = '2XL'
    size_3xl = '3XL'
    size_4xl = '4XL'
    size_5xl = '5XL'
    size_6xl = '6XL'
    color = 'color'
    compound = 'compound'
    weight = 'weight'
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
    category = 'Подкатегория'
    amount = 'Кол-во'
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
