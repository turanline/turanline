import logging

from rest_framework import serializers

from users import serializers as user_serializers

from . import mixins, models

logger = logging.getLogger(__name__)


class BaseProviderSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = models.Provider


class BankAccountNumberSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.BankAccountNumber
        fields = '__all__'


class ProviderSerializer(
    mixins.ProviderMixin,
    BaseProviderSerializer
):

    user = user_serializers.UserSerializer()

    bank_account_number = BankAccountNumberSerializer()

    class Meta(BaseProviderSerializer.Meta):
        exclude = [
            'state',
            'last_downloaded_file'
        ]


class ProviderDownloadFileSerializer(
    BaseProviderSerializer
):

    class Meta:
        model = models.Provider
        fields = [
            'last_downloaded_file'
        ]


class ProviderProductSerializer(
    BaseProviderSerializer
):
    class Meta(BaseProviderSerializer.Meta):
        fields = [
            'country',
            'company',
            'address'
        ]
