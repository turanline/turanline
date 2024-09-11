from rest_framework import serializers

from . import models


class CardPaymentSerializer(
    serializers.Serializer
):

    card_number = serializers.CharField(
        max_length=16
    )

    expiration_year = serializers.CharField(
        max_length=4
    )

    expiration_month = serializers.CharField(
        max_length=2
    )

    cardholder_name = serializers.CharField(
        max_length=64
    )

    comment = serializers.CharField(
        max_length=32,
        required=False,
        allow_blank=True
    )


class WalletSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Wallet
        fields = '__all__'
