from collections import OrderedDict

from rest_framework import exceptions

from . import models


class UserMixin:

    def create(
        self,
        validated_data: OrderedDict
    ) -> models.User:
        return models.User.objects.create_user(
            **validated_data
        )

    def update(
        self,
        instance: models.User,
        validated_data: OrderedDict
    ) -> models.User:
        password = validated_data.pop('password', None)

        if not password:
            raise exceptions.ValidationError(
                {'detail': 'Password field is required.'}
            )

        instance.set_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
