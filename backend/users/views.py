import logging

from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt import views
from rest_framework_simplejwt.tokens import RefreshToken

import clients
from . import models, serializers
from customers import models as customer_models
from customers import serializers as customer_serializers

logger = logging.getLogger(__name__)


@extend_schema(tags=['jwt auth'])
class TokenObtainPairViewDoc(views.TokenObtainPairView):
    pass


@extend_schema(tags=['jwt auth'])
class TokenRefreshViewDoc(views.TokenRefreshView):

    pass


@extend_schema(tags=['jwt auth'])
class TokenVerifyViewDoc(views.TokenVerifyView):

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as error:
            raise InvalidToken(error.args[0])
        token = AccessToken(request.data['token'])
        user_id = token['user_id']
        return Response(
            data={
                'user': user_id
            },
            status=status.HTTP_200_OK
        )


@extend_schema(tags=['jwt auth'])
class TokenLogoutViewDoc(views.TokenBlacklistView):
    pass


@extend_schema(tags=['users'])
class UserViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):

    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.twilio_client = clients.TwilioClient()
        self.redis_client = clients.RedisClient()

    def get_serializer_class(self):
        if self.action == 'receive_verification_code':
            return serializers.VerificationSerializer
        elif self.action == 'reviews':
            return customer_serializers.ReviewSerializer
        elif self.action in (
            'compare_verification_code',
            'reset_password'
        ):
            return serializers.NumberVerificationSerializer
        return super().get_serializer_class()

    @action(methods=['POST'], detail=False)
    def receive_verification_code(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(
            models.User,
            phone_number=serializer.validated_data.get('phone_number')
        )
        purpose = serializer.validated_data.get('purpose')
        if purpose == 'verification' and user.is_verified:
            return Response(
                data={
                    'message': 'User is already verified.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        if purpose == 'reset_password' and not user.is_verified:
            return Response(
                data={
                    'message': 'User is not verified for password reset.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        verif_code = self.twilio_client.send_verification_code(
            recipient=user.phone_number
        )
        if purpose == 'reset_password':
            self.redis_client.add(
                f'{user.phone_number}_password',
                verif_code
            )
        self.redis_client.add(
            f'{user.phone_number}_verif',
            verif_code
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    @action(methods=['POST'], detail=False)
    def compare_verification_code(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(
            models.User,
            phone_number=serializer.validated_data.get('phone_number')
        )
        check_code = self.redis_client.receive(
            f'{user.phone_number}_verif'
        )
        request_code = serializer.validated_data.get('verification_code')
        if not check_code:
            return Response(
                data={
                    'message': 'Code expired.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        if request_code == check_code:
            self.redis_client.delete(
                f'{user.phone_number}_verif'
            )
            user.is_verified = True
            user.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                data={
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                },
                status=status.HTTP_200_OK
            )
        return Response(
            data={
                'message': 'Code is invalid.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(methods=['POST'], detail=False)
    def reset_password(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(
            models.User,
            phone_number=serializer.validated_data.get('phone_number')
        )
        check_code = self.redis_client.receive(
            f'{user.phone_number}_password'
        )
        request_code = serializer.validated_data.get('verification_code')
        if not check_code:
            return Response(
                data={
                    'message': 'Code expired.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        if request_code == check_code:
            self.redis_client.delete(
                f'{user.phone_number}_password'
            )
            password = self.twilio_client.send_password(
                recipient=user.phone_number
            )
            user.set_password(password)
            user.save()
            return Response(
                data={
                    'message': 'Password reset completed.'
                },
                status=status.HTTP_200_OK
            )
        return Response(
            data={
                'message': 'Code is invalid.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(
        methods=['GET'],
        detail=False,
        permission_classes=[permissions.IsAuthenticated]
    )
    def reviews(self, request, *args, **kwargs):
        user_reviews = customer_models.Review.objects.filter(
            user=request.user
        )
        serializer = self.get_serializer(
            instance=user_reviews,
            many=True
        )
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )


@extend_schema(tags=['news'])
class NewsViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.News.objects.all()
    serializer_class = serializers.NewsSerializer
