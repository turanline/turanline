from rest_framework.serializers import ModelSerializer

from .models import (Brand, Category, Color, ManufacturerCountry, Product,
                     ProductSubType, ProductType, Size)


class BrandSerializer(ModelSerializer):
    """Сериализатор для модели брендов продуктов."""

    class Meta:
        """Включены все поля исходной модели."""

        model = Brand
        fields = '__all__'


class SizeSerializer(ModelSerializer):
    """Сериализатор для модели размеров продуктов."""

    class Meta:
        """Включены все поля исходной модели."""

        model = Size
        fields = '__all__'


class ColorSerializer(ModelSerializer):
    """Сериализатор для модели цветов продуктов."""

    class Meta:
        """Включены все поля исходной модели."""

        model = Color
        fields = '__all__'


class ManufactoryCountrySerializer(ModelSerializer):
    """Сериализатор для модели стран производителей продуктов."""

    class Meta:
        """Включены все поля исходной модели."""

        model = ManufacturerCountry
        fields = '__all__'


class ProductSubTypeSerializer(ModelSerializer):
    """Сериализатор для модели подкатегорий продуктов."""

    class Meta:
        """Включены все поля исходной модели."""

        model = ProductSubType
        fields = '__all__'


class ProductUpdateSerializer(ModelSerializer):
    """Сериализатор обновления для модели продуктов."""

    class Meta:
        """Включены все поля исходной модели, кроме slug."""

        model = Product
        lookup_field = 'slug'
        exclude = ('slug',)


class ProductSerializer(ModelSerializer):
    """Сериализатор для модели продуктов."""

    brand = BrandSerializer()
    color = ColorSerializer()
    size = SizeSerializer()
    manufacturer_country = ManufactoryCountrySerializer()
    sub_types = ProductSubTypeSerializer(many=True)

    class Meta:
        """Включены все поля исходной модели. Введен поиск по slug."""

        model = Product
        lookup_field = 'slug'
        fields = '__all__'


class ProductLightSerializer(ModelSerializer):
    """Легкий сериализатор для модели продуктов."""

    class Meta:
        """Включены все поля исходной модели."""

        model = Product
        fields = '__all__'


class ProductTypeSerializer(ModelSerializer):
    """Сериализатор для модели типов продуктов."""

    class Meta:
        """Включены все поля исходной модели."""

        model = ProductType
        fields = '__all__'


class ProductCategoriesSerializer(ModelSerializer):
    """Сериализатор для модели категорий продуктов."""

    class Meta:
        """Включены все поля исходной модели."""

        model = Category
        fields = '__all__'
