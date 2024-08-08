from . import models
from payment import models as payment_models


class OrderMixin:

    def create(self, validated_data):
        payment_data = validated_data.pop('payment')
        customer = payment_data.get('customer')
        order_products = validated_data.pop('order_products')
        content_object = payment_data.pop('content_object')
        card, created = payment_models.Card.objects.get_or_create(
            **content_object
        )
        payment = payment_models.CardPayment.objects.create(
            content_object=card,
            **payment_data
        )
        order = models.Order.objects.create(
            payment=payment,
            customer=customer,
            **validated_data
        )
        for order_product in order_products:
            order.order_products.add(order_product)

        return order

    def update(self, instance, validated_data):
        payment_data = validated_data.pop('payment', None)

        if payment_data:
            content_object = payment_data.pop('content_object')
            customer = payment_data.get('customer')
            comment = payment_data.get('comment')
            card, created = payment_models.Card.objects.get_or_create(
                **content_object
            )
            instance.payment.comment = comment
            instance.payment.customer = customer
            instance.payment.content_object = card
            instance.payment.save()

        return super().update(instance, validated_data)
