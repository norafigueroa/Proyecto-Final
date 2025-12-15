import pytest
from django.contrib.auth.models import Group
from rest_framework import status
from api.models import PerfilUsuario


@pytest.mark.auth
@pytest.mark.django_db
class TestLogin:
    """Tests para el endpoint de login"""

    def test_login_exitoso(self, client, usuario_cliente):
        """Prueba que un usuario puede hacer login con credenciales correctas"""
        data = {
            'username': 'cliente_test',
            'password': 'TestPass123!'
        }
        response = client.post('/api/login/', data, format='json')
        
        # Verificar status code
        assert response.status_code == status.HTTP_200_OK
        
        # Verificar que retorna los datos del usuario
        assert response.data['mensaje'] == 'Login exitoso'
        assert response.data['user']['username'] == 'cliente_test'
        assert response.data['user']['email'] == 'cliente@test.com'
        assert response.data['user']['role'] == 'Cliente'
        
        # Verificar que las cookies se establecen
        assert 'access_token' in response.cookies
        assert 'refresh_token' in response.cookies

    def test_login_credenciales_invalidas(self, client):
        """Prueba que falla el login con credenciales inválidas"""
        data = {
            'username': 'usuario_inexistente',
            'password': 'contraseña_incorrecta'
        }
        response = client.post('/api/login/', data, format='json')
        
        # Verificar status code
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['error'] == 'Credenciales inválidas'

    def test_login_falta_username(self, client):
        """Prueba que falla si falta el username"""
        data = {
            'password': 'TestPass123!'
        }
        response = client.post('/api/login/', data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'obligatorios' in response.data['error']

    def test_login_falta_password(self, client):
        """Prueba que falla si falta la contraseña"""
        data = {
            'username': 'cliente_test'
        }
        response = client.post('/api/login/', data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.auth
@pytest.mark.django_db
class TestLogout:
    """Tests para el endpoint de logout"""

    def test_logout_exitoso(self, authenticated_client, usuario_cliente):
        """Prueba que un usuario autenticado puede hacer logout"""
        response = authenticated_client.post('/api/logout/')
        
        # Verificar status code
        assert response.status_code == status.HTTP_200_OK
        assert response.data['mensaje'] == 'Logout exitoso'

    def test_logout_sin_autenticacion(self, client):
        """Prueba que no puede hacer logout sin estar autenticado"""
        response = client.post('/api/logout/')
        
        # Debe retornar 401 Unauthorized
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.auth
@pytest.mark.django_db
class TestRegistroCliente:
    """Tests para el endpoint de registro de cliente"""

    def test_registro_cliente_exitoso(self, client, grupo_cliente):
        """Prueba que se puede registrar un nuevo cliente"""
        data = {
            'username': 'nuevo_cliente',
            'email': 'nuevo@test.com',
            'password': 'NuevaPass123!',
            'first_name': 'Pedro',
            'last_name': 'García'
        }
        response = client.post('/api/register-cliente/', data, format='json')
        
        # Verificar status code
        assert response.status_code == status.HTTP_201_CREATED
        
        # Verificar datos del usuario creado
        assert response.data['mensaje'] == 'Cliente registrado exitosamente'
        assert response.data['user']['username'] == 'nuevo_cliente'
        assert response.data['user']['email'] == 'nuevo@test.com'
        assert response.data['user']['role'] == 'Cliente'
        
        # Verificar que el usuario existe en BD
        usuario = PerfilUsuario.objects.get(username='nuevo_cliente')
        assert usuario.email == 'nuevo@test.com'
        assert usuario.is_active is True
        assert grupo_cliente in usuario.groups.all()

    def test_registro_cliente_username_duplicado(self, client, usuario_cliente):
        """Prueba que no se puede registrar con username duplicado"""
        data = {
            'username': 'cliente_test',  # Ya existe
            'email': 'otro@test.com',
            'password': 'NuevaPass123!',
            'first_name': 'Juan',
            'last_name': 'Pérez'
        }
        response = client.post('/api/register-cliente/', data, format='json')
        
        # Debe retornar error
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_registro_cliente_email_duplicado(self, client, usuario_cliente):
        """Prueba que no se puede registrar con email duplicado"""
        data = {
            'username': 'otro_usuario',
            'email': 'cliente@test.com',  # Ya existe
            'password': 'NuevaPass123!',
            'first_name': 'Juan',
            'last_name': 'Pérez'
        }
        response = client.post('/api/register-cliente/', data, format='json')
        
        # Debe retornar error
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_registro_cliente_falta_campos_obligatorios(self, client):
        """Prueba que falta validación de campos obligatorios"""
        data = {
            'username': 'nuevo_usuario',
            # Falta email y password
        }
        response = client.post('/api/register-cliente/', data, format='json')
        
        # Debe retornar error
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_registro_cliente_password_debil(self, client):
        """Prueba que rechaza contraseñas muy débiles"""
        data = {
            'username': 'nuevo_usuario',
            'email': 'nuevo@test.com',
            'password': '123',  # Muy corta
            'first_name': 'Juan',
            'last_name': 'Pérez'
        }
        response = client.post('/api/register-cliente/', data, format='json')
        
        # Debe retornar error
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.auth
@pytest.mark.django_db
class TestRefreshToken:
    """Tests para el endpoint de refresh token"""

    def test_refresh_token_exitoso(self, authenticated_client):
        """Prueba que se puede renovar el token"""
        response = authenticated_client.post('/api/token/refresh/')
        
        # Verificar status code
        assert response.status_code == status.HTTP_200_OK
        assert response.data['mensaje'] == 'Token renovado exitosamente'
        
        # Verificar que se actualizó la cookie
        assert 'access_token' in response.cookies

    def test_refresh_token_sin_cookie(self, client):
        """Prueba que falla sin refresh_token en cookie"""
        response = client.post('/api/token/refresh/')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'no encontrado' in response.data['error']