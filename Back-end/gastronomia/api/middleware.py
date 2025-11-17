from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import get_authorization_header
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.exceptions import AuthenticationFailed

class CookieJWTAuthentication(JWTAuthentication):
    """
    Autenticación JWT que primero intenta leer el token desde cookies
    y, si no está, lo lee desde el header Authorization (útil para Postman).
    Maneja errores de token de forma segura (devuelve None para que
    Django trate la petición como no autenticada).
    """

    def authenticate(self, request):
        raw_token = None

        # 1) Intentar leer token desde cookie 'access_token'
        raw_token = request.COOKIES.get('access_token')

        # 2) Si no hay cookie, intentar leer Authorization header
        if not raw_token:
            header = get_authorization_header(request).split()
            if len(header) == 2:
                # header típico: b'Bearer', b'<token>'
                raw_token = header[1].decode('utf-8')
            elif len(header) == 1:
                # algunos clientes pueden enviar solo el token (raro pero por si acaso)
                raw_token = header[0].decode('utf-8')

        if not raw_token:
            return None

        # 3) Validar token con defensas
        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
        except (InvalidToken, TokenError, AuthenticationFailed, Exception):
            # Si el token es inválido o caducó o cualquier error ocurre,
            # devolvemos None para que la auth falle silenciosamente
            return None
