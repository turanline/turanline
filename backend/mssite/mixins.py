from typing import Any, Dict, Type

from django.conf import settings
from django.db.models import Model
from django.utils.translation import get_language_from_request


class BaseLocalizationMixin:

    def to_representation(self, instance: Type[Model]) -> Dict[str, Any]:
        representation = super().to_representation(instance)
        for field in self.Meta.translated_fields:
            if hasattr(instance, f'get_{field}_display'):
                representation[field] = getattr(instance, f'get_{field}_display')()
        return representation


class TranslatedSerializerMixin:

    def to_representation(self, instance: Type[Model]) -> Dict[str, Any]:
        inst_rep = super().to_representation(instance)
        request = self.context.get('request')
        lang_code = get_language_from_request(request)
        result = {}
        for field_name, field in self.get_fields().items():
            if field_name != 'translations':
                field_value = inst_rep.pop(field_name)
                result.update({field_name: field_value})
            if field_name == 'translations':
                translations = inst_rep.pop(field_name)
                if lang_code not in translations:
                    parler_default_settings = settings.PARLER_LANGUAGES['default']
                    if 'fallback' in parler_default_settings:
                        lang_code = parler_default_settings.get('fallback')
                    if 'fallbacks' in parler_default_settings:
                        lang_code = parler_default_settings.get('fallbacks')[0]
                for lang, translation_fields in translations.items():
                    if lang == lang_code:
                        trans_rep = translation_fields.copy()
                        for trans_field_name, trans_field in translation_fields.items():
                            field_value = trans_rep.pop(trans_field_name)
                            result.update({trans_field_name: field_value})
        return result
