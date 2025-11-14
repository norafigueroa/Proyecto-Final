from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import get_authorization_header

class CookieJWTAuthentication(JWTAuthentication):
    """
    Autenticación JWT que lee el token desde cookies en vez de headers
    """
    def authenticate(self, request):
        # Primero intenta leer el token de las cookies
        raw_token = request.COOKIES.get('access_token')
        
        if raw_token is None:
            # Si no hay cookie, intenta leer del header (para Postman)
            header = get_authorization_header(request).split()
            if len(header) == 2:
                raw_token = header[1].decode('utf-8')
            else:
                return None
        
        # Validar el token
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token