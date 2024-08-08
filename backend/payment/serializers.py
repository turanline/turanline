from rest_framework import serializers

from . import models, mixins


class CardSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Card
        fields = '__all__'


class CardPaymentSerializer(
    mixins.CardPaymentMixin,
    serializers.ModelSerializer
):

    content_object = CardSerializer()

    class Meta:
        model = models.CardPayment
        fields = [
            'content_object',
            'comment',
            'customer'
        ]
