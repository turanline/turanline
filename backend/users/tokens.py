from typing import Type, TypeVar

from rest_framework_simplejwt import tokens

T = TypeVar("T", bound="Token")


class CustomRefreshToken(tokens.RefreshToken):

    @classmethod
    def for_user(
        cls: Type[T],
        user: tokens.AuthUser
    ) -> T:
        token = super().for_user(user)
        token['roles'] = {}
        token['roles']['customer'] = user.is_customer
        token['roles']['provider'] = user.is_provider
        return token
