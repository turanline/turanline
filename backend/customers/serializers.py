from rest_framework.serializers import ModelSerializer

from .models import Customer, Review
from users.models import User
from users.serializers import UserLoginSerializer
from products.serializers import ProductLightSerializer


class CustomerSerializer(ModelSerializer):
    user = UserLoginSerializer()

    class Meta:
        model = Customer
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        user.set_password(user.password)
        user.save()
        customer = Customer.objects.create(user=user, **validated_data)
        return customer

    def update(self, instance, validated_data):
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

    product = ProductLightSerializer(read_only=True)

    class Meta:
        """Включены все поля исходной модели."""

        model = Review
        fields = '__all__'


class LightReviewSerializer(ModelSerializer):
    """Легкий сериализатор для модели обзоров продуктов."""

    class Meta:
        """Включено поле text исходной модели."""

        model = Review
        fields = ('text',)
