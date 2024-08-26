from celery import shared_task

from . import models


@shared_task
def delete_order_if_not_payed(order_id: int) -> None:
    order = models.Order.objects.get(
        id=order_id
    )
    if not order.is_paid:
        order.delete()
