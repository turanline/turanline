from rest_framework import serializers

from . import models, mixins
from users import serializers as user_serializers
from products import serializers as product_serializers


class BaseCustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Customer


class BaseReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Review


class CustomerSerializer(
    mixins.CustomerMixin,
    BaseCustomerSerializer
):

    user = user_serializers.UserSerializer()

    class Meta(BaseCustomerSerializer.Meta):
        exclude = [
            'favorites'
        ]


class CustomerReadSerializer(BaseCustomerSerializer):

    user = user_serializers.UserReadSerializer()

    class Meta(BaseCustomerSerializer.Meta):
        fields = [
            'user'
        ]


class ReviewSerializer(BaseReviewSerializer):

    product = product_serializers.ProductLightSerializer()

    class Meta(BaseReviewSerializer.Meta):
        fields = '__all__'
        read_only_fields = [
            'product'
        ]


class LightReviewSerializer(BaseReviewSerializer):

    class Meta(BaseReviewSerializer.Meta):
        fields = [
            'text'
        ]
