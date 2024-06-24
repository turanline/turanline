from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import QuerySet
from django.http.request import QueryDict
from django.db.utils import IntegrityError
from django.http import HttpResponse

from .serializers import (CustomerSerializer, ReviewSerializer,
                          LightReviewSerializer)
from .models import Customer, Review
from .permissions import IsOwnerOrAdminUserReviewPermission
from products.serializers import ProductSerializer


@extend_schema(tags=['customer'])
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    @action(methods=['get'], detail=True)
    def favorites(self, request, *args, **kwargs):
        user = self.get_object()
        customer = Customer.objects.filter(user=user).first()
        customer_favorites = customer.favorites.all()

        serializer = ProductSerializer(
            customer_favorites,
            many=True,
            context={'request': request},
        )
        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data,
        )


@extend_schema(tags=['reviews'])
class ReviewsViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Review.objects.select_related('user', 'product')
    permission_classes = [IsOwnerOrAdminUserReviewPermission]
    serializer_class = ReviewSerializer

    @staticmethod
    def apply_product_reviews_filter(
        request_data: QueryDict, queryset: QuerySet
    ) -> QuerySet | None:
        product_id = request_data.get("product_id", None)
        if product_id:
            return queryset.filter(product__id=product_id)

    def get_queryset(self):
        request_data = self.request.GET
        filter_result = self.apply_product_reviews_filter(
            request_data,
            self.queryset,
        )
        if filter_result:
            self.queryset = filter_result
            return super().get_queryset()
        return Review.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewSerializer
        elif self.action in ('update', 'partial_update'):
            return LightReviewSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return HttpResponse(
                status=status.HTTP_400_BAD_REQUEST,
                content='That review is already created',
            )
