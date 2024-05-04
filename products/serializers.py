from .models import (
    Product,
    Category,
    ProductType,
    ProductSubType,
    Brand,
    Color,
    Size,
    ManufacturerCountry,
)
from rest_framework.serializers import ModelSerializer


class BrandSerializer(ModelSerializer):
    class Meta:
        model = Brand
        fields = "__all__"


class SizeSerializer(ModelSerializer):
    class Meta:
        model = Size
        fields = "__all__"


class ColorSerializer(ModelSerializer):
    class Meta:
        model = Color
        fields = "__all__"


class ManufactoryCountrySerializer(ModelSerializer):
    class Meta:
        model = ManufacturerCountry
        fields = "__all__"


class ProductSubTypeSerializer(ModelSerializer):
    class Meta:
        model = ProductSubType
        fields = "__all__"


class ProductUpdateSerializer(ModelSerializer):
    class Meta:
        model = Product
        lookup_field = "slug"
        exclude = ("slug",)


class ProductSerializer(ModelSerializer):
    brand = BrandSerializer()
    color = ColorSerializer()
    size = SizeSerializer()
    manufacturerCountry = ManufactoryCountrySerializer()
    subTypes = ProductSubTypeSerializer(many=True)

    class Meta:
        model = Product
        lookup_field = "slug"
        fields = "__all__"


class ProductLightSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class ProductTypeSerializer(ModelSerializer):

    class Meta:
        model = ProductType
        fields = "__all__"


class ProductCategoriesSerializer(ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"
