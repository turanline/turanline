from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager):
    def create_user(
            self,
            username,
            password,
            email=None,
            first_name=None,
            last_name=None,
            is_provider=False,
            is_superuser=False,
            is_staff=False,
            **extra_fields
    ):
        if not username or not password:
            raise ValueError('Users must have an username and password')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            first_name=first_name,
            last_name=last_name,
            is_provider=is_provider,
            is_superuser=is_superuser,
            is_staff=is_staff,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password, email=None):
        return self.create_user(
            username=username,
            password=password,
            email=email,
            first_name='root',
            last_name='root',
            is_provider=True,
            is_superuser=True,
            is_staff=True
        )
