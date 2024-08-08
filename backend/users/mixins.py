from . import models


class UserMixin:

    def create(self, validated_data):
        return models.User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        instance.set_password(password)
        return super().update(instance, validated_data)
