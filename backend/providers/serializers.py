import logging

from rest_framework.serializers import ModelSerializer

from . import models
from users import models as user_models
from users import serializers as user_serializers

logger = logging.getLogger(__name__)


class BankAccountNumberSerializer(ModelSerializer):
    "Сериализатор для модели банковского счета."

    class Meta:
        model = models.BankAccountNumber
        fields = '__all__'


class ProviderSerializer(ModelSerializer):
    user = user_serializers.UserLoginSerializer()
    bank_account_number = BankAccountNumberSerializer()

    class Meta:
        model = models.Provider
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        bank_account_data = validated_data.pop('bank_account_number')

        user = user_models.User.objects.create(**user_data)
        user.set_password(user_data['password'])

        user.save()

        bank_account_number = models.BankAccountNumber.objects.create(
            **bank_account_data
        )

        provider = models.Provider.objects.create(
            user=user,
            bank_account_number=bank_account_number,
            **validated_data
        )

        return provider

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        bank_account_data = validated_data.pop('bank_account_number', None)

        if user_data:
            user = instance.user
            user.username = user_data.get('username', user.username)
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            if 'password' in user_data:
                user.set_password(user_data['password'])
            user.save()

        if bank_account_data:
            bank_account_number = instance.bank_account_number
            for attr, value in bank_account_data.items():
                setattr(bank_account_number, attr, value)
            bank_account_number.save()

        instance = super().update(instance, validated_data)
        return instance


class ProviderDateJoinedSerializer(ModelSerializer):
    """Сериализатор для получения даты регистрации"""

    class Meta:
        model = user_models.User
        fields = ('date_joined',)
