from collections import OrderedDict
from typing import Dict

from django.db import transaction
from rest_framework import exceptions

from users import models as user_models

from . import models


class ProviderMixin:

    def _get_or_create_user(
        self,
        data: Dict[str, str]
    ) -> user_models.User:

        user, created = user_models.User.objects.get_or_create_user(**data)
        return user

    def _create_bank_account(
        self,
        data: Dict[str, str]
    ) -> models.BankAccountNumber:
        return models.BankAccountNumber.objects.create(
            **data
        )

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

    def _update_bank_account(
        self,
        bank_account: models.BankAccountNumber,
        data: Dict[str, str]
    ) -> None:
        for attr, value in data.items():
            setattr(bank_account, attr, value)
        bank_account.save()

    @transaction.atomic
    def create(
        self,
        validated_data: OrderedDict
    ) -> models.Provider:
        user_data = validated_data.pop('user')
        if not user_data:
            raise exceptions.ValidationError(
                {'User data is required.'}
            )
        bank_account_data = validated_data.pop('bank_account_number')

        user = self._get_or_create_user(
            data=user_data
        )
        bank_account_number = self._create_bank_account(
            data=bank_account_data
        )

        if models.Provider.objects.filter(user=user).exists():
            raise exceptions.ValidationError(
                {'detail': 'A provider with this user already exists.'}
            )
        user.is_provider = True
        user.save(
            update_fields=['is_provider']
        )
        return models.Provider.objects.create(
            user=user,
            bank_account_number=bank_account_number,
            **validated_data
        )

    @transaction.atomic
    def update(
        self,
        instance: models.Provider,
        validated_data: OrderedDict
    ) -> models.Provider:
        user_data = validated_data.pop('user', None)
        bank_account_data = validated_data.pop('bank_account_number', None)

        if user_data:
            self._update_user(
                user=instance.user,
                data=user_data
            )

        if bank_account_data:
            self._update_bank_account(
                bank_account=instance.bank_account_number,
                data=bank_account_data
            )

        return super().update(instance, validated_data)
