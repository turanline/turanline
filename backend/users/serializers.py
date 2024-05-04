from rest_framework.serializers import ModelSerializer, ValidationError

from products.models import Product
from products.serializers import ProductLightSerializer

from .models import Order, OrderProduct, Review, User


class ReviewSerializer(ModelSerializer):
    product = ProductLightSerializer(read_only=True)

    class Meta:
        model = Review
        fields = "__all__"


class LightReviewSerializer(ModelSerializer):
    class Meta:
        model = Review
        fields = ("text",)


class BaseUserSerializerConfig:
    def user_create(self, validated_data):
        user = User(**validated_data)
        self.user_set_password(user, validated_data)
        user.save()
        return user

    def user_set_password(self, instance, validated_data):
        try:
            password = validated_data.pop("password")
            instance.set_password(password)
        except KeyError:
            pass
        finally:
            return instance


class CustomerUserReadLoginSerializer(ModelSerializer):

    class Meta:
        model = User
        exclude = (
            "date_joined",
            "is_superuser",
            "is_active",
            "is_staff",
            "groups",
            "user_permissions",
            "last_login",
            "password",
        )


class CustomerUserLoginSerializer(ModelSerializer, BaseUserSerializerConfig):
    class Meta:
        model = User
        exclude = (
            "date_joined",
            "is_superuser",
            "is_active",
            "is_staff",
            "groups",
            "user_permissions",
            "last_login",
        )

    def update(self, instance: User, validated_data):
        instance = super().user_set_password(instance, validated_data)
        return super().update(instance, validated_data)

    def create(self, validated_data):
        return super().user_create(validated_data)


class StaffUserLoginSerializer(ModelSerializer, BaseUserSerializerConfig):
    class Meta:
        model = User
        exclude = (
            "date_joined",
            "last_login",
        )

    def update(self, instance: User, validated_data):
        instance = super().user_set_password(instance, validated_data)
        return super().update(instance, validated_data)

    def create(self, validated_data):
        return super().user_create(validated_data)


class CartProductReadSerializer(ModelSerializer):
    product = ProductLightSerializer(read_only=True)

    class Meta:
        model = OrderProduct
        fields = "__all__"


class CartProductSerializer(ModelSerializer):
    class Meta:
        model = OrderProduct
        fields = (
            "amount",
            "product",
        )

    def __base_validate_amount(self, max_amount, current_amount, instance=None):
        if current_amount > max_amount:
            raise ValidationError(detail="Too much product in cart")
        if not current_amount and instance:
            instance.delete()
            return instance
        elif not current_amount:
            raise ValidationError(detail="Couldn't create empty item in cart")

    def update(self, instance, validated_data):
        product = Product.objects.get(pk=instance.product.pk)
        max_amount = product.amount
        validate_result = self.__base_validate_amount(
            max_amount, validated_data["amount"], instance
        )
        if validate_result:
            return validate_result
        return super().update(instance, validated_data)

    def create(self, validated_data, order):
        max_amount = Product.objects.get(pk=validated_data["product"].pk).amount
        self.__base_validate_amount(max_amount, validated_data["amount"])
        return OrderProduct.objects.create(**validated_data, order=order)


class OrderSerializer(ModelSerializer):
    order_products = CartProductReadSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = "__all__"
