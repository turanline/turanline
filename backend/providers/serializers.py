from datetime import timedelta
import logging

from django.utils import timezone
from rest_framework import serializers, exceptions

from . import models, mixins
from users import models as user_models
from users import serializers as user_serializers
from cart import models as cart_models
from cart import serializers as cart_serializers
from customers import serializers as customer_serializers

logger = logging.getLogger(__name__)


class BankAccountNumberSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.BankAccountNumber
        fields = '__all__'


class ProviderSerializer(
    mixins.ProviderMixin,
    serializers.ModelSerializer
):

    user = user_serializers.UserSerializer()

    bank_account_number = BankAccountNumberSerializer()

    class Meta:
        model = models.Provider
        exclude = [
            'state',
            'last_downloaded_file'
        ]


class ProviderOrderSerializers(serializers.ModelSerializer):

    order_products = cart_serializers.OrderProductsSerializer(
        many=True,
        source='filtered_order_products'
    )

    customer = customer_serializers.CustomerReadSerializer()

    class Meta:
        model = cart_models.Order
        fields = '__all__'
        read_only_fields = [
            'customer',
            'order_products'
        ]


class ModerationTimeSerializer(serializers.ModelSerializer):

    time_left = serializers.SerializerMethodField()

    class Meta:
        model = user_models.User
        fields = [
            'time_left'
        ]

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
        fields = [
            'last_downloaded_file'
        ]
