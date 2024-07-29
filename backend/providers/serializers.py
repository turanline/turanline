from datetime import timedelta
import logging

from django.utils import timezone
from rest_framework import serializers

from . import models
from users import models as user_models
from users import serializers as user_serializers
from cart import models as cart_models
from cart import serializers as cart_serializers
from customers import serializers as customer_serializers

logger = logging.getLogger(__name__)


class BankAccountNumberSerializer(serializers.ModelSerializer):
    """Сериализатор для модели банковского счета."""

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
        user = user_models.User.objects.create_user(**user_data)
        bank_account_number = models.BankAccountNumber.objects.create(
            **bank_account_data
        )
        return models.Provider.objects.create(
            user=user,
            bank_account_number=bank_account_number,
            **validated_data
        )

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        bank_account_data = validated_data.pop('bank_account_number', None)

        if user_data:
            user = instance.user
            if 'password' in user_data:
                user.set_password(user_data['password'])
            for attr, value in user_data.items:
                setattr(user, attr, value)
            user.save()

        if bank_account_data:
            bank_account_number = instance.bank_account_number
            for attr, value in bank_account_data.items():
                setattr(bank_account_number, attr, value)
            bank_account_number.save()

        return super().update(instance, validated_data)


class OrdersSerializers(serializers.ModelSerializer):
    order_products = cart_serializers.OrderProductsSerializer(
        read_only=True,
        many=True,
        source='filtered_order_products'
    )
    customer = customer_serializers.CustomerLightSerializer(
        read_only=True
    )

    class Meta:
        model = cart_models.Order
        fields = '__all__'


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


class ProviderDownloadFileSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Provider
        fields = ['last_downloaded_file']
