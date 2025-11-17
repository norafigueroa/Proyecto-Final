from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomTokenObtainPairSerializer, PerfilUsuarioSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Vista de login que:
    1. Verifica credenciales
    2. Devuelve id, username, email, rol
    3. Guarda tokens en cookies HttpOnly
    """
    nombre_usuario = request.data.get('username')
    contrasena = request.data.get('password')
    
    # Autenticar usuario
    usuario = authenticate(username=nombre_usuario, password=contrasena)
    
    if usuario is not None:
        # Usar el serializer personalizado
        serializador = CustomTokenObtainPairSerializer()
        actualizador = RefreshToken.for_user(usuario)
        
        # Obtener grupos del usuario (rol)
        grupos = usuario.groups.values_list('name', flat=True)
        
        # Crear respuesta con la información del usuario
        respuesta = Response({
            'mensaje': 'Login exitoso',
            'user': {
                'id': usuario.id,
                'username': usuario.username,
                'email': usuario.email,
                'first_name': usuario.first_name,
                'last_name': usuario.last_name,
                'role': grupos[0] if grupos else None,
            }
        }, status=status.HTTP_200_OK)
        
        # Guardar tokens en cookies HttpOnly
        respuesta.set_cookie(
            key='access_token',
            value=str(actualizador.access_token),
            httponly=True,
            secure=False,  # True en producción
            samesite='Lax',
            max_age=1800,  # 30 minutos
        )
        
        respuesta.set_cookie(
            key='refresh_token',
            value=str(actualizador),
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=86400,  # 1 día
        )
        
        return respuesta
    else:
        return Response(
            {'error': 'Credenciales inválidas'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
def logout_view(request):
    """Vista de logout que elimina las cookies"""
    respuesta = Response({'mensaje': 'Logout exitoso'})
    respuesta.delete_cookie('access_token')
    respuesta.delete_cookie('refresh_token')
    return respuesta


@api_view(['POST'])
@permission_classes([AllowAny])
def register_cliente(request):
    """
    Registro de cliente
    Asigna automáticamente el grupo 'Cliente'
    """
    try:
        # Obtener grupo Cliente
        grupo_cliente = Group.objects.get(name='Cliente')
        
        # Agregar el grupo a los datos
        request.data._mutable = True
        request.data['groups'] = [grupo_cliente.id]
        request.data._mutable = False
        
        # Serializar y validar datos
        serializador = PerfilUsuarioSerializer(data=request.data)
        
        if serializador.is_valid():
            usuario = serializador.save()
            
            return Response({
                'mensaje': 'Cliente registrado exitosamente',
                'user': {
                    'id': usuario.id,
                    'username': usuario.username,
                    'email': usuario.email,
                }
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {'errores': serializador.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Group.DoesNotExist:
        return Response(
            {'error': 'Grupo Cliente no existe'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as excepcion:
        return Response(
            {'error': str(excepcion)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )