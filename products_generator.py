from faker import Faker
from products.models import (
    Product,
    Color,
    Size,
    Brand,
    ManufacturerCountry,
    ProductSubType,
)
import random

faker = Faker()


def generate_products(num):
    for _ in range(num):
        product = Product(
            name=faker.catch_phrase(),
            description=faker.text(),
            image=None,
            vendor_code=faker.random_number(digits=9),
            amount=faker.random_int(min=1, max=100),
            season=faker.month_name(),
            pattern=faker.random_element(
                elements=("solid", "striped", "checkered", "patterned")
            ),
            compound=faker.sentence(),
            price=faker.random_number(digits=5, fix_len=True),
            is_famous=faker.random.randrange(0, 1),
            color=Color.objects.order_by("?").first(),
            size=Size.objects.order_by("?").first(),
            brand=Brand.objects.order_by("?").first(),
            manufacturerCountry=ManufacturerCountry.objects.order_by("?").first(),
        )
        product.save()
        product.subTypes.add(
            *ProductSubType.objects.order_by("?")[: random.randint(1, 3)]
        )
