from rest_framework import mixins, status, viewsets

from . import models, serializers


class CityViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.City.objects.all()
    serializer_class = serializers.CitySerializer


class TariffViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.Tariff.objects.all()
    serializer_class = serializers.TariffSerializer
