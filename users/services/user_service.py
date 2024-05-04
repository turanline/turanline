import logging
from ..models import User, Order

logger = logging.getLogger(__name__)


class UserService:
    """Бизнес логика для работы с пользователями"""

    @staticmethod
    def get_user_by_username(username: str) -> User:
        return User.objects.get(username=username)

    @staticmethod
    def get_user_by_id(id: int) -> User:
        return User.objects.get(pk=id)

    @staticmethod
    def get_user_by_order_id(order_id: int) -> User:
        order = Order.objects.filter(pk=order_id).select_related("user").first()
        return order.user
