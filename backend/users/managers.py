from typing import Any, Optional

from django.conf import settings
from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager):

    def create_user(
        self,
        phone_number: str,
        password: str,
        email: str,
        first_name: str,
        last_name: str,
        is_provider: bool = False,
        is_customer: bool = False,
        is_verified: bool = False,
        is_superuser: bool = False,
        is_staff: bool = False,
        **extra_fields: Any
    ) -> Optional[settings.AUTH_USER_MODEL]:

        if not phone_number or not password:
            raise ValueError('Users must have a phone number and password')

        user = self.model(
            email=self.normalize_email(email),
            phone_number=phone_number,
            first_name=first_name,
            last_name=last_name,
            is_provider=is_provider,
            is_customer=is_customer,
            is_verified=is_verified,
            is_superuser=is_superuser,
            is_staff=is_staff,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def get_or_create_user(
        self,
        phone_number: str,
        password: str,
        email: str,
        first_name: str,
        last_name: str,
        is_provider: bool = False,
        is_customer: bool = False,
        is_verified: bool = False,
        is_superuser: bool = False,
        is_staff: bool = False,
        **extra_fields: Any
    ) -> Optional[settings.AUTH_USER_MODEL]:

        try:
            user = self.get(
                phone_number=phone_number
            )
            created = False
        except self.model.DoesNotExist:
            user = self.create_user(
                phone_number=phone_number,
                password=password,
                email=email,
                first_name=first_name,
                last_name=last_name,
                is_provider=is_provider,
                is_customer=is_customer,
                is_verified=is_verified,
                is_superuser=is_superuser,
                is_staff=is_staff,
                **extra_fields
            )
            created = True

        return user, created

    def create_superuser(
        self,
        phone_number: str,
        password: str,
        email: str = None
    ) -> Optional[settings.AUTH_USER_MODEL]:
        user = self.create_user(
            phone_number=phone_number,
            password=password,
            email=email,
            first_name='root',
            last_name='root',
            is_provider=True,
            is_customer=True,
            is_verified=True,
            is_superuser=True,
            is_staff=True
        )
        return user
