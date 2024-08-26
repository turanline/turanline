import base64
import datetime
import hashlib
from typing import Any, Dict, Optional

from rest_framework.exceptions import ValidationError


class HashService:
    def __init__(self, store_key: str) -> None:
        self.store_key = store_key

    def _generate_hash(
        self,
        clientId: str,
        oid: str,
        amount: str,
        okUrl: str,
        failUrl: str,
        islemtipi: str,
        instalment: str,
        rnd: str,
        **kwargs: Any
    ) -> str:
        string_to_hash = f'{clientId}{oid}{amount}{okUrl}{failUrl}{islemtipi}{instalment}{rnd}{self.store_key}'
        return self._convert_string_to_hash(string_to_hash).decode()

    def _convert_string_to_hash(
        self,
        input_string: str
    ) -> bytes:
        sha1_hash = hashlib.sha1(input_string.encode()).digest()
        return base64.b64encode(sha1_hash)

    def _verify_hash(
        self,
        data: Dict[str, Any]
    ) -> Optional[bool]:
        hash_params = data['HASHPARAMS']
        hash_params_val = data['HASHPARAMSVAL']
        hash_param = data['HASH']
        client_id = data['clientId']
        md_status = data['mdStatus']
        params_val = self._build_params_value(
            client_id,
            hash_params,
            **data
        )
        hash_val = params_val + self.store_key
        hash_con = self._convert_string_to_hash(hash_val).decode()

        if params_val != hash_params_val:
            raise ValidationError(
                {'detail': 'Parameter values do not match the expected hash parameter values.'}
            )
        if hash_param != hash_con:
            raise ValidationError(
                {'detail': 'Hash does not match the expected value.'}
            )
        if md_status in ('1', '2', '3', '4'):
            return True

        return False

    def _build_params_value(
        self,
        client_id: str,
        hash_params: str,
        data: Dict[str, Any]
    ) -> str:
        params_str = client_id
        hash_param_list = hash_params.split(':')
        for param in hash_param_list:
            if param:
                params_str += data.get(param, '')
        return params_str

    def _get_micro_time(
        self
    ) -> int:
        return int(datetime.datetime.now().timestamp())
