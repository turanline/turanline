from datetime import timedelta
import logging

from django.utils import timezone
from rest_framework import serializers

from . import models
from users import models as user_models
from users import serializers as user_serializers
from cart import models as cart_models
from cart import serializers as cart_serializers
from products import serializers as product_serializers
from product_components import serializers as product_components_serializers

logger = logging.getLogger(__name__)


class BankAccountNumberSerializer(serializers.ModelSerializer):
    "Сериализатор для модели банковского счета."

    class Meta:
        model = models.BankAccountNumber
        fields = '__all__'


class ProviderSerializer(serializers.ModelSerializer):
    user = user_serializers.UserLoginSerializer()
    bank_account_number = BankAccountNumberSerializer()

    class Meta:
        model = models.Provider
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        bank_account_data = validated_data.pop('bank_account_number')

        user = user_models.User.objects.create(**user_data)
        user.set_password(user_data['password'])

        user.save()

        bank_account_number = models.BankAccountNumber.objects.create(
            **bank_account_data
        )

        provider = models.Provider.objects.create(
            user=user,
            bank_account_number=bank_account_number,
            **validated_data
        )

        return provider

    def update(self, instance, validated_data):
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


class ModerationTimeSerializer(serializers.ModelSerializer):
    """Сериализатор для вычисления оставшегося времени с момента регистрации"""

    time_left = serializers.SerializerMethodField()

    class Meta:
        model = user_models.User
        fields = ('time_left',)

    def get_time_left(self, obj):
        now = timezone.now()
        date_joined = obj.date_joined
        elapsed_time = now - date_joined
        remaining_time = timedelta(hours=24) - elapsed_time
        if remaining_time.total_seconds() < 0:
            remaining_time = timedelta(seconds=0)
        return int(remaining_time.total_seconds())


class OrdersSerializers(serializers.ModelSerializer):
    size = product_components_serializers.SizeSerializer(read_only=True, many=True)
    color = product_components_serializers.ColorSerializer(read_only=True, many=True)
    order = cart_serializers.OrderBaseSerializer()
    product = product_serializers.ProductLightSerializer()

    class Meta:
        model = cart_models.OrderProduct
        fields = '__all__'
