from django.contrib.auth.hashers import check_password
from rest_framework import exceptions

from . import models
from users import models as user_models


class ProviderMixin:

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        bank_account_data = validated_data.pop('bank_account_number')
        phone_number = user_data.get('phone_number')
        password = user_data.get('password')
        user = user_models.User.objects.filter(
            phone_number=phone_number
        ).first()
        if user:
            if not check_password(password, user.password):
                raise exceptions.ValidationError(
                    'Provider with this phone number already exists and the provided password is incorrect.'
                )
            user.is_provider = True
        else:
            user = user_models.User.objects.create_user(**user_data)
            user.is_provider = True

        user.save()

        if models.Provider.objects.filter(user=user).exists():
            raise exceptions.ValidationError(
                'Provider with this user already exists.'
            )
        bank_account_number = models.BankAccountNumber.objects.create(
            **bank_account_data
        )

        return models.Provider.objects.create(
            user=user,
            bank_account_number=bank_account_number,
            **validated_data
        )

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        bank_account_data = validated_data.pop('bank_account_number', None)

        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                if attr == 'password':
                    user.set_password(user_data.get('password'))
                    continue
                elif attr == 'phone_number':
                    user.phone_number = value
                    user.is_verified = False
                    continue
                setattr(user, attr, value)
            user.save()

        if bank_account_data:
            bank_account_number = instance.bank_account_number
            for attr, value in bank_account_data.items():
                setattr(bank_account_number, attr, value)
            bank_account_number.save()

        return super().update(instance, validated_data)
