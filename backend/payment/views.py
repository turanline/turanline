from rest_framework import viewsets, views, status

from . import models, serializers


class CardPaymentViewSet(viewsets.ModelViewSet):
    queryset = models.CardPayment.objects.all()
    serializer_class = serializers.CardPaymentSerializer
