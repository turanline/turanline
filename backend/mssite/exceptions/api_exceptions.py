from rest_framework.exceptions import APIException


class SSMAeroServiceUnavailable(APIException):
    status_code = 503
    default_detail = 'SMSAero service temporarily unavailable, try again later.'
    default_code = 'service_unavailable'


class TwilioServiceUnavailable(APIException):
    status_code = 503
    default_detail = 'Twilio service temporarily unavailable, try again later.'
    default_code = 'service_unavailable'
