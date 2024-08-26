from collections import OrderedDict

from django.contrib.auth.hashers import check_password
from django.db import transaction
from rest_framework import exceptions

from users import models as user_models

from . import models


class CustomerMixin:

    def _get_or_create_user(
        self,
        data: dict
    ) -> user_models.User:
        phone_number = data.get('phone_number')
        password = data.get('password')

        if not phone_number:
            raise exceptions.ValidationError('Phone number is required.')
        if not password:
            raise exceptions.ValidationError('Password is required.')

        user, created = user_models.User.objects.get_or_create(
            phone_number=phone_number,
            defaults={
                'is_customer': True,
                **data
            }
        )

        if not created:
            if not check_password(password, user.password):
                raise exceptions.ValidationError(
                    'A user with this phone number already exists and the provided password is incorrect.'
                )
            if models.Customer.objects.filter(
                user=user
            ).exists():
                raise exceptions.ValidationError(
                    'A customer with this user already exists.'
                )
            user.is_customer = True

        user.save(
            update_fields=['is_customer']
        )
        return user

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
            user = instance.user
            password = user_data.pop('password', None)
            if 'phone_number' in user_data:
                user.phone_number = user_data['phone_number']
                user.is_verified = False
            for attr, value in user_data.items():
                setattr(user, attr, value)
            if password:
                user.set_password(password)
            user.save()

        return super().update(instance, validated_data)
