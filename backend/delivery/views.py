from rest_framework import mixins, viewsets, status
from django_filters.rest_framework import DjangoFilterBackend

from . import models, serializers, filters


class DeliveryViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.Delivery.objects.all()
    serializer_class = serializers.DeliverySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = filters.DeliverySearchFilter
