import logging

from rest_framework import serializers, exceptions
from rest_framework_simplejwt import serializers as jwt_serializers

from . import models, mixins

logger = logging.getLogger(__name__)


class CustomTokenObtainPairSerializer(
    jwt_serializers.TokenObtainPairSerializer
):

    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_verified:
            raise exceptions.PermissionDenied(
                detail={
                    'detail': 'User account is not verified.'
                }
            )
        return data


class BaseVerificationSerializer(serializers.Serializer):

    phone_number = serializers.CharField(max_length=16)


class VerificationSerializer(BaseVerificationSerializer):

    purpose = serializers.ChoiceField(
        choices=[
            ('verification', 'Verification'),
            ('reset_password', 'Reset Password')
        ]
    )


class NumberVerificationSerializer(BaseVerificationSerializer):

    verification_code = serializers.CharField(max_length=6)


class BaseUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.User


class BaseNewsSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.News


class UserSerializer(
    mixins.UserMixin,
    BaseUserSerializer
):

    phone_number = serializers.CharField(validators=[])

    class Meta(BaseUserSerializer.Meta):
        exclude = [
            'username',
            'date_joined',
            'is_superuser',
            'is_active',
            'is_staff',
            'is_customer',
            'is_provider',
            'is_verified',
            'groups',
            'user_permissions',
            'last_login'
        ]


class UserReadSerializer(BaseUserSerializer):

    class Meta(BaseUserSerializer.Meta):
        fields = [
            'id',
            'email',
            'phone_number',
            'first_name',
            'last_name'
        ]


class NewsSerializer(BaseNewsSerializer):

    class Meta(BaseNewsSerializer.Meta):
        fields = '__all__'
