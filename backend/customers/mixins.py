from collections import OrderedDict
from typing import Dict

from django.db import transaction
from rest_framework import exceptions

from users import models as user_models

from . import models


class CustomerMixin:

    def _get_or_create_user(
        self,
        data: Dict[str, str]
    ) -> user_models.User:

        user, created = user_models.User.objects.get_or_create_user(**data)
        return user

    def _update_user(
        self,
        user: user_models.User,
        data: Dict[str, str]
    ) -> None:
        for attr, value in data.items():
            if attr == 'password':
                user.set_password(value)
            elif attr == 'phone_number':
                if not user.phone_number == value:
                    user.phone_number = value
                    user.is_verified = False
            else:
                setattr(user, attr, value)
        user.save()

    @transaction.atomic
    def create(
        self,
        validated_data: OrderedDict
    ) -> models.Customer:
        user_data = validated_data.pop('user')
        if not user_data:
            raise exceptions.ValidationError(
                {'User data is required.'}
            )
        user = self._get_or_create_user(
            data=user_data
        )
        if models.Customer.objects.filter(user=user).exists():
            raise exceptions.ValidationError(
                {'detail': 'A customer with this user already exists.'}
            )
        user.is_customer = True
        user.save(
            update_fields=['is_customer']
        )
        return models.Customer.objects.create(
            user=user,
            **validated_data
        )

    @transaction.atomic
    def update(
        self,
        instance: models.Customer,
        validated_data: OrderedDict
    ) -> models.Customer:
        user_data = validated_data.pop('user', None)

        if user_data:
            if user_data:
                self._update_user(
                    user=instance.user,
                    data=user_data
                )

        return super().update(instance, validated_data)
