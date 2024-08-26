class TwilioUnavailableException(Exception):
    def __init__(self, message='Twilio is unavailable'):
        super().__init__(message)


class SMSAeroUnavailableException(Exception):
    def __init__(self, message='SMSAero is unavailable'):
        super().__init__(message)
