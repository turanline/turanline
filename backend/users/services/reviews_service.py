from django.db.models import QuerySet
from django.http.request import QueryDict


class ReviewService:

    """Бизнес логика для работы с отзывами"""
    @staticmethod
    def apply_product_reviews_filter(
        request_data: QueryDict, queryset: QuerySet
    ) -> QuerySet | None:
        product_id = request_data.get("product_id", None)
        if product_id:
            return queryset.filter(product__id=product_id)
