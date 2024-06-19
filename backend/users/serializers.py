import logging

from rest_framework.serializers import ModelSerializer, ValidationError

from products.models import Product
from products.serializers import ProductLightSerializer, ProductSerializer

from .models import (Order, OrderProduct, Review,
                     User, Appeal, Provider, Customer, SuperAdminNews,
                     BankAccountNumber)

logger = logging.getLogger(__name__)


class BankAccountNumberSerializer(ModelSerializer):
    "Сериализатор для модели банковского счета."

    class Meta:
        """Включены все поля исходной модели."""

        model = BankAccountNumber
        fields = '__all__'


class ReviewSerializer(ModelSerializer):
    """Сериализатор для модели обзоров продуктов."""

    product = ProductLightSerializer(read_only=True)

    class Meta:
        """Включены все поля исходной модели."""

        model = Review
        fields = '__all__'


class LightReviewSerializer(ModelSerializer):
    """Легкий сериализатор для модели обзоров продуктов."""

    class Meta:
        """Включено поле text исходной модели."""

        model = Review
        fields = ('text',)


class CustomerUserReadLoginSerializer(ModelSerializer):

    class Meta:
        model = User
        exclude = (
            'date_joined',
            'is_superuser',
            'is_active',
            'is_staff',
            'groups',
            'user_permissions',
            'last_login',
            'password',
        )


class CustomerUserLoginSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = (
            'date_joined',
            'is_superuser',
            'is_active',
            'is_staff',
            'groups',
            'user_permissions',
            'last_login',
        )

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        instance.set_password(password)
        return super().update(instance, validated_data)

    def create(self, validated_data):
        user = User(**validated_data)
        password = validated_data.pop('password')
        user.set_password(password)
        user.save()
        return user


class SuperAdminUsernameSerializer(ModelSerializer):
    class Meta:
        """Исключены поля date_joined, last_login исходной модели."""

        model = User
        fields = ('username',)


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


class AppealSerializer(ModelSerializer):
    """Сериализатор для модели обращений поставщиков."""

    class Meta:
        """Включены все поля исходной модели."""

        model = Appeal
        fields = '__all__'


class ProviderSerializer(ModelSerializer):
    user = CustomerUserLoginSerializer()
    bank_account_number = BankAccountNumberSerializer()

    class Meta:
        model = Provider
        fields = '__all__'

    def create(self, validated_data):
        try:
            user_data = validated_data.pop('user')
            bank_account_data = validated_data.pop('bank_account_number')

            print(user_data)

            user = User.objects.create(**user_data)
            user.set_password(user_data['password'])

            print(user)

            user.save()

            bank_account_number = BankAccountNumber.objects.create(
                **bank_account_data
            )

            provider = Provider.objects.create(
                user=user,
                bank_account_number=bank_account_number,
                **validated_data
            )
            return provider
        except Exception as e:
            logger.error(f"Error during Provider creation: {e}")
            raise e

    def update(self, instance, validated_data):
        try:
            user_data = validated_data.pop('user', None)
            bank_account_data = validated_data.pop('bank_account_number', None)

            if user_data:
                user = instance.user
                user.username = user_data.get('username', user.username)
                user.first_name = user_data.get('first_name', user.first_name)
                user.last_name = user_data.get('last_name', user.last_name)
                if 'password' in user_data:
                    user.set_password(user_data['password'])
                user.save()

            if bank_account_data:
                bank_account_number = instance.bank_account_number
                for attr, value in bank_account_data.items():
                    setattr(bank_account_number, attr, value)
                bank_account_number.save()

            instance = super().update(instance, validated_data)
            return instance
        except Exception as e:
            logger.error(f"Error during Provider update: {e}")
            raise e


class CustomerSerializer(ModelSerializer):
    user = CustomerUserLoginSerializer()

    class Meta:
        model = Customer
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        user.set_password(user.password)
        user.save()
        customer = Customer.objects.create(user=user, **validated_data)
        return customer

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user = instance.user
            user.username = user_data.get('username', user.username)
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            if 'password' in user_data:
                user.set_password(user_data['password'])
            user.save()

        instance = super().update(instance, validated_data)
        return instance


class SuperAdminNewsReadSerializer(ModelSerializer):

    author = SuperAdminUsernameSerializer()

    class Meta:
        model = SuperAdminNews
        fields = '__all__'


class SuperAdminNewsWriteSerializer(ModelSerializer):

    class Meta:
        model = SuperAdminNews
        exclude = ('author',)
