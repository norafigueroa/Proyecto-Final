from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.contrib.auth.hashers import make_password
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'telefono',
            'direccion',
            'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True}  # no se devuelve al listar usuarios
        }

    def create(self, validated_data):
        # Encripta la contraseña antes de guardarla
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Si se actualiza la contraseña, también se encripta
        password = validated_data.pop('password', None)
        usuario = super().update(instance, validated_data)
        if password:
            usuario.password = make_password(password)
            usuario.save()
        return usuario

    def validate_username(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("El nombre de usuario no puede estar vacío.")
        return value

    def validate_email(self, value):
        if not value or '@' not in value:
            raise serializers.ValidationError("Debe proporcionar un correo electrónico válido.")
        return value


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre del grupo no puede estar vacío.")
        return value.title()


class PerfilUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = '__all__'

    def validate_telefono(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("El teléfono solo debe contener números.")
        return value



class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

    def validate_nombre_categoria(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre de la categoría no puede estar vacío.")
        return value.title()


class RestauranteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurante
        fields = '__all__'

    def validate_nombre_restaurante(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre del restaurante no puede estar vacío.")
        return value.title()

    def validate_calificacion_promedio(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError("La calificación debe estar entre 0 y 5.")
        return value


class CategoriaRestauranteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaRestaurante
        fields = '__all__'

    def validate(self, data):
        if data['categoria'] == data['restaurante']:
            raise serializers.ValidationError("La categoría y el restaurante no pueden ser iguales.")
        return data


class FotoRestauranteSerializer(serializers.ModelSerializer):
    class Meta:
        model = FotoRestaurante
        fields = '__all__'

    def validate_url_foto(self, value):
        if not value.startswith("http"):
            raise serializers.ValidationError("Debe proporcionar una URL válida para la foto.")
        return value


class CategoriaMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaMenu
        fields = '__all__'

    def validate_nombre_categoria(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre de la categoría del menú no puede estar vacío.")
        return value.title()


class PlatilloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platillo
        fields = '__all__'

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor que 0.")
        return value


class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'

    def validate_total(self, value):
        if value < 0:
            raise serializers.ValidationError("El total no puede ser negativo.")
        return value


class DetallePedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallePedido
        fields = '__all__'

    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0.")
        return value


class ResenaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resena
        fields = '__all__'

    def validate_calificacion(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("La calificación debe estar entre 1 y 5.")
        return value


class FotosResenaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FotosResena
        fields = '__all__'

    def validate_url_foto(self, value):
        if not value.startswith("http"):
            raise serializers.ValidationError("Debe ser una URL válida.")
        return value


class CategoriaBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaBlog
        fields = '__all__'

    def validate_nombre_categoria(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre de la categoría no puede estar vacío.")
        return value.title()


class ArticuloBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticuloBlog
        fields = '__all__'

    def validate_titulo(self, value):
        if not value.strip():
            raise serializers.ValidationError("El título no puede estar vacío.")
        return value.title()


class EtiquetaArticuloSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtiquetaArticulo
        fields = '__all__'

    def validate_nombre_etiqueta(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre de la etiqueta no puede estar vacío.")
        return value.lower()


class ArticuloEtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticuloEtiqueta
        fields = '__all__'

    def validate(self, data):
        if data['articulo'] is None or data['etiqueta'] is None:
            raise serializers.ValidationError("El artículo y la etiqueta son obligatorios.")
        return data


class GaleriaComunitariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = GaleriaComunitaria
        fields = '__all__'

    def validate_titulo(self, value):
        if not value.strip():
            raise serializers.ValidationError("El título de la foto no puede estar vacío.")
        return value.title()


class ComentariosGaleriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComentariosGaleria
        fields = '__all__'

    def validate_comentario(self, value):
        if not value.strip():
            raise serializers.ValidationError("El comentario no puede estar vacío.")
        return value.strip()


class LugaresTuristicosSerializer(serializers.ModelSerializer):
    class Meta:
        model = LugaresTuristicos
        fields = '__all__'

    def validate_nombre_lugar(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre del lugar no puede estar vacío.")
        return value.title()


class FotosLugaresSerializer(serializers.ModelSerializer):
    class Meta:
        model = FotosLugares
        fields = '__all__'

    def validate_url_foto(self, value):
        if not value.startswith("http"):
            raise serializers.ValidationError("Debe ser una URL válida.")
        return value


class MensajesContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MensajesContacto
        fields = '__all__'

    def validate_correo(self, value):
        if not value or '@' not in value:
            raise serializers.ValidationError("Debe proporcionar un correo válido.")
        return value

    def validate_mensaje(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("El mensaje debe tener al menos 10 caracteres.")
        return value.strip()
