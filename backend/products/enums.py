from django.db import models


rename_columns = {
    'Provider': 'provider',
    'Название': 'name',
    'Описание': 'description',
    'Тип': 'type',
    'Категория': 'category',
    'Подкатегория': 'subTypes',
    'Размер': 'size',
    'Кол-во': 'amount',
    'Код цвета': 'color',
    'Состав': 'compound',
    'Производитель': 'brand',
    'Сезон': 'season',
    'Узор': 'pattern',
    'Страна производства': 'manufacturerCountry',
    'Цена': 'price',
    'Первое фото': 'first_image',
    'Второе фото': 'second_image',
    'Третье фото': 'third_image',
    'Четвертое фото': 'fourth_image',
    'Пятое фото': 'fifth_image'
}


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
