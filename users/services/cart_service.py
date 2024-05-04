import logging

from django.http import QueryDict
from ..models import Order, User
from django.db.models import QuerySet

logger = logging.getLogger(__name__)


class CartService:
    """Бизнес логика для работы с корзиной"""
    @staticmethod
    def create_empty_cart(user: User) -> None:
        Order.objects.create(status=Order.CREATED, user=user)

    @staticmethod
    def update_user_cart():
        pass

    @staticmethod
    def get_user_cart(request_data: QueryDict, queryset: QuerySet) -> QuerySet | None:
        user_id = request_data.get("user_id", None)

        if user_id:
            return queryset.filter(order__user__id=user_id)
