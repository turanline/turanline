import logging

from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .models import User, Appeal, News
from providers.models import Provider

logger = logging.getLogger(__name__)


class UserReadLoginSerializer(ModelSerializer):

    state = SerializerMethodField('get_state_field')

    def get_state_field(self, obj):
        try:
            provider = Provider.objects.get(user=obj)
            return provider.state
        except Provider.DoesNotExist:
            return None

    class Meta:
        model = User
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


class UserLoginSerializer(ModelSerializer):
    class Meta:
        model = User
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
        user = User(**validated_data)
        password = validated_data.pop('password')
        user.set_password(password)
        user.save()
        return user


class SuperAdminUsernameSerializer(ModelSerializer):
    class Meta:
        """Исключены поля date_joined, last_login исходной модели."""

        model = User
        fields = ('username',)


class AppealSerializer(ModelSerializer):
    """Сериализатор для модели обращений поставщиков."""

    class Meta:
        """Включены все поля исходной модели."""

        model = Appeal
        fields = '__all__'


class NewsReadSerializer(ModelSerializer):

    author = SuperAdminUsernameSerializer()

    class Meta:
        model = News
        fields = '__all__'


class NewsWriteSerializer(ModelSerializer):

    class Meta:
        model = News
        exclude = ('author',)
