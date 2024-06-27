from django.db import models


rename_columns = {
    'Provider': 'provider',
    'Name of product': 'name',
    'Description of product': 'description',
    'Product subtypes': 'subTypes',
    'Brand': 'brand',
    'Serial number': 'article_number',
    'Quantity of product': 'amount',
    'Product composition': 'compound',
    'Price': 'price',
    'Season (Summer/Winter/Demi-season/All-season)': 'season',
    'Product pattern': 'pattern',
    'Color of product (HEX-format)': 'color',
    'Country of product manufacturer': 'manufacturerCountry',
    'Size': 'size',
    'Slug of product': 'slug'
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
