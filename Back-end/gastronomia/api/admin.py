from django.contrib import admin
from .models import PerfilUsuario, Categoria, Restaurante, FotoRestaurante, Platillo, GaleriaComunitaria

@admin.register(PerfilUsuario)
class PerfilUsuarioAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'telefono', 'is_staff', 'is_active')
    search_fields = ('username', 'email')

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre_categoria', 'descripcion')
    search_fields = ('nombre_categoria',)

@admin.register(Restaurante)
class RestauranteAdmin(admin.ModelAdmin):
    list_display = ('nombre_restaurante', 'usuario_propietario', 'estado', 'verificado')
    list_filter = ('estado', 'verificado')
    search_fields = ('nombre_restaurante', 'usuario_propietario__username')

@admin.register(FotoRestaurante)
class FotoRestauranteAdmin(admin.ModelAdmin):
    list_display = ('restaurante', 'url_foto', 'fecha_subida')

@admin.register(Platillo)
class PlatilloAdmin(admin.ModelAdmin):
    list_display = ('nombre_platillo', 'restaurante', 'categoria_menu', 'precio', 'disponible')

@admin.register(GaleriaComunitaria)
class GaleriaComunitariaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'usuario', 'fecha_subida')
