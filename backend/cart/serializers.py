from rest_framework.serializers import ModelSerializer, ValidationError

from .models import OrderProduct, Order
from products.serializers import ProductSerializer
from products.models import Product


class CartProductReadSerializer(ModelSerializer):
    """Сериализатор чтения модели объекта корзины."""

    product = ProductSerializer(read_only=True)

    class Meta:
        """Включение всех полей исходной модели."""

        model = OrderProduct
        fields = '__all__'


class CartProductSerializer(ModelSerializer):
    """Модель объекта корзины."""

    class Meta:
        """Включены поля amount, product исходной модели."""

        model = OrderProduct
        fields = (
            'amount',
            'product',
        )

    def __base_validate_amount(self,
                               max_amount,
                               current_amount,
                               instance=None):
        if current_amount > max_amount:
            raise ValidationError(detail='Too much product in cart')
        if not current_amount and instance:
            instance.delete()
            return instance
        elif not current_amount:
            raise ValidationError(detail='Couldnt create empty item in cart')

    def update(self, instance, validated_data):
        """Обновление объекта корзины."""
        product = Product.objects.get(pk=instance.product.pk)
        max_amount = product.amount
        validate_result = self.__base_validate_amount(
            max_amount, validated_data['amount'], instance
        )
        if validate_result:
            return validate_result
        return super().update(instance, validated_data)

    def create(self, validated_data, order):
        """Создание объекта корзины."""
        max_amount = Product.objects.get(
            pk=validated_data['product'].pk
        ).amount
        self.__base_validate_amount(
            max_amount,
            validated_data['amount']
        )
        return OrderProduct.objects.create(**validated_data, order=order)


class OrderSerializer(ModelSerializer):
    """Сериализатор для модели заказов."""

    order_products = CartProductReadSerializer(many=True, read_only=True)

    class Meta:
        """Включены все поля исходной модели."""

        model = Order
        fields = '__all__'
