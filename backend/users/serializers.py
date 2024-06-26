import logging

from rest_framework import serializers

from . import models
from providers import models as provider_models

logger = logging.getLogger(__name__)


class UserReadLoginSerializer(serializers.ModelSerializer):

    state = serializers.SerializerMethodField('get_state_field')

    def get_state_field(self, obj):
        try:
            provider = provider_models.Provider.objects.get(user=obj)
            return provider.state
        except provider_models.Provider.DoesNotExist:
            return None

    class Meta:
        model = models.User
        exclude = (
            'date_joined',
            'is_superuser',
            'is_active',
            'is_staff',
            'groups',
            'user_permissions',
            'last_login',
            'password',
        )


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        exclude = (
            'date_joined',
            'is_superuser',
            'is_active',
            'is_staff',
            'groups',
            'user_permissions',
            'last_login',
        )

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        instance.set_password(password)
        return super().update(instance, validated_data)

    def create(self, validated_data):
        user = models.User(**validated_data)
        password = validated_data.pop('password')
        user.set_password(password)
        user.save()
        return user


class SuperAdminUsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ('username',)


class AppealSerializer(serializers.ModelSerializer):
    """Сериализатор для модели обращений поставщиков."""

    class Meta:
        model = models.Appeal
        fields = '__all__'


class NewsReadSerializer(serializers.ModelSerializer):

    author = SuperAdminUsernameSerializer()

    class Meta:
        model = models.News
        fields = '__all__'


class NewsWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.News
        exclude = ('author',)
