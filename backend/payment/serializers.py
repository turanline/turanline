from rest_framework import serializers


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
