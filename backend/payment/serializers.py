from rest_framework import serializers

from . import models


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Card
        fields = '__all__'


class CardPaymentSerializer(serializers.ModelSerializer):

    content_object = CardSerializer()

    class Meta:
        model = models.CardPayment
        fields = [
            'content_object',
            'comment',
            'customer'
        ]

    def create(self, validated_data):
        content_object = validated_data.pop('content_object')
        card = models.Card.objects.create(**content_object)
        return models.CardPayment.objects.create(
            content_object=card,
            **validated_data
        )
