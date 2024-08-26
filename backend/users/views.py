import logging
from typing import Any, Type

from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework_simplejwt import views
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from customers import models as customer_models
from customers import serializers as customer_serializers

from . import models, serializers, services

logger = logging.getLogger(__name__)


@extend_schema(tags=['jwt auth'])
class TokenObtainPairViewDoc(views.TokenObtainPairView):
    pass


@extend_schema(tags=['jwt auth'])
class TokenRefreshViewDoc(views.TokenRefreshView):

    pass


@extend_schema(tags=['jwt auth'])
class TokenVerifyViewDoc(views.TokenVerifyView):

    def post(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        serializer = self.get_serializer(
            data=request.data
        )
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as error:
            print(error.args[0])
            raise InvalidToken(error.args[0])
        token = AccessToken(request.data['token'])
        user_id = token['user_id']
        roles = token['roles']
        return Response(
            data={
                'user': user_id,
                'role': roles
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
    viewsets.GenericViewSet
):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer

    def initial(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> None:
        super().initial(request, *args, **kwargs)
        self.user_service = services.UserService()

    def get_serializer_class(self) -> Type[Serializer]:
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
    def receive_verification_code(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        serializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        response = self.user_service.check_user_and_send_verification_code(
            data=serializer.validated_data
        )
        if response:
            return response

        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    @action(methods=['POST'], detail=False)
    def compare_verification_code(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        serializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        response = self.user_service.process_user_verification(
            data=serializer.validated_data
        )
        return response

    @action(methods=['POST'], detail=False)
    def reset_password(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
        serializer = self.get_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        response = self.user_service.process_user_password_reset(
            data=serializer.validated_data
        )
        return response

    @action(
        methods=['GET'],
        detail=False,
        permission_classes=[
            IsAuthenticated
        ]
    )
    def reviews(
        self,
        request: Request,
        *args: Any,
        **kwargs: Any
    ) -> Response:
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
