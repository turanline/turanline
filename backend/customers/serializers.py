from rest_framework.serializers import ModelSerializer

from . import models
from users import models as user_models
from users import serializers as user_serializer
from products import serializers as product_serializer


class CustomerSerializer(ModelSerializer):
    user = user_serializer.UserLoginSerializer()

    class Meta:
        model = models.Customer
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = user_models.User.objects.create_user(**user_data)
        return models.Customer.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        #TODO: check method
        user_data = validated_data.pop('user', None)
        if user_data:
            user = instance.user
            user.username = user_data.get('username', user.username)
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            if 'password' in user_data:
                user.set_password(user_data['password'])
            user.save()

        instance = super().update(instance, validated_data)
        return instance


class ReviewSerializer(ModelSerializer):
    """Сериализатор для модели обзоров продуктов."""

    product = product_serializer.ProductLightSerializer(read_only=True)

    class Meta:
        model = models.Review
        fields = '__all__'


class LightReviewSerializer(ModelSerializer):
    """Легкий сериализатор для модели обзоров продуктов."""

    class Meta:
        model = models.Review
        fields = ('text',)
