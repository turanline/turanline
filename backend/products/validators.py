from django.core.exceptions import ValidationError


def validate_positive_number(value: float):
    if value < 0:
        raise ValidationError("It must be positive value")
