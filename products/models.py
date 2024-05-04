from django.db import models
from slugify import slugify
from .validators import validate_positive_number


class Color(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True,
    )

    class Meta:
        verbose_name = "Product color"
        verbose_name_plural = "Product colors"
        ordering = ["-name"]

    def __str__(self) -> str:
        return f"{self.name} цвет"


class Brand(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True,
    )

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Product brand"
        verbose_name_plural = "Product brands"
        ordering = ["-name"]


def category_upload_to(instance, filename):
    return "/".join(["products-category", str(instance.name), filename])


class Category(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True,
    )
    image = models.ImageField(
        upload_to=category_upload_to,
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return f"Категория: {self.name}"

    class Meta:
        verbose_name = "Product category"
        verbose_name_plural = "Product categories"
        ordering = ["-name"]


class ProductType(models.Model):
    name = models.CharField(
        max_length=255,
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        return f"Тип: {self.name} [Категория: {self.category.name}]"

    class Meta:
        verbose_name = "Product type"
        verbose_name_plural = "Product types"
        ordering = ["-name"]
        unique_together = ("name", "category")


class ProductSubType(models.Model):
    name = models.CharField(
        max_length=255,
    )
    type = models.ForeignKey(
        ProductType,
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        return f"Подкатегория: {self.name} [Тип: {self.type.name} Категория: {self.type.category.name}]"

    class Meta:
        verbose_name = "Product subtype"
        verbose_name_plural = "Product subtypes"
        ordering = ["-name"]
        unique_together = ("name", "type")


class ManufacturerCountry(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True,
    )

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Product manufacturer country"
        verbose_name_plural = "Product manufacturer countries"
        ordering = ["-name"]


class Size(models.Model):
    name = models.CharField(
        max_length=10,
        unique=True,
    )

    def __str__(self) -> str:
        return f"{self.name} size"

    class Meta:
        verbose_name = "Product size"
        verbose_name_plural = "Product sizes"


def products_upload_to(instance, filename):
    return "/".join(["products-images", str(instance.name), filename])


class Product(models.Model):
    name = models.CharField(
        max_length=255,
    )
    description = models.TextField(
        null=True,
        blank=True,
    )
    image = models.ImageField(
        upload_to=products_upload_to,
        null=True,
        blank=True,
    )
    subTypes = models.ManyToManyField(
        ProductSubType,
    )
    brand = models.ForeignKey(
        Brand,
        on_delete=models.CASCADE,
        db_index=True,
    )
    vendor_code = models.CharField(max_length=9)
    amount = models.PositiveIntegerField()
    compound = models.CharField(
        max_length=1024,
        null=True,
        blank=True,
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            validate_positive_number,
        ],
        db_index=True,
    )
    season = models.CharField(
        max_length=50,
        null=True,
        blank=True,
    )
    pattern = models.CharField(
        max_length=50,
        null=True,
        blank=True,
    )
    color = models.ForeignKey(
        Color,
        on_delete=models.CASCADE,
        db_index=True,
    )
    manufacturerCountry = models.ForeignKey(
        ManufacturerCountry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    size = models.ForeignKey(
        Size,
        on_delete=models.CASCADE,
    )
    slug = models.SlugField(
        max_length=1024,
        unique=True,
        db_index=True,
        blank=True,
    )
    is_famous = models.BooleanField()

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(
            f"{str(self.vendor_code)}-{str(self.name)}-{str(self.color.name)}"
        )
        return super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ["-slug"]
