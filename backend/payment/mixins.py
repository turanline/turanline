from . import models


class CardPaymentMixin:

    def create(self, validated_data):
        content_object = validated_data.pop('content_object')
        card = models.Card.objects.create(**content_object)
        return models.CardPayment.objects.create(
            content_object=card,
            **validated_data
        )