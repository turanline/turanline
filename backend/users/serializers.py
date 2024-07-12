import logging

from rest_framework import serializers

from . import models
from providers import models as provider_models

logger = logging.getLogger(__name__)


class BaseUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User


class BaseNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.News


class UserReadLoginSerializer(BaseUserSerializer):

    state = serializers.SerializerMethodField('get_state_field')

    def get_state_field(self, obj):
        try:
            provider = provider_models.Provider.objects.get(user=obj)
            return provider.state
        except provider_models.Provider.DoesNotExist:
            return None

    class Meta(BaseUserSerializer.Meta):
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


class UserLightSerializer(BaseUserSerializer):

    class Meta(BaseUserSerializer.Meta):
        fields = ['email']


class UserLoginSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        exclude = (
            'date_joined',
            'is_superuser',
            'is_active',
            'is_staff',
            'groups',
            'user_permissions',
            'last_login'
        )

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        instance.set_password(password)
        return super().update(instance, validated_data)

    def create(self, validated_data):
        return models.User.objects.create_user(**validated_data)


# class AppealSerializer(serializers.ModelSerializer):
#     """Сериализатор для модели обращений поставщиков."""
#
#     class Meta:
#         model = models.Appeal
#         fields = '__all__'


class NewsReadSerializer(BaseNewsSerializer):

    author = serializers.SlugRelatedField(
        queryset=models.User.objects.all(),
        slug_field='username'
    )

    class Meta(BaseNewsSerializer.Meta):
        fields = '__all__'


class NewsWriteSerializer(BaseNewsSerializer):

    class Meta(BaseNewsSerializer.Meta):
        exclude = ('author',)
