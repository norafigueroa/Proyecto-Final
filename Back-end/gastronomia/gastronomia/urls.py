from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from api.views_auth import login_view, logout_view, register_cliente

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),

    # Rutas de autenticación con cookies
    path('api/login/', login_view, name='iniciar_sesion'),
    path('api/logout/', logout_view, name='cerrar_sesion'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refrescar_token'),
    path('api/register-cliente/', register_cliente, name='registro_cliente'),
]