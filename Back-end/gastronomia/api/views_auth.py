from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Vista de login que:
    1. Verifica credenciales
    2. Devuelve id, username, email, role
    3. Guarda tokens en cookies HttpOnly
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    # Autenticar usuario
    user = authenticate(username=username, password=password)
    
    if user is not None:
        # Usar el serializer personalizado
        serializer = CustomTokenObtainPairSerializer()
        refresh = RefreshToken.for_user(user)
        
        # Obtener grupos del usuario
        groups = user.groups.values_list('name', flat=True)
        
        # Crear respuesta con la información del usuario
        response = Response({
            'message': 'Login exitoso',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': groups[0] if groups else None,
            }
        }, status=status.HTTP_200_OK)
        
        # Guardar tokens en cookies HttpOnly
        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            httponly=True,
            secure=False,  # True en producción
            samesite='Lax',
            max_age=1800,  # 30 minutos
        )
        
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=86400,  # 1 día
        )
        
        return response
    else:
        return Response(
            {'error': 'Credenciales inválidas'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
def logout_view(request):
    """Vista de logout que elimina las cookies"""
    response = Response({'message': 'Logout exitoso'})
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response